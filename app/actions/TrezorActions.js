import * as wallet from "wallet";
import * as selectors from "selectors";
import { hexToBytes, str2utf8hex } from "helpers";
import {
  walletTxToBtcjsTx,
  walletTxToRefTx,
  WALLET_ACCOUNT,
  accountPath,
  addressPath
} from "helpers/trezor";
import { publishTransactionAttempt } from "./ControlActions";
import { model1_decred_homescreen, modelT_decred_homescreen } from "constants/trezor";
import * as cfgConstants from "constants/config";
import { getWalletCfg } from "config";
import { EXTERNALREQUEST_TREZOR_BRIDGE } from "main_dev/externalRequests";
import {
  SIGNTX_ATTEMPT,
  SIGNTX_FAILED,
  SIGNTX_SUCCESS,
  SIGNMESSAGE_ATTEMPT,
  SIGNMESSAGE_FAILED,
  SIGNMESSAGE_SUCCESS
} from "./ControlActions";
import { getAmountFromTxInputs, getTxFromInputs } from "./TransactionActions";
import { ipcRenderer } from "electron";

const session = require("connect").default;
const { TRANSPORT_EVENT, UI, UI_EVENT, DEVICE_EVENT } = require("connect");
const CHANGE = "device-changed";
const DISCONNECT = "device-disconnect";
const CONNECT = "device-connect";
const AQUIRED = "acquired";
const NOBACKUP = "no-backup";
const TRANSPORT_ERROR = "transport-error";
const TRANSPORT_START = "transport-start";
const BOOTLOADER_MODE = "bootloader";

let setListeners = false;

export const TRZ_TREZOR_ENABLED = "TRZ_TREZOR_ENABLED";

// enableTrezor attepts to start a connection with connect if none exist and
// connect to a trezor device.
export const enableTrezor = () => (dispatch, getState) => {
  const walletName = selectors.getWalletName(getState());

  if (walletName) {
    const config = getWalletCfg(selectors.isTestNet(getState()), walletName);
    config.set(cfgConstants.TREZOR, true);
  }

  dispatch({ type: TRZ_TREZOR_ENABLED });

  if (!setListeners) {
    setDeviceListeners(dispatch, getState);
    setListeners = true;
  };
  connect()(dispatch, getState);
};

export const initTransport = async (session, debug) => {
  await session.init({
    connectSrc: "https://localhost:8088/",
    env: "web",
    lazyLoad: false,
    popup: false,
    manifest: {
      email: "joegruffins@gmail.com",
      appUrl: "https://github.com/decred/decrediton"
    },
    debug: debug
  })
    .catch(err => {
      throw err;
    });
};

export const TRZ_CONNECT_ATTEMPT = "TRZ_CONNECT_ATTEMPT";
export const TRZ_CONNECT_FAILED = "TRZ_CONNECT_FAILED";
export const TRZ_CONNECT_SUCCESS = "TRZ_CONNECT_SUCCESS";

export const connect = () => async (dispatch, getState) => {
  const {
    trezor: { connected, connectAttempt }
  } = getState();
  if (connected || connectAttempt) return;
  dispatch({ type: TRZ_CONNECT_ATTEMPT });

  wallet.allowExternalRequest(EXTERNALREQUEST_TREZOR_BRIDGE);

  const debug = getState().trezor.debug;
  await initTransport(session, debug)
    .catch(error => {
      dispatch({ error, type: TRZ_CONNECT_FAILED });
      return;
    });
  dispatch({ type: TRZ_CONNECT_SUCCESS });
};

export const TRZ_TREZOR_DISABLED = "TRZ_TREZOR_DISABLED";

// disableTrezor disables trezor integration for the current wallet. Note
// that it does **not** disable in the config, so the wallet will restart as a
// trezor wallet next time it's opened.
export const disableTrezor = () => (dispatch) => {
  dispatch({ type: TRZ_TREZOR_DISABLED });
};

export const TRZ_LOADDEVICE = "TRZ_LOADDEVICE";
export const TRZ_DEVICETRANSPORT_LOST = "TRZ_DEVICETRANSPORT_LOST";
export const TRZ_DEVICETRANSPORT_START = "TRZ_DEVICETRANSPORT_START";
export const TRZ_SELECTEDDEVICE_CHANGED = "TRZ_SELECTEDDEVICE_CHANGED";
export const TRZ_NOCONNECTEDDEVICE = "TRZ_NOCONNECTEDDEVICE";

function onChange(dispatch, getState, features) {
  if (features == null) throw "no features on change";
  const currentDevice = selectors.trezorDevice(getState());
  // No current device handle by connect.
  if (!currentDevice) return;
  let device = features.id;
  if (features.mode == BOOTLOADER_MODE) {
    device = BOOTLOADER_MODE;
  }
  if (device == currentDevice) return;
  const deviceLabel = features.label;
  dispatch({ deviceLabel, device, type: TRZ_SELECTEDDEVICE_CHANGED });
};

function onConnect(dispatch, getState, features) {
  if (features == null) throw "no features on connect";
  let device = features.id;
  const deviceLabel = features.label;
  if (features.mode == BOOTLOADER_MODE) {
    device = BOOTLOADER_MODE;
  }
  dispatch({ deviceLabel, device, type: TRZ_LOADDEVICE });
  return device;
};

function onDisconnect(dispatch, getState, features) {
  if (features == null) throw "no features on disconnect";
  const currentDevice = selectors.trezorDevice(getState());
  const device = features.id;
  // If this is not the device we presume is current, ignore.
  if (device != currentDevice) {
    return;
  }
  alertNoConnectedDevice()(dispatch);
};

function noDevice(getState) {
  const device = selectors.trezorDevice(getState());
  if (!device) {
    return true;
  }
  return false;
}

export const alertNoConnectedDevice = () => (dispatch) => {
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
export const TRZ_NOTBACKEDUP = "TRZ_NOTBACKEDUP";

function setDeviceListeners(dispatch, getState) {
  session.on(TRANSPORT_EVENT, (event) => {
    const type = event.type;
    switch (type) {
      case TRANSPORT_ERROR:
        dispatch({ error: event.payload.error, type: TRZ_DEVICETRANSPORT_LOST });
        break;
      case TRANSPORT_START:
        dispatch({ type: TRZ_DEVICETRANSPORT_START });
        break;
    };
  });

  session.on(DEVICE_EVENT, (event) => {
    const type = event.type;
    switch (type) {
      case CHANGE:
        if (event.payload && event.payload.type == AQUIRED) {
          onChange(dispatch, getState, event.payload);
        }
        break;
      case CONNECT:
        onConnect(dispatch, getState, event.payload);
        break;
      case DISCONNECT:
        onDisconnect(dispatch, getState, event.payload);
        break;
    };
  });

  // TODO: Trezor needs some time to start listening for the responses to its
  // requests. Find a better way than static sleeps to accomplish this.
  session.on(UI_EVENT, async (event) => {
    const type = event.type;
    switch (type) {
      case UI.REQUEST_CONFIRMATION:
        // Some requests require the device to be backed up. We are offered a
        // chance to start the backup now. Refuse and inform the user via
        // snackbar that they must backup before performing this operation.
        if (event.payload.view == NOBACKUP) {
          await new Promise(r => setTimeout(r, 2000));
          session.uiResponse({
            type: UI.RECEIVE_CONFIRMATION,
            payload: false
          });
        };
        dispatch({ type: TRZ_NOTBACKEDUP });
        break;
      case UI.REQUEST_PASSPHRASE: {
        console.log("passphrase requested, waiting two seconds to respond");
        await new Promise(r => setTimeout(r, 2000));
        const passPhraseCallBack = (canceled, passphrase) => {
          if (canceled) {
            session.cancel();
          } else {
            session.uiResponse({
              type: UI.RECEIVE_PASSPHRASE,
              payload: {
                value: passphrase,
                save: true
              }
            });
          }
        };
        dispatch({ passPhraseCallBack, type: TRZ_PASSPHRASE_REQUESTED });
        break;
      }
      case UI.REQUEST_PIN: {
        console.log("pin requested, waiting two seconds to respond");
        await new Promise(r => setTimeout(r, 2000));
        const pinCallBack = (canceled, pin) => {
          if (canceled) {
            session.cancel();
          } else {
            session.uiResponse({
              type: UI.RECEIVE_PIN,
              payload: pin
            });
          }
        };
        dispatch({ pinCallBack, type: TRZ_PIN_REQUESTED });
        break;
      }
      case UI.REQUEST_WORD: {
        console.log("word requested, waiting two seconds to respond");
        await new Promise(r => setTimeout(r, 2000));
        const wordCallBack = (canceled, word) => {
          if (canceled) {
            session.cancel();
          } else {
            session.uiResponse({
              type: UI.RECEIVE_WORD,
              payload: word
            });
          }
        };
        dispatch({ wordCallBack, type: TRZ_WORD_REQUESTED });
        break;
      }
    }
  });
}

// deviceRun is the main function for executing trezor operations. This handles
// cleanup for cancellations and device disconnections during mid-operation (eg:
// someone disconnected trezor while it was waiting for a pin input).
// In general, fn itself shouldn't handle errors, letting this function handle
// the common cases, which are then propagated up the call stack into fn's
// parent.
async function deviceRun(dispatch, getState, fn) {
  if (noDevice(getState)) throw "no trezor device";
  const handleError = (error) => {
    const {
      trezor: { waitingForPin, waitingForPassphrase }
    } = getState();
    if (waitingForPin) dispatch({ error, type: TRZ_PIN_CANCELED });
    if (waitingForPassphrase)
      dispatch({ error, type: TRZ_PASSPHRASE_CANCELED });
    if (error instanceof Error) {
      if (error.message.includes("Inconsistent state")) {
        return "Device returned inconsistent state. Disconnect and reconnect the device.";
      }
    }
    return error;
  };

  try {
    const res = await fn();
    if (res && res.error) throw handleError(res.error);
    return res;
  } catch (error) {
    throw handleError(error);
  }
};

const getFeatures = async (
  dispatch,
  getState
) => {
  const features = await deviceRun(
    dispatch,
    getState,
    async () => {
      const res = await session.getFeatures();
      return res.payload;
    }
  );
  return features;
};

export const TRZ_CANCELOPERATION_SUCCESS = "TRZ_CANCELOPERATION_SUCCESS";
export const TRZ_CANCELOPERATION_FAILED = "TRZ_CANCELOPERATION_FAILED";

// TODO: Add the ability to logout of trezor/clear session.
export const cancelCurrentOperation = () => async (dispatch, getState) => {
  if (noDevice(getState)) return;

  const {
    trezor: { pinCallBack, passPhraseCallBack, wordCallBack }
  } = getState();

  try {
    if (pinCallBack) await pinCallBack("cancelled", null);
    else if (passPhraseCallBack) await passPhraseCallBack("cancelled", null);
    else if (wordCallBack) await wordCallBack("cancelled", null);

    dispatch({ type: TRZ_CANCELOPERATION_SUCCESS });
  } catch (error) {
    dispatch({ error, type: TRZ_CANCELOPERATION_FAILED });
    throw error;
  }
};

export const submitPin = (pin) => (dispatch, getState) => {
  const {
    trezor: { pinCallBack }
  } = getState();
  dispatch({ type: TRZ_PIN_ENTERED });
  if (!pinCallBack) return;
  pinCallBack(false, pin);
};

export const submitPassPhrase = (passPhrase) => (dispatch, getState) => {
  const {
    trezor: { passPhraseCallBack }
  } = getState();
  dispatch({ type: TRZ_PASSPHRASE_ENTERED });
  if (!passPhraseCallBack) return;
  passPhraseCallBack(false, passPhrase);
};

export const submitWord = (word) => (dispatch, getState) => {
  const {
    trezor: { wordCallBack }
  } = getState();
  dispatch({ type: TRZ_WORD_ENTERED });
  if (!wordCallBack) return;
  wordCallBack(false, word);
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
const checkTrezorIsDcrwallet = () => async (dispatch, getState) => {
  const {
    grpc: { walletService }
  } = getState();
  const chainParams = selectors.chainParams(getState());

  const address_n = addressPath(0, 0, WALLET_ACCOUNT, chainParams.HDCoinType);
  const payload = await deviceRun(
    dispatch,
    getState,
    async () => {
      const res = await session.getAddress({
        path: address_n,
        coin: chainParams.trezorCoinName,
        showOnTrezor: false
      });
      return res.payload;
    }
  );
  const addr = payload.address;

  const addrValidResp = await wallet.validateAddress(walletService, addr);
  if (!addrValidResp.getIsValid())
    throw "Trezor provided an invalid address " + addr;

  if (!addrValidResp.getIsMine())
    throw "Trezor and dcrwallet not running from the same extended public key";

  if (addrValidResp.getIndex() !== 0) throw "Wallet replied with wrong index.";
};

export const signTransactionAttemptTrezor = (
  rawUnsigTx,
  constructTxResponse
) => async (dispatch, getState) => {
  dispatch({ type: SIGNTX_ATTEMPT });

  const {
    grpc: { walletService },
    trezor: { debug }
  } = getState();
  const chainParams = selectors.chainParams(getState());

  debug && console.log("construct tx response", constructTxResponse);

  try {
    const changeIndex = constructTxResponse.getChangeIndex();

    const decodedUnsigTxResp = wallet.decodeRawTransaction(
      Buffer.from(rawUnsigTx),
      chainParams
    );
    const unsignedTx = await dispatch(
      getAmountFromTxInputs(decodedUnsigTxResp)
    );
    const txCompletedInputs = await dispatch(getAmountFromTxInputs(unsignedTx));
    const inputTxs = await dispatch(getTxFromInputs(unsignedTx));
    const { inputs, outputs } = await walletTxToBtcjsTx(
      walletService,
      chainParams,
      txCompletedInputs,
      inputTxs,
      changeIndex
    );

    const refTxs = await Promise.all(
      inputTxs.map(inpTx => walletTxToRefTx(walletService, inpTx))
    );

    const payload = await deviceRun(
      dispatch,
      getState,
      async () => {
        await dispatch(checkTrezorIsDcrwallet());

        const res = await session.signTransaction({
          inputs: inputs,
          outputs: outputs,
          refTxs: refTxs,
          coin: chainParams.trezorCoinName
        });
        return res.payload;
      }
    );
    const signedRaw = payload.serializedTx;

    dispatch({ type: SIGNTX_SUCCESS });
    dispatch(publishTransactionAttempt(hexToBytes(signedRaw)));
  } catch (error) {
    dispatch({ error, type: SIGNTX_FAILED });
  }
};

export const signMessageAttemptTrezor = (address, message) => async (
  dispatch,
  getState
) => {
  dispatch({ type: SIGNMESSAGE_ATTEMPT });

  if (noDevice(getState)) {
    dispatch({ error: "Device not connected", type: SIGNMESSAGE_FAILED });
    return;
  }

  const chainParams = selectors.chainParams(getState());
  const {
    grpc: { walletService }
  } = getState();

  try {
    const addrValidResp = await wallet.validateAddress(walletService, address);
    if (!addrValidResp.getIsValid())
      throw "Input has an invalid address " + address;
    if (!addrValidResp.getIsMine())
      throw "Trezor only supports signing with wallet addresses";
    const addrIndex = addrValidResp.getIndex();
    const addrBranch = addrValidResp.getIsInternal() ? 1 : 0;
    const address_n = addressPath(
      addrIndex,
      addrBranch,
      WALLET_ACCOUNT,
      chainParams.HDCoinType
    );

    const payload = await deviceRun(
      dispatch,
      getState,
      async () => {
        await dispatch(checkTrezorIsDcrwallet());

        const res = await session.signMessage({
          path: address_n,
          coin: chainParams.trezorCoinName,
          message: str2utf8hex(message),
          hex: true
        });
        return res.payload;
      }
    );
    dispatch({ getSignMessageSignature: payload.signature, type: SIGNMESSAGE_SUCCESS });
  } catch (error) {
    dispatch({ error, type: SIGNMESSAGE_FAILED });
  }
};

export const TRZ_TOGGLEPINPROTECTION_ATTEMPT =
  "TRZ_TOGGLEPINPROTECTION_ATTEMPT";
export const TRZ_TOGGLEPINPROTECTION_FAILED = "TRZ_TOGGLEPINPROTECTION_FAILED";
export const TRZ_TOGGLEPINPROTECTION_SUCCESS =
  "TRZ_TOGGLEPINPROTECTION_SUCCESS";

export const togglePinProtection = () => async (dispatch, getState) => {
  dispatch({ type: TRZ_TOGGLEPINPROTECTION_ATTEMPT });

  const features = await getFeatures(dispatch, getState)
    .catch(error => {
      dispatch({ error, type: TRZ_TOGGLEPINPROTECTION_FAILED });
      return;
    });

  const clearProtection = !!features.pin_protection;

  try {
    await deviceRun(dispatch, getState, async () => {
      const res = await session.changePin({
        remove: clearProtection
      });
      return res.payload;
    });
    dispatch({
      clearProtection,
      deviceLabel: features.label,
      type: TRZ_TOGGLEPINPROTECTION_SUCCESS
    });
  } catch (error) {
    dispatch({ error, type: TRZ_TOGGLEPINPROTECTION_FAILED });
  };
};

export const TRZ_TOGGLEPASSPHRASEPROTECTION_ATTEMPT =
  "TRZ_TOGGLEPASSPHRASEPROTECTION_ATTEMPT";
export const TRZ_TOGGLEPASSPHRASEPROTECTION_FAILED =
  "TRZ_TOGGLEPASSPHRASEPROTECTION_FAILED";
export const TRZ_TOGGLEPASSPHRASEPROTECTION_SUCCESS =
  "TRZ_TOGGLEPASSPHRASEPROTECTION_SUCCESS";

export const togglePassPhraseProtection = () => async (dispatch, getState) => {
  dispatch({ type: TRZ_TOGGLEPASSPHRASEPROTECTION_ATTEMPT });

  const features = await getFeatures(dispatch, getState)
    .catch(error => {
      dispatch({ error, type: TRZ_TOGGLEPASSPHRASEPROTECTION_FAILED });
      return;
    });

  const enableProtection = !features.passphrase_protection;

  try {
    await deviceRun(dispatch, getState, async () => {
      const res = await session.applySettings({
        use_passphrase: enableProtection
      });
      return res.payload;
    });
    dispatch({
      enableProtection,
      deviceLabel: features.label,
      type: TRZ_TOGGLEPASSPHRASEPROTECTION_SUCCESS
    });
  } catch (error) {
    dispatch({ error, type: TRZ_TOGGLEPASSPHRASEPROTECTION_FAILED });
  };
};

export const TRZ_CHANGEHOMESCREEN_ATTEMPT = "TRZ_CHANGEHOMESCREEN_ATTEMPT";
export const TRZ_CHANGEHOMESCREEN_FAILED = "TRZ_CHANGEHOMESCREEN_FAILED";
export const TRZ_CHANGEHOMESCREEN_SUCCESS = "TRZ_CHANGEHOMESCREEN_SUCCESS";

export const changeToDecredHomeScreen = () => async (dispatch, getState) => {
  dispatch({ type: TRZ_CHANGEHOMESCREEN_ATTEMPT });

  const features = await getFeatures(dispatch, getState)
    .catch(error => {
      dispatch({ error, type: TRZ_CHANGEHOMESCREEN_FAILED });
      return;
    });

  const hs = features.model == "T" ? modelT_decred_homescreen : model1_decred_homescreen;

  try {
    await deviceRun(dispatch, getState, async () => {
      const res = await session.applySettings({
        homescreen: hs
      });
      return res.payload;
    });
    dispatch({ type: TRZ_CHANGEHOMESCREEN_SUCCESS });
  } catch (error) {
    dispatch({ error, type: TRZ_CHANGEHOMESCREEN_FAILED });
  };
};

export const TRZ_CHANGELABEL_ATTEMPT = "TRZ_CHANGELABEL_ATTEMPT";
export const TRZ_CHANGELABEL_FAILED = "TRZ_CHANGELABEL_FAILED";
export const TRZ_CHANGELABEL_SUCCESS = "TRZ_CHANGELABEL_SUCCESS";

export const changeLabel = (label) => async (dispatch, getState) => {
  dispatch({ type: TRZ_CHANGELABEL_ATTEMPT });

  if (noDevice(getState)) {
    dispatch({ error: "Device not connected", type: TRZ_CHANGELABEL_FAILED });
    return;
  }

  try {
    await deviceRun(dispatch, getState, async () => {
      const res = await session.applySettings({
        label: label
      });
      return res.payload;
    });
    dispatch({ deviceLabel: label, type: TRZ_CHANGELABEL_SUCCESS });
  } catch (error) {
    dispatch({ error, type: TRZ_CHANGELABEL_FAILED });
  };
};

export const TRZ_WIPEDEVICE_ATTEMPT = "TRZ_WIPEDEVICE_ATTEMPT";
export const TRZ_WIPEDEVICE_FAILED = "TRZ_WIPEDEVICE_FAILED";
export const TRZ_WIPEDEVICE_SUCCESS = "TRZ_WIPEDEVICE_SUCCESS";

export const wipeDevice = () => async (dispatch, getState) => {
  dispatch({ type: TRZ_WIPEDEVICE_ATTEMPT });

  if (noDevice(getState)) {
    dispatch({ error: "Device not connected", type: TRZ_WIPEDEVICE_FAILED });
    return;
  }

  try {
    await deviceRun(dispatch, getState, async () => {
      const res = await session.wipeDevice();
      return res.payload;
    });
    dispatch({ type: TRZ_WIPEDEVICE_SUCCESS });
  } catch (error) {
    dispatch({ error, type: TRZ_WIPEDEVICE_FAILED });
  };
};

export const TRZ_RECOVERDEVICE_ATTEMPT = "TRZ_RECOVERDEVICE_ATTEMPT";
export const TRZ_RECOVERDEVICE_FAILED = "TRZ_RECOVERDEVICE_FAILED";
export const TRZ_RECOVERDEVICE_SUCCESS = "TRZ_RECOVERDEVICE_SUCCESS";

export const recoverDevice = () => async (dispatch, getState) => {
  dispatch({ type: TRZ_RECOVERDEVICE_ATTEMPT });

  if (noDevice(getState)) {
    dispatch({ error: "Device not connected", type: TRZ_RECOVERDEVICE_FAILED });
    return;
  }

  try {
    await deviceRun(dispatch, getState, async () => {
      const settings = {
        word_count: 24, // FIXED at 24 (256 bits)
        passphrase_protection: false,
        pin_protection: false,
        label: "New DCR Trezor",
        enforce_wordlist: true,
        dry_run: false
      };

      const res = await session.recoveryDevice(settings);
      return res.payload;
    });
    dispatch({ type: TRZ_RECOVERDEVICE_SUCCESS });
  } catch (error) {
    dispatch({ error, type: TRZ_RECOVERDEVICE_FAILED });
  }
};

export const TRZ_INITDEVICE_ATTEMPT = "TRZ_INITDEVICE_ATTEMPT";
export const TRZ_INITDEVICE_FAILED = "TRZ_INITDEVICE_FAILED";
export const TRZ_INITDEVICE_SUCCESS = "TRZ_INITDEVICE_SUCCESS";

export const initDevice = () => async (dispatch, getState) => {
  dispatch({ type: TRZ_INITDEVICE_ATTEMPT });

  if (noDevice(getState)) {
    dispatch({ error: "Device not connected", type: TRZ_INITDEVICE_FAILED });
    return;
  }

  try {
    await deviceRun(dispatch, getState, async () => {
      const settings = {
        strength: 256, // 24 words
        passphrase_protection: false,
        pin_protection: false,
        label: "New DCR Trezor"
      };

      const res = await session.resetDevice(settings);
      return res.payload;
    });
    dispatch({ type: TRZ_INITDEVICE_SUCCESS });
  } catch (error) {
    dispatch({ error, type: TRZ_INITDEVICE_FAILED });
  }
};

export const TRZ_BACKUPDEVICE_ATTEMPT = "TRZ_BACKUPDEVICE_ATTEMPT";
export const TRZ_BACKUPDEVICE_FAILED = "TRZ_BACKUPDEVICE_FAILED";
export const TRZ_BACKUPDEVICE_SUCCESS = "TRZ_BACKUPDEVICE_SUCCESS";

export const backupDevice = () => async (dispatch, getState) => {
  dispatch({ type: TRZ_BACKUPDEVICE_ATTEMPT });

  const features = await getFeatures(dispatch, getState)
    .catch(error => {
      dispatch({ error, type: TRZ_BACKUPDEVICE_FAILED });
      return;
    });
  if (features.unfinished_backup) {
    const error = "backup in unrecoverable state";
    dispatch({ error, type: TRZ_BACKUPDEVICE_FAILED });
    return;
  }
  if (!features.needs_backup) {
    const error = "already backed up";
    dispatch({ error, type: TRZ_BACKUPDEVICE_FAILED });
    return;
  }
  try {
    await deviceRun(dispatch, getState, async () => {
      const res = await session.backupDevice();
      return res.payload;
    });
    dispatch({ type: TRZ_BACKUPDEVICE_SUCCESS });
  } catch (error) {
    dispatch({ error, type: TRZ_BACKUPDEVICE_FAILED });
  }
};


export const TRZ_UPDATEFIRMWARE_ATTEMPT = "TRZ_UPDATEFIRMWARE_ATTEMPT";
export const TRZ_UPDATEFIRMWARE_FAILED = "TRZ_UPDATEFIRMWARE_FAILED";
export const TRZ_UPDATEFIRMWARE_SUCCESS = "TRZ_UPDATEFIRMWARE_SUCCESS";

// updateFirmware attempts to update the device's firmware. For some reason,
// possibly the size of the firmware, this action will not complete if called
// from here. We send the firmware to a higher place in the electron hiearchy
// to send it for us.
export const updateFirmware = (path) => async (dispatch, getState) => {
  // Attempting to update the firmware while already updating will cause the
  // trezor to lock up.
  const {
    trezor: { performingUpdate, device }
  } = getState();
  if (performingUpdate) {
    console.log("already updating firmware");
    return;
  }

  dispatch({ type: TRZ_UPDATEFIRMWARE_ATTEMPT });

  const features = await getFeatures(dispatch, getState)
    .catch(error => {
      dispatch({ error, type: TRZ_UPDATEFIRMWARE_FAILED });
      return;
    });

  try {
    if (device != BOOTLOADER_MODE) throw "device must be in bootloader mode";
    // Ask main.development.js to send the firmware for us.
    const { error, started } = await ipcRenderer.invoke("upload-firmware", path, features.model);
    // If the updated started, the device must be disconnected before further
    // use.
    if (started) alertNoConnectedDevice()(dispatch);
    if (error) throw error;
    dispatch({ type: TRZ_UPDATEFIRMWARE_SUCCESS });
  } catch (error) {
    dispatch({ error, type: TRZ_UPDATEFIRMWARE_FAILED });
  }
};

export const TRZ_GETWALLETCREATIONMASTERPUBKEY_ATTEMPT =
  "TRZ_GETWALLETCREATIONMASTERPUBKEY_ATTEMPT";
export const TRZ_GETWALLETCREATIONMASTERPUBKEY_FAILED =
  "TRZ_GETWALLETCREATIONMASTERPUBKEY_FAILED";
export const TRZ_GETWALLETCREATIONMASTERPUBKEY_SUCCESS =
  "TRZ_GETWALLETCREATIONMASTERPUBKEY_SUCCESS";

export const getWalletCreationMasterPubKey = () => async (
  dispatch,
  getState
) => {
  dispatch({ type: TRZ_GETWALLETCREATIONMASTERPUBKEY_ATTEMPT });

  if (noDevice(getState)) {
    dispatch({
      error: "Device not connected",
      type: TRZ_GETWALLETCREATIONMASTERPUBKEY_FAILED
    });
    return;
  };

  const chainParams = selectors.chainParams(getState());

  try {
    // Check that the firmware running in this trezor has the seed constant fix.
    const features = await getFeatures(dispatch, getState);
    const versionLessThan = (wantMajor, wantMinor) =>
      features.major_version < wantMajor ||
      (features.major_version == wantMajor &&
        features.minor_version < wantMinor);
    // TODO: Confirm these versions. Confirmed on 1.9.3. Older versions may
    // not give us decred specific addresses with connect.
    if (features.model == 1 && versionLessThan(1, 9)) {
      throw new Error(
        "Trezor Model One needs to run on firmware >= 1.9.0. Found " +
        features.major_version +
        "." +
        features.minor_version +
        "." +
        features.patch_version
      );
      // TODO: Confirm these versions. Confirmed on 2.3.4. Older versions may
      // not give us decred specific addresses with connect.
    } else if (features.model == "T" && versionLessThan(2, 3)) {
      throw new Error(
        "Trezor Model T needs to run on firmware >= 2.1.0. Found " +
        features.major_version +
        "." +
        features.minor_version +
        "." +
        features.patch_version
      );
    } else if (!features.model) {
      throw new Error("Unknown firmware model/version");
    }

    const path = accountPath(WALLET_ACCOUNT, chainParams.HDCoinType);

    const payload = await deviceRun(
      dispatch,
      getState,
      async () => {
        const res = await session.getPublicKey({
          path: path,
          coin: chainParams.trezorCoinName,
          showOnTrezor: false
        });
        return res.payload;
      }
    );

    dispatch({ type: TRZ_GETWALLETCREATIONMASTERPUBKEY_SUCCESS });

    return payload.xpub;
  } catch (error) {
    dispatch({ error, type: TRZ_GETWALLETCREATIONMASTERPUBKEY_FAILED });
    throw error;
  };
};
