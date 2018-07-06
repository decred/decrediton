import * as trezorjs from "trezor.js";
import trezorTransports from "trezor-link";
import * as wallet from "wallet";
import * as selectors from "selectors";
import { sprintf } from "sprintf-js";
import { rawHashToHex, rawToHex, hexToRaw } from "helpers";
import { publishTransactionAttempt } from "./ControlActions";

import { EXTERNALREQUEST_TREZOR_BRIDGE } from "main_dev/externalRequests";
import { SIGNTX_ATTEMPT, SIGNTX_FAILED, SIGNTX_SUCCESS } from "./ControlActions";

const hardeningConstant = 0x80000000;

// Right now (2018-07-06) dcrwallet only supports a single account on watch only
// wallets. Therefore we are limited to using this single account when signing
// transactions via trezor.
const WALLET_ACCOUNT = 0;

function addressPath(index, branch, account, coinType) {
  return [
    (44 | hardeningConstant) >>> 0, // purpose
    ((coinType || 0)| hardeningConstant) >>> 0, // coin type
    ((account || 0) | hardeningConstant) >>> 0, // account
    (branch || 0) >>> 0, // branch
    index >>> 0  // index
  ];
}

export const TRZ_LOADDEVICELIST_ATTEMPT = "TRZ_LOADDEVICELIST_ATTEMPT";
export const TRZ_LOADDEVICELIST_FAILED = "TRZ_LOADDEVICELIST_FAILED";
export const TRZ_LOADDEVICELIST_SUCCESS = "TRZ_LOADDEVICELIST_SUCCESS";
export const TRZ_DEVICELISTTRANSPORT_LOST = "TRZ_DEVICELISTTRANSPORT_LOST";
export const TRZ_SELECTEDDEVICE_CHANGED = "TRZ_SELECTEDDEVICE_CHANGED";

export const loadDeviceList = () => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    if (!getState().trezor.enabled) return;
    wallet.allowExternalRequest(EXTERNALREQUEST_TREZOR_BRIDGE);

    dispatch({ type: TRZ_LOADDEVICELIST_ATTEMPT });
    const debug = getState().trezor.debug;

    // TODO: decide whether we want to provide our own config blob.
    const configUrl = "https://wallet.trezor.io/data/config_signed.bin?"
      + Date.now();

    const opts = { debug, debugInfo: debug, configUrl,
      transport: new trezorTransports.BridgeV2() };
    const devList = new trezorjs.DeviceList(opts);
    let resolvedTransport = false;

    devList.on("transport", t => {
      console.log("transport", t);
      if (resolvedTransport) return;
      resolvedTransport = true; // resolved with success
      dispatch({ deviceList: devList, type: TRZ_LOADDEVICELIST_SUCCESS });
      resolve(t);
    });

    devList.on("error", err => {
      console.log("error", err);
      if (!resolvedTransport && err.message.includes("ECONNREFUSED")) {
        resolvedTransport = true; // resolved with failure
        dispatch({ error: err.message, type: TRZ_LOADDEVICELIST_FAILED });
        reject(err);
      } else if (err.message.includes("socket hang up")) {
        // this might happen any time throughout the app lifetime if the bridge
        // service is shutdown for any reason
        dispatch({ error: err.message, type: TRZ_DEVICELISTTRANSPORT_LOST });
      }
    });

    devList.on("connect", device => {
      console.log("connect", Object.keys(devList.devices), device);
      const currentDevice = getState().trezor.device;
      if (!currentDevice) {
        // first device connected. Use it.
        dispatch({ device, type: TRZ_SELECTEDDEVICE_CHANGED });
      }
    });

    devList.on("disconnect", device => {
      console.log("disconnect", Object.keys(devList.devices), device);
      const currentDevice = getState().trezor.device;
      if (currentDevice && device.originalDescriptor.path === currentDevice.originalDescriptor.path ) {
        const devicePaths = Object.keys(devList.devices);

        // we were using the device that was just disconnected. Pick a new
        // device to use.
        if (devicePaths.length === 0) {
          // no more devices left to use
          dispatch({ device: null, type: TRZ_SELECTEDDEVICE_CHANGED });
        } else {
          dispatch({ device: devList.devices[devicePaths[0]], type: TRZ_SELECTEDDEVICE_CHANGED });
        }
      }
    });

    devList.on("connectUnacquired", device => {
      console.log("connect unacquired", device);
    });

    devList.on("disconnectUnacquired", device => {
      console.log("d.catch(error => dispatch({ error, type: SIGNTX_FAILED }));isconnect unacquired", device);
    });

  });
};

export const selectDevice = (path) => async (dispatch, getState) => {
  const devList = getState().trezor.deviceList;
  if (!devList.devices[path]) return;
  dispatch({ device: devList.devices[path], type: TRZ_SELECTEDDEVICE_CHANGED });
};

export const signTransactionAttemptTrezor = (rawUnsigTx, constructTxResponse) => async (dispatch, getState) => {
  dispatch({ type: SIGNTX_ATTEMPT });

  const { grpc: { decodeMessageService, walletService } } = getState();
  const chainParams = selectors.chainParams(getState());

  const device = selectors.trezorDevice(getState());
  // TODO: handle not having device

  console.log("construct tx response", constructTxResponse);

  try {
    const decodedUnsigTxResp = await wallet.decodeTransaction(decodeMessageService, rawUnsigTx);
    const decodedUnsigTx = decodedUnsigTxResp.getTransaction();
    const inputTxs = await wallet.getInputTransactions(walletService,
      decodeMessageService, decodedUnsigTx);
    const refTxs = inputTxs.map(walletTxToRefTx);

    const changeIndex = constructTxResponse.getChangeIndex();
    const txInfo = await dispatch(walletTxToBtcjsTx(decodedUnsigTx,
      changeIndex, inputTxs));

    const signedRaw = await device.run(async session => {
      const signedResp = await session.signTx(txInfo.inputs, txInfo.outputs,
        refTxs, chainParams.trezorCoinName, 0);
      return signedResp.message.serialized.serialized_tx;
    });

    dispatch({ type: SIGNTX_SUCCESS });
    dispatch(publishTransactionAttempt(hexToRaw(signedRaw)));

  } catch (error) {
    dispatch({ error, type: SIGNTX_FAILED });
  }
};

// walletTxToBtcjsTx converts a tx decoded by the decred wallet (ie,
// returned from the decodeRawTransaction call) into a bitcoinjs-compatible
// transaction (to be used in trezor)
export const walletTxToBtcjsTx = (tx, changeIndex, inputTxs) => async (dispatch, getState) => {
  const { grpc: { walletService } } = getState();
  const chainParams = selectors.chainParams(getState());

  const inputTxsMap = inputTxs.reduce((m, tx) => {
    m[rawHashToHex(tx.getTransactionHash())] = tx;
    return m;
  }, {});

  const inputs = [];
  for (const inp of tx.getInputsList()) {
    const inputTx = inputTxsMap[rawHashToHex(inp.getPreviousTransactionHash())];
    if (!inputTx) throw "Cannot sign transaction without knowing source tx " +
      rawHashToHex(inp.getPreviousTransactionHash());

    const inputTxOut = inputTx.getOutputsList()[inp.getPreviousTransactionIndex()];
    if (!inputTxOut) throw sprintf("Trying to use unknown outpoint %s:%d as input",
      rawHashToHex(inp.getPreviousTransactionHash()), inp.getPreviousTransactionIndex());

    const addr = inputTxOut.getAddressesList()[0];
    if (!addr) throw sprintf("Outpoint %s:%d does not have addresses.",
      rawHashToHex(inp.getPreviousTransactionHash()), inp.getPreviousTransactionIndex());

    const addrValidResp = await wallet.validateAddress(walletService, addr);
    if (!addrValidResp.getIsValid()) throw "Input has an invalid address " + addr;

    // Trezor firmware (mcu) currently (2018-06-25) only support signing
    // when all inputs of the transaction are from the wallet. This happens
    // due to the fact that trezor firmware re-calculates the source
    // pkscript given the address_n of the input, instead of using it (the
    // pkscript) directly when hashing the tx prior to signing. This needs
    // to be changed so that we can perform more advanced types of
    // transactions.
    if (!addrValidResp.getIsMine()) throw "Trezor only supports signing when all inputs are from the wallet.";

    const addrIndex = addrValidResp.getIndex();
    const addrBranch = addrValidResp.getIsInternal() ? 1 : 0;
    inputs.push({
      prev_hash: rawHashToHex(inp.getPreviousTransactionHash()),
      prev_index: inp.getPreviousTransactionIndex(),
      amount: inp.getAmountIn(),
      sequence: inp.getSequence(),
      address_n: addressPath(addrIndex, addrBranch, WALLET_ACCOUNT,
        chainParams.HDCoinType),

      // FIXME: this needs to be supported on trezor.js.
      // decredTree: inp.getTree(),
      // decredScriptVersion: 0,
    });
  }

  const outputs = [];
  for (const outp of tx.getOutputsList()) {
    if (outp.getAddressesList().length != 1) {
      // TODO: this will be true on OP_RETURNs. Support those.
      throw "Output has different number of addresses than expected";
    }

    let addr = outp.getAddressesList()[0];
    const addrValidResp = await wallet.validateAddress(walletService, addr);
    if (!addrValidResp.getIsValid()) throw "Not a valid address: " + addr;
    let address_n = null;

    if (outp.getIndex() === changeIndex) {
      const addrIndex = addrValidResp.getIndex();
      const addrBranch = addrValidResp.getIsInternal() ? 1 : 0;
      address_n = addressPath(addrIndex, addrBranch, WALLET_ACCOUNT,
        chainParams.HDCoinType);
      addr = null;
    }

    outputs.push({
      amount: outp.getValue(),
      script_type: "PAYTOADDRESS", // needs to change on OP_RETURNs
      address: addr,
      address_n: address_n,
    });
  }

  const txInfo = {
    lock_time: tx.getLockTime(),
    version: tx.getVersion(),
    expiry: tx.getExpiry(),
    inputs,
    outputs
  };

  return txInfo;
};

// walletTxToRefTx converts a tx decoded by the decred wallet into a trezor
// RefTransaction object to be used with SignTx.
export function walletTxToRefTx(tx) {
  const inputs = tx.getInputsList().map(inp => ({
    amount: inp.getAmountIn(),
    prev_hash: rawHashToHex(inp.getPreviousTransactionHash()),
    prev_index: inp.getPreviousTransactionIndex(),

    // TODO: this needs to be supported on trezor.js
    // decredTree: inp.getTree(),
    // decredScriptVersion: 0,
  }));

  const bin_outputs = tx.getOutputsList().map(outp => ({
    amount: outp.getValue(),
    script_pubkey: rawToHex(outp.getScript()),
  }));

  const txInfo = {
    hash: rawHashToHex(tx.getTransactionHash()),
    lock_time: tx.getLockTime(),
    version: tx.getVersion(),
    expiry: tx.getExpiry(),
    inputs,
    bin_outputs,
  };

  return txInfo;
}
