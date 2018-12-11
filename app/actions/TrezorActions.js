import * as trezorjs from "trezor.js";
import trezorTransports from "trezor-link";
import * as wallet from "wallet";
import * as selectors from "selectors";
import fs from "fs";
import { sprintf } from "sprintf-js";
import { rawHashToHex, rawToHex, hexToRaw, str2utf8hex, hex2b64 } from "helpers";
import { publishTransactionAttempt } from "./ControlActions";
import { model1_decred_homescreen } from "helpers/trezor";
import { getWalletCfg } from "../config";

import { EXTERNALREQUEST_TREZOR_BRIDGE } from "main_dev/externalRequests";
import {
  SIGNTX_ATTEMPT, SIGNTX_FAILED, SIGNTX_SUCCESS,
  SIGNMESSAGE_ATTEMPT, SIGNMESSAGE_FAILED, SIGNMESSAGE_SUCCESS,
  VALIDATEMASTERPUBKEY_SUCCESS,
} from "./ControlActions";

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

function accountPath(account, coinType) {
  return [
    (44 | hardeningConstant) >>> 0, // purpose
    ((coinType || 0)| hardeningConstant) >>> 0, // coin type
    ((account || 0) | hardeningConstant) >>> 0  // account
  ];
}

export const TRZ_TREZOR_ENABLED = "TRZ_TREZOR_ENABLED";

export const enableTrezor = () => (dispatch, getState) => {
  const walletName = selectors.getWalletName(getState());

  if (walletName) {
    const config = getWalletCfg(selectors.isTestNet(getState()), walletName);
    config.set("trezor", true);
  }

  dispatch({ type: TRZ_TREZOR_ENABLED });

  const { trezor: { deviceList, getDeviceListAttempt } } = getState();
  if (!deviceList && !getDeviceListAttempt) {
    dispatch(loadDeviceList());
  }
};

export const TRZ_TREZOR_DISABLED = "TRZ_TREZOR_DISABLED";
// disableTrezor disables trezor integration for the current wallet. Note
// that it does **not** disable in the config, so the wallet will restart as a
// trezor wallet next time it's opened.
export const disableTrezor = () => (dispatch) => {
  dispatch(clearDeviceSession());
  dispatch({ type: TRZ_TREZOR_DISABLED });
};

export const TRZ_CLEAR_DEVICELIST = "TRZ_CLEAR_DEVICELIST";

export const reloadTrezorDeviceList = () => (dispatch) => {
  dispatch({ type: TRZ_CLEAR_DEVICELIST });
  dispatch(loadDeviceList());
};

export const TRZ_LOADDEVICELIST_ATTEMPT = "TRZ_LOADDEVICELIST_ATTEMPT";
export const TRZ_LOADDEVICELIST_FAILED = "TRZ_LOADDEVICELIST_FAILED";
export const TRZ_LOADDEVICELIST_SUCCESS = "TRZ_LOADDEVICELIST_SUCCESS";
export const TRZ_DEVICELISTTRANSPORT_LOST = "TRZ_DEVICELISTTRANSPORT_LOST";
export const TRZ_SELECTEDDEVICE_CHANGED = "TRZ_SELECTEDDEVICE_CHANGED";
export const TRZ_NOCONNECTEDDEVICE = "TRZ_NOCONNECTEDDEVICE";

export const loadDeviceList = () => (dispatch, getState) => {
  return new Promise((resolve, reject) => {
    const { trezor: { getDeviceListAttempt } } = getState();
    if (getDeviceListAttempt) return;

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
      debug && console.log("transport", t);
      if (resolvedTransport) return;
      resolvedTransport = true; // resolved with success
      dispatch({ deviceList: devList, type: TRZ_LOADDEVICELIST_SUCCESS });
      resolve(t);
    });

    devList.on("error", err => {
      debug && console.log("error", err);
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
      debug && console.log("connect", Object.keys(devList.devices), device);
      const currentDevice = getState().trezor.device;
      if (!currentDevice) {
        // first device connected. Use it.
        dispatch({ device, type: TRZ_SELECTEDDEVICE_CHANGED });
        setDeviceListeners(device, dispatch);
      }
    });

    devList.on("disconnect", device => {
      debug && console.log("disconnect", Object.keys(devList.devices), device);
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
      debug && console.log("connect unacquired", device);
    });

    devList.on("disconnectUnacquired", device => {
      debug && console.log("d.catch(error => dispatch({ error, type: SIGNTX_FAILED }));isconnect unacquired", device);
    });

  });
};

export const selectDevice = (path) => async (dispatch, getState) => {
  const devList = getState().trezor.deviceList;
  if (!devList.devices[path]) return;
  dispatch({ device: devList.devices[path], type: TRZ_SELECTEDDEVICE_CHANGED });
  setDeviceListeners(devList.devices[path], dispatch);
};

export const alertNoConnectedDevice = () => dispatch => {
  dispatch({ type: TRZ_NOCONNECTEDDEVICE });
};

export const TRZ_PIN_REQUESTED = "TRZ_PIN_REQUESTED";
export const TRZ_PIN_ENTERED = "TRZ_PIN_ENTERED";
export const TRZ_PIN_CANCELED = "TRZ_PIN_CANCELED";
export const TRZ_PASSPHRASE_REQUESTED = "TRZ_PASSPHRASE_REQUESTED";
export const TRZ_PASSPHRASE_ENTERED = "TRZ_PASSPHRASE_ENTERED";
export const TRZ_PASSPHRASE_CANCELED = "TRZ_PASSPHRASE_CANCELED";
export const TRZ_WORD_REQUESTED = "TRZ_WORD_REQUESTED";
export const TRZ_WORD_ENTERED = "TRZ_WORD_ENTERED";
export const TRZ_WORD_CANCELED = "TRZ_WORD_CANCELED";

function setDeviceListeners(device, dispatch) {
  device.on("pin", (pinMessage, pinCallBack) => {
    dispatch({ pinMessage, pinCallBack, type: TRZ_PIN_REQUESTED });
  });

  device.on("passphrase", (passPhraseCallBack) => {
    dispatch({ passPhraseCallBack, type: TRZ_PASSPHRASE_REQUESTED });
  });

  device.on("word", (wordCallBack) => {
    dispatch({ wordCallBack, type: TRZ_WORD_REQUESTED });
  });
}

// deviceRun is the main function for executing trezor operations. This handles
// cleanup for cancellations and device disconnections during mid-operation (eg:
// someone disconnected trezor while it was waiting for a pin input).
// In general, fn itself shouldn't handle errors, letting this function handle
// the common cases, which are then propagated up the call stack into fn's
// parent.
async function deviceRun(dispatch, getState, device, fn) {

  const handleError = error => {
    const { trezor: { waitingForPin, waitingForPassphrase, debug } } = getState();
    debug && console.log("Handle error no deviceRun", error);
    if (waitingForPin) dispatch({ error, type: TRZ_PIN_CANCELED });
    if (waitingForPassphrase) dispatch({ error, type: TRZ_PASSPHRASE_CANCELED });
    if (error instanceof Error) {
      if (error.message.includes("Inconsistent state")) {
        return "Device returned inconsistent state. Disconnect and reconnect the device.";
      }
    }
    return error;
  };

  try {
    return await device.run(async session => {
      try {
        return await fn(session);
      } catch (err) {
        // doesn't seem to be reachable by trezor interruptions, but might be
        // caused by fn() failing in some other way (even though it's
        // recommended not to do (non-trezor) lengthy operations inside fn())
        throw handleError(err);
      }
    });
  } catch (outerErr) {
    throw handleError(outerErr);
  }
}

export const TRZ_CANCELOPERATION_SUCCESS = "TRZ_CANCELOPERATION_SUCCESS";
export const TRZ_CANCELOPERATION_FAILED = "TRZ_CANCELOPERATION_FAILED";

// Note that calling this function while no pin/passphrase operation is running
// will attempt to steal the device, cancelling operations from apps *other
// than decrediton*.
export const cancelCurrentOperation = () => async (dispatch, getState) => {
  const device = selectors.trezorDevice(getState());
  const { trezor: { pinCallBack, passPhraseCallBack, wordCallBack } } = getState();

  if (!device) return;
  try {
    if (pinCallBack) await pinCallBack("cancelled", null);
    else if (passPhraseCallBack) await passPhraseCallBack("cancelled", null);
    else if (wordCallBack) await wordCallBack("cancelled", null);
    else await device.steal();

    dispatch({ type: TRZ_CANCELOPERATION_SUCCESS });
  } catch (error) {
    dispatch({ error, type: TRZ_CANCELOPERATION_FAILED });
    throw error;
  }
};

export const TRZ_CLEARDEVICESESSION_SUCCESS = "TRZ_CLEARDEVICESESSION_SUCCESS";
export const TRZ_CLEARDEVICESESSION_FAILED = "TRZ_CLEARDEVICESESSION_FAILED";

// Closes a device session, locking the device (if it requires a pin).
export const clearDeviceSession = () => async (dispatch, getState) => {
  const device = selectors.trezorDevice(getState());
  if (!device) return;

  await dispatch(cancelCurrentOperation());
  try {
    await deviceRun(dispatch, getState, device, async session => {
      await session.clearSession();
    });
    dispatch({ type: TRZ_CLEARDEVICESESSION_SUCCESS });
  } catch (error) {
    dispatch({ error, type: TRZ_CLEARDEVICESESSION_FAILED });
  }
};

export const submitPin = (pin) => (dispatch, getState) => {
  const { trezor: { pinCallBack } } = getState();
  dispatch({ type: TRZ_PIN_ENTERED });
  if (!pinCallBack) return;
  pinCallBack(null, pin);
};

export const submitPassPhrase = (passPhrase) => (dispatch, getState) => {
  const { trezor: { passPhraseCallBack } } = getState();
  dispatch({ type: TRZ_PASSPHRASE_ENTERED });
  if (!passPhraseCallBack) return;
  passPhraseCallBack(null, passPhrase);
};

export const submitWord = (word) => (dispatch, getState) => {
  const { trezor: { wordCallBack } } = getState();
  dispatch({ type: TRZ_WORD_ENTERED });
  if (!wordCallBack) return;
  wordCallBack(null, word);
};

// checkTrezorIsDcrwallet verifies whether the wallet currently running on
// dcrwallet (presumably a watch only wallet created from a trezor provided
// xpub) is the same wallet as the one of the currently connected trezor. This
// function throws an error if they are not the same.
// This is useful for making sure, prior to performing some wallet related
// function such as transaction signing, that trezor will correctly perform the
// operation.
// Note that this might trigger pin/passphrase modals, depending on the current
// trezor configuration.
// The way the check is performed is by generating the first address from the
// trezor wallet and then validating this address agains dcrwallet, ensuring
// this is an owned address at the appropriate branch/index.
// This check is only valid for a single session (ie, a single execution of
// `deviceRun`) as the physical device might change between sessions.
const checkTrezorIsDcrwallet = (session) => async (dispatch, getState) => {
  const { grpc: { walletService } } = getState();
  const chainParams = selectors.chainParams(getState());

  const address_n = addressPath(0, 0, WALLET_ACCOUNT, chainParams.HDCoinType);
  const resp = await session.getAddress(address_n, chainParams.trezorCoinName, false);
  const addr = resp.message.address;

  const addrValidResp = await wallet.validateAddress(walletService, addr);
  if (!addrValidResp.getIsValid()) throw "Trezor provided an invalid address " + addr;

  if (!addrValidResp.getIsMine()) throw "Trezor and dcrwallet not running from the same extended public key";

  if (addrValidResp.getIndex() !== 0) throw "Wallet replied with wrong index.";
};

export const signTransactionAttemptTrezor = (rawUnsigTx, constructTxResponse) => async (dispatch, getState) => {
  dispatch({ type: SIGNTX_ATTEMPT });

  const { grpc: { decodeMessageService, walletService }, trezor: { debug } } = getState();
  const chainParams = selectors.chainParams(getState());

  const device = selectors.trezorDevice(getState());
  if (!device) {
    dispatch({ error: "Device not connected", type: SIGNTX_FAILED });
    return;
  }

  debug && console.log("construct tx response", constructTxResponse);

  try {
    const decodedUnsigTxResp = await wallet.decodeTransaction(decodeMessageService, rawUnsigTx);
    const decodedUnsigTx = decodedUnsigTxResp.getTransaction();
    const inputTxs = await wallet.getInputTransactions(walletService,
      decodeMessageService, decodedUnsigTx);
    const refTxs = inputTxs.map(walletTxToRefTx);

    const changeIndex = constructTxResponse.getChangeIndex();
    const txInfo = await dispatch(walletTxToBtcjsTx(decodedUnsigTx,
      changeIndex, inputTxs));

    const signedRaw = await deviceRun(dispatch, getState, device, async session => {
      await dispatch(checkTrezorIsDcrwallet(session));

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

export const signMessageAttemptTrezor = (address, message) => async (dispatch, getState) => {

  dispatch({ type: SIGNMESSAGE_ATTEMPT });

  const device = selectors.trezorDevice(getState());
  if (!device) {
    dispatch({ error: "Device not connected", type: SIGNMESSAGE_FAILED });
    return;
  }

  const chainParams = selectors.chainParams(getState());
  const { grpc: { walletService } } = getState();

  try {
    const addrValidResp = await wallet.validateAddress(walletService, address);
    if (!addrValidResp.getIsValid()) throw "Input has an invalid address " + address;
    if (!addrValidResp.getIsMine()) throw "Trezor only supports signing with wallet addresses";
    const addrIndex = addrValidResp.getIndex();
    const addrBranch = addrValidResp.getIsInternal() ? 1 : 0;
    const address_n = addressPath(addrIndex, addrBranch, WALLET_ACCOUNT,
      chainParams.HDCoinType);

    const signedMsg = await deviceRun(dispatch, getState, device, async session => {
      await dispatch(checkTrezorIsDcrwallet(session));

      return await session.signMessage(address_n, str2utf8hex(message),
        chainParams.trezorCoinName, false);
    });

    const signature = hex2b64(signedMsg.message.signature);
    dispatch({ getSignMessageSignature: signature, type: SIGNMESSAGE_SUCCESS });

  } catch (error) {
    dispatch({ error, type: SIGNMESSAGE_FAILED });
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
      decred_tree: inp.getTree()

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
      decred_script_version: outp.getVersion(),
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
    decred_tree: inp.getTree()

    // TODO: this needs to be supported on trezor.js
    // decredTree: inp.getTree(),
    // decredScriptVersion: 0,
  }));

  const bin_outputs = tx.getOutputsList().map(outp => ({
    amount: outp.getValue(),
    script_pubkey: rawToHex(outp.getScript()),
    decred_script_version: outp.getVersion(),
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

export const TRZ_TOGGLEPINPROTECTION_ATTEMPT = "TRZ_TOGGLEPINPROTECTION_ATTEMPT";
export const TRZ_TOGGLEPINPROTECTION_FAILED = "TRZ_TOGGLEPINPROTECTION_FAILED";
export const TRZ_TOGGLEPINPROTECTION_SUCCESS = "TRZ_TOGGLEPINPROTECTION_SUCCESS";

export const togglePinProtection = () => async (dispatch, getState) => {

  const device = selectors.trezorDevice(getState());
  if (!device) {
    dispatch({ error: "Device not connected", type:  TRZ_TOGGLEPINPROTECTION_FAILED });
    return;
  }

  const clearProtection = !!device.features.pin_protection;
  dispatch({ clearProtection, type: TRZ_TOGGLEPINPROTECTION_ATTEMPT });

  try {
    await deviceRun(dispatch, getState, device, async session => {
      await session.changePin(clearProtection);
    });
    dispatch({ clearProtection, deviceLabel: device.features.label, type: TRZ_TOGGLEPINPROTECTION_SUCCESS });
  } catch (error) {
    dispatch({ error, type: TRZ_TOGGLEPINPROTECTION_FAILED });
  }
};

export const TRZ_TOGGLEPASSPHRASEPROTECTION_ATTEMPT = "TRZ_TOGGLEPASSPHRASEPROTECTION_ATTEMPT";
export const TRZ_TOGGLEPASSPHRASEPROTECTION_FAILED =  "TRZ_TOGGLEPASSPHRASEPROTECTION_FAILED";
export const TRZ_TOGGLEPASSPHRASEPROTECTION_SUCCESS = "TRZ_TOGGLEPASSPHRASEPROTECTION_SUCCESS";

export const togglePassPhraseProtection = () => async (dispatch, getState) => {

  const device = selectors.trezorDevice(getState());
  if (!device) {
    dispatch({ error: "Device not connected", type:  TRZ_TOGGLEPASSPHRASEPROTECTION_FAILED });
    return;
  }

  const enableProtection = !device.features.passphrase_protection;
  dispatch({ enableProtection, type: TRZ_TOGGLEPASSPHRASEPROTECTION_ATTEMPT });

  try {
    await deviceRun(dispatch, getState, device, async session => {
      await session.togglePassphrase(enableProtection);
    });
    dispatch({ enableProtection, deviceLabel: device.features.label, type: TRZ_TOGGLEPASSPHRASEPROTECTION_SUCCESS });
  } catch (error) {
    dispatch({ error, type: TRZ_TOGGLEPASSPHRASEPROTECTION_FAILED });
  }
};

export const TRZ_CHANGEHOMESCREEN_ATTEMPT = "TRZ_CHANGEHOMESCREEN_ATTEMPT";
export const TRZ_CHANGEHOMESCREEN_FAILED =  "TRZ_CHANGEHOMESCREEN_FAILED";
export const TRZ_CHANGEHOMESCREEN_SUCCESS = "TRZ_CHANGEHOMESCREEN_SUCCESS";

export const changeToDecredHomeScreen = () => async (dispatch, getState) => {
  const device = selectors.trezorDevice(getState());
  if (!device) {
    dispatch({ error: "Device not connected", type:  TRZ_TOGGLEPASSPHRASEPROTECTION_FAILED });
    return;
  }

  dispatch({ type: TRZ_CHANGEHOMESCREEN_ATTEMPT });

  try {
    await deviceRun(dispatch, getState, device, async session => {
      await session.changeHomescreen(model1_decred_homescreen);
    });
    dispatch({ type: TRZ_CHANGEHOMESCREEN_SUCCESS });
  } catch (error) {
    dispatch({ error, type: TRZ_CHANGEHOMESCREEN_FAILED });
  }
};

export const TRZ_CHANGELABEL_ATTEMPT = "TRZ_CHANGELABEL_ATTEMPT";
export const TRZ_CHANGELABEL_FAILED =  "TRZ_CHANGELABEL_FAILED";
export const TRZ_CHANGELABEL_SUCCESS = "TRZ_CHANGELABEL_SUCCESS";

export const changeLabel = (label) => async (dispatch, getState) => {
  const device = selectors.trezorDevice(getState());
  if (!device) {
    dispatch({ error: "Device not connected", type:  TRZ_CHANGELABEL_FAILED });
    return;
  }

  dispatch({ type: TRZ_CHANGELABEL_ATTEMPT });

  try {
    await deviceRun(dispatch, getState, device, async session => {
      await session.changeLabel(label);
    });
    dispatch({ deviceLabel: label, type: TRZ_CHANGELABEL_SUCCESS });
  } catch (error) {
    dispatch({ error, type: TRZ_CHANGELABEL_FAILED });
  }
};

export const TRZ_WIPEDEVICE_ATTEMPT = "TRZ_WIPEDEVICE_ATTEMPT";
export const TRZ_WIPEDEVICE_FAILED =  "TRZ_WIPEDEVICE_FAILED";
export const TRZ_WIPEDEVICE_SUCCESS = "TRZ_WIPEDEVICE_SUCCESS";

export const wipeDevice = () => async (dispatch, getState) => {
  const device = selectors.trezorDevice(getState());
  if (!device) {
    dispatch({ error: "Device not connected", type:  TRZ_WIPEDEVICE_FAILED });
    return;
  }

  dispatch({ type: TRZ_WIPEDEVICE_ATTEMPT });

  try {
    await deviceRun(dispatch, getState, device, async session => {
      await session.wipeDevice();
    });
    dispatch({ type: TRZ_WIPEDEVICE_SUCCESS });
  } catch (error) {
    dispatch({ error, type: TRZ_WIPEDEVICE_FAILED });
  }
};

export const TRZ_RECOVERDEVICE_ATTEMPT = "TRZ_RECOVERDEVICE_ATTEMPT";
export const TRZ_RECOVERDEVICE_FAILED =  "TRZ_RECOVERDEVICE_FAILED";
export const TRZ_RECOVERDEVICE_SUCCESS = "TRZ_RECOVERDEVICE_SUCCESS";

export const recoverDevice = () => async (dispatch, getState) => {
  const device = selectors.trezorDevice(getState());
  if (!device) {
    dispatch({ error: "Device not connected", type:  TRZ_RECOVERDEVICE_FAILED });
    return;
  }

  dispatch({ type: TRZ_RECOVERDEVICE_ATTEMPT });

  try {
    await deviceRun(dispatch, getState, device, async session => {
      const settings = {
        word_count: 24, // FIXED at 24 (256 bits)
        passphrase_protection: false,
        pin_protection: false,
        label: "New DCR Trezor",
        dry_run: false,
      };

      await session.recoverDevice(settings);
    });
    dispatch({ type: TRZ_RECOVERDEVICE_SUCCESS });
  } catch (error) {
    dispatch({ error, type: TRZ_RECOVERDEVICE_FAILED });
  }
};

export const TRZ_INITDEVICE_ATTEMPT = "TRZ_INITDEVICE_ATTEMPT";
export const TRZ_INITDEVICE_FAILED =  "TRZ_INITDEVICE_FAILED";
export const TRZ_INITDEVICE_SUCCESS = "TRZ_INITDEVICE_SUCCESS";

export const initDevice = () => async (dispatch, getState) => {
  const device = selectors.trezorDevice(getState());
  if (!device) {
    dispatch({ error: "Device not connected", type:  TRZ_RECOVERDEVICE_FAILED });
    return;
  }

  dispatch({ type: TRZ_INITDEVICE_ATTEMPT });

  try {
    await deviceRun(dispatch, getState, device, async session => {
      const settings = {
        strength: 256, // 24 words
        passphrase_protection: false,
        pin_protection: false,
        label: "New DCR Trezor",
      };

      await session.resetDevice(settings);
    });
    dispatch({ type: TRZ_INITDEVICE_SUCCESS });
  } catch (error) {
    dispatch({ error, type: TRZ_INITDEVICE_FAILED });
  }
};

export const TRZ_UPDATEFIRMWARE_ATTEMPT = "TRZ_UPDATEFIRMWARE_ATTEMPT";
export const TRZ_UPDATEFIRMWARE_FAILED =  "TRZ_UPDATEFIRMWARE_FAILED";
export const TRZ_UPDATEFIRMWARE_SUCCESS = "TRZ_UPDATEFIRMWARE_SUCCESS";

export const updateFirmware = (path) => async (dispatch, getState) => {
  const device = selectors.trezorDevice(getState());
  if (!device) {
    dispatch({ error: "Device not connected", type:  TRZ_UPDATEFIRMWARE_FAILED });
    return;
  }

  dispatch({ type: TRZ_UPDATEFIRMWARE_ATTEMPT });

  try {
    const rawFirmware = fs.readFileSync(path);
    const hexFirmware = rawToHex(rawFirmware);

    await deviceRun(dispatch, getState, device, async session => {
      await session.updateFirmware(hexFirmware);
    });
    dispatch({ type: TRZ_UPDATEFIRMWARE_SUCCESS });
  } catch (error) {
    dispatch({ error, type: TRZ_UPDATEFIRMWARE_FAILED });
  }
};

export const TRZ_GETWALLETCREATIONMASTERPUBKEY_ATTEMPT = "TRZ_GETWALLETCREATIONMASTERPUBKEY_ATTEMPT";
export const TRZ_GETWALLETCREATIONMASTERPUBKEY_FAILED = "TRZ_GETWALLETCREATIONMASTERPUBKEY_FAILED";
export const TRZ_GETWALLETCREATIONMASTERPUBKEY_SUCCESS = "TRZ_GETWALLETCREATIONMASTERPUBKEY_SUCCESS";

export const getWalletCreationMasterPubKey = () => async (dispatch, getState) => {
  dispatch({ type: TRZ_GETWALLETCREATIONMASTERPUBKEY_ATTEMPT });

  const device = selectors.trezorDevice(getState());
  if (!device) {
    dispatch({ error: "Device not connected", type:  TRZ_GETWALLETCREATIONMASTERPUBKEY_FAILED });
    return;
  }

  const chainParams = selectors.chainParams(getState());

  try {
    const path = accountPath(WALLET_ACCOUNT, chainParams.HDCoinType);

    const masterPubKey = await deviceRun(dispatch, getState, device, async session => {
      const res = await session.getPublicKey(path, chainParams.trezorCoinName, false);
      return res.message.xpub;
    });

    dispatch({ type: VALIDATEMASTERPUBKEY_SUCCESS, isWatchOnly: true, masterPubKey });
    dispatch({ type: TRZ_GETWALLETCREATIONMASTERPUBKEY_SUCCESS });
  } catch (error) {
    dispatch({ error, type:  TRZ_GETWALLETCREATIONMASTERPUBKEY_FAILED });
    throw error;
  }
};
