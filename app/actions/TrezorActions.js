import { wallet, fs } from "wallet-preload-shim";
import { trezord } from "wallet-preload-shim";
import * as selectors from "selectors";
import { hexToBytes, str2utf8hex, rawToHex } from "helpers";
import {
  walletTxToBtcjsTx,
  walletTxToRefTx,
  WALLET_ACCOUNT,
  accountPath,
  addressPath
} from "helpers/trezor";
import { putUint16, rawHashToHex } from "helpers/byteActions";
import { publishTransactionAttempt } from "./ControlActions";
import {
  MODEL1_DECRED_HOMESCREEN,
  MODELT_DECRED_HOMESCREEN
} from "constants/trezor";
import { EXTERNALREQUEST_TREZOR_BRIDGE } from "constants";
import {
  SIGNTX_ATTEMPT,
  SIGNTX_FAILED,
  SIGNTX_SUCCESS,
  SIGNMESSAGE_ATTEMPT,
  SIGNMESSAGE_FAILED,
  SIGNMESSAGE_SUCCESS
} from "./ControlActions";
import { getAmountFromTxInputs, getTxFromInputs } from "./TransactionActions";
import { push as pushHistory } from "connected-react-router";
import { blake256 } from "walletCrypto";

const session = require("trezor-connect").default;
const {
  TRANSPORT_EVENT,
  UI,
  UI_EVENT,
  DEVICE_EVENT
} = require("trezor-connect");
const CHANGE = "device-changed";
const DISCONNECT = "device-disconnect";
const CONNECT = "device-connect";
const AQUIRED = "acquired";
const NOBACKUP = "no-backup";
const TRANSPORT_ERROR = "transport-error";
const TRANSPORT_START = "transport-start";
const BOOTLOADER_MODE = "bootloader";
const testVotingKey = "PtWTXsGfk2YeqcmrRty77EsynNBtxWLLbsVEeTS8bKAGFoYF3qTNq";
const testVotingAddr = "TsmfmUitQApgnNxQypdGd2x36djCCpDpERU";
const SERTYPE_NOWITNESS = 1;
const OP_SSGEN_STR = "bb";
const OP_SSRTX_STR = "bc";
const OP_TGEN_STR = "c3";
const STAKE_REVOCATION = "SSRTX";
const STAKE_GENERATION = "SSGen";
const TREASURY_GENERATION = "TGen";

let setListeners = false;

export const TRZ_WALLET_CLOSED = "TRZ_WALLET_CLOSED";
export const TRZ_TREZOR_ENABLED = "TRZ_TREZOR_ENABLED";
export const TRZ_TREZORD_STARTED = "TRZ_TREZORD_STARTED";

// enableTrezor attepts to start a connection with connect if none exist and
// connect to a trezor device.
export const enableTrezor = () => async (dispatch, getState) => {
  dispatch({ type: TRZ_TREZOR_ENABLED });

  if (!setListeners) {
    setDeviceListeners(dispatch, getState);
    setListeners = true;
  }
  const trezordStarted = getState().trezor.trezordStarted;
  if (!trezordStarted) {
    await trezord.start();
    dispatch({ type: TRZ_TREZORD_STARTED });
  }
  connect()(dispatch, getState);
};

const initTransport = async (session, debug) => {
  await session
    .init({
      connectSrc: "./",
      env: "web",
      lazyLoad: false,
      popup: false,
      transportReconnect: false,
      webusb: false,
      manifest: {
        email: "joegruffins@gmail.com",
        appUrl: "https://github.com/decred/decrediton"
      },
      debug: debug
    })
    .catch((err) => {
      throw err;
    });
};

export const TRZ_CONNECT_ATTEMPT = "TRZ_CONNECT_ATTEMPT";
export const TRZ_CONNECT_FAILED = "TRZ_CONNECT_FAILED";
export const TRZ_CONNECT_SUCCESS = "TRZ_CONNECT_SUCCESS";
export const TRZ_UDEV_ERROR = "TREZOR_UDEV_ERROR";

export const connect = () => async (dispatch, getState) => {
  const {
    trezor: { connected, connectAttempt, initted }
  } = getState();
  if (connected || connectAttempt) return;
  dispatch({ type: TRZ_CONNECT_ATTEMPT });

  wallet.allowExternalRequest(EXTERNALREQUEST_TREZOR_BRIDGE);

  // We can only ever init transport once.
  if (!initted) {
    const debug = getState().trezor.debug;
    await initTransport(session, debug).catch((error) => {
      dispatch({ error, type: TRZ_CONNECT_FAILED });
      return;
    });
  }
  try {
    await dispatch(getFeatures());
  } catch (err) {
    dispatch({
      error: err.message,
      type: TRZ_CONNECT_FAILED
    });
    const needRules = await trezord.needsUdevRules();
    if (needRules.needs) {
      dispatch({ type: TRZ_UDEV_ERROR });
      setTimeout(() => {
        dispatch(pushHistory("/error"));
      }, 1000);
    }
    return;
  }
  dispatch({ type: TRZ_CONNECT_SUCCESS });
};

export const TRZ_TREZOR_DISABLED = "TRZ_TREZOR_DISABLED";

// disableTrezor disables trezor integration for the current wallet. Note
// that it does **not** disable in the config, so the wallet will restart as a
// trezor wallet next time it's opened.
export const disableTrezor = () => async (dispatch) => {
  await trezord.stop();
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
  let device = features.id;
  if (features.mode == BOOTLOADER_MODE) {
    device = BOOTLOADER_MODE;
  }
  if (device == currentDevice) return;
  const deviceLabel = features.label;
  dispatch({ deviceLabel, device, type: TRZ_SELECTEDDEVICE_CHANGED });
}

function onConnect(dispatch, getState, features) {
  if (features == null) throw "no features on connect";
  let device = features.id;
  const deviceLabel = features.label;
  if (features.mode == BOOTLOADER_MODE) {
    device = BOOTLOADER_MODE;
  }
  dispatch({ deviceLabel, device, type: TRZ_LOADDEVICE });
  return device;
}

function onDisconnect(dispatch, getState, features) {
  if (features == null) throw "no features on disconnect";
  const currentDevice = selectors.trezorDevice(getState());
  const device = features.id;
  // If this is not the device we presume is current, ignore.
  if (device != currentDevice) {
    return;
  }
  alertNoConnectedDevice()(dispatch);
}

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
        dispatch({
          error: event.payload.error,
          type: TRZ_DEVICETRANSPORT_LOST
        });
        break;
      case TRANSPORT_START:
        dispatch({ type: TRZ_DEVICETRANSPORT_START });
        break;
    }
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
    }
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
          await new Promise((r) => setTimeout(r, 2000));
          session.uiResponse({
            type: UI.RECEIVE_CONFIRMATION,
            payload: false
          });
        }
        dispatch({ type: TRZ_NOTBACKEDUP });
        break;
      case UI.REQUEST_PASSPHRASE: {
        console.log("passphrase requested, waiting two seconds to respond");
        await new Promise((r) => setTimeout(r, 2000));
        const passPhraseCallBack = (canceled, passphrase) => {
          if (canceled) {
            session.cancel();
          } else {
            session.uiResponse({
              type: UI.RECEIVE_PASSPHRASE,
              payload: {
                value: passphrase ? passphrase : "",
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
        await new Promise((r) => setTimeout(r, 2000));
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
        await new Promise((r) => setTimeout(r, 2000));
        const {
          trezor: { performingRecoverDevice }
        } = getState();
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
        // During sleep, the restore process may have been canceled.
        if (performingRecoverDevice) {
          dispatch({ wordCallBack, type: TRZ_WORD_REQUESTED });
        } else {
          session?.cancel();
        }
        break;
      }

      case UI.FIRMWARE_PROGRESS: {
        console.log("Trezor update progress: " + event.payload.progress + "%");
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
}

export const TRZ_GETFEATURES_SUCCESS = "TRZ_GETFEATURES_SUCCESS";
export const getFeatures = () => async (dispatch, getState) => {
  const features = await deviceRun(dispatch, getState, async () => {
    const res = await session.getFeatures();
    return res.payload;
  });
  dispatch({ type: TRZ_GETFEATURES_SUCCESS, features });
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
  const payload = await deviceRun(dispatch, getState, async () => {
    const res = await session.getAddress({
      path: address_n,
      coin: chainParams.trezorCoinName,
      showOnTrezor: false
    });
    return res.payload;
  });
  const addr = payload.address;

  const addrValidResp = await wallet.validateAddress(walletService, addr);
  if (!addrValidResp.isValid)
    throw "Trezor provided an invalid address " + addr;

  if (!addrValidResp.isMine)
    throw "Trezor and dcrwallet not running from the same extended public key";

  if (addrValidResp.index !== 0) throw "Wallet replied with wrong index.";
};

// setStakeInputTypes adds a field to input that denotes stake spends. SSRTX
function setStakeInputTypes(inputs, refTxs) {
  const refs = {};
  refTxs.forEach((ref) => (refs[ref.hash] = ref.bin_outputs));
  // Search reference txs for the script that will be signed and determine if
  // spending a stake output by comparing the first opcode to SSRTX or SSGEN
  // opcodes.
  for (let i = 0; i < inputs.length; i++) {
    const input = inputs[i];
    const bin_outputs = refs[input.prev_hash];
    if (!bin_outputs) continue;
    let s = bin_outputs[input.prev_index].script_pubkey;
    if (s.length < 2) {
      continue;
    }
    s = s.slice(0, 2);
    switch (s) {
      case OP_SSGEN_STR:
        input.decred_staking_spend = STAKE_GENERATION;
        break;
      case OP_SSRTX_STR:
        input.decred_staking_spend = STAKE_REVOCATION;
        break;
      case OP_TGEN_STR:
        input.decred_staking_spend = TREASURY_GENERATION;
        break;
    }
  }
}

export const signTransactionAttemptTrezor =
  (rawUnsigTx, changeIndexes) => async (dispatch, getState) => {
    dispatch({ type: SIGNTX_ATTEMPT });

    const {
      grpc: { walletService },
      trezor: { debug }
    } = getState();
    const chainParams = selectors.chainParams(getState());

    debug && console.log("construct tx response", rawUnsigTx);

    try {
      const decodedUnsigTxResp = wallet.decodeRawTransaction(
        Buffer.from(rawUnsigTx, "hex"),
        chainParams
      );
      const unsignedTx = await dispatch(
        getAmountFromTxInputs(decodedUnsigTxResp)
      );
      const txCompletedInputs = await dispatch(
        getAmountFromTxInputs(unsignedTx)
      );
      const inputTxs = await dispatch(getTxFromInputs(unsignedTx));
      const { inputs, outputs } = await walletTxToBtcjsTx(
        walletService,
        chainParams,
        txCompletedInputs,
        inputTxs,
        changeIndexes
      );

      const refTxs = await Promise.all(
        inputTxs.map((inpTx) => walletTxToRefTx(walletService, inpTx))
      );

      // Determine if this is paying from a stakegen or revocation, which are
      // special cases.
      setStakeInputTypes(inputs, refTxs);

      const payload = await deviceRun(dispatch, getState, async () => {
        await dispatch(checkTrezorIsDcrwallet());

        const res = await session.signTransaction({
          inputs: inputs,
          outputs: outputs,
          refTxs: refTxs,
          coin: chainParams.trezorCoinName
        });
        return res.payload;
      });
      const signedRaw = payload.serializedTx;

      dispatch({ type: SIGNTX_SUCCESS });
      dispatch(publishTransactionAttempt(hexToBytes(signedRaw)));
      return signedRaw;
    } catch (error) {
      dispatch({ error, type: SIGNTX_FAILED });
    }
  };

export const signMessageAttemptTrezor =
  (address, message) => async (dispatch, getState) => {
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
      const addrValidResp = await wallet.validateAddress(
        walletService,
        address
      );
      if (!addrValidResp.isValid)
        throw "Input has an invalid address " + address;
      if (!addrValidResp.isMine)
        throw "Trezor only supports signing with wallet addresses";
      const addrIndex = addrValidResp.index;
      const addrBranch = addrValidResp.isInternal ? 1 : 0;
      const address_n = addressPath(
        addrIndex,
        addrBranch,
        WALLET_ACCOUNT,
        chainParams.HDCoinType
      );

      const payload = await deviceRun(dispatch, getState, async () => {
        await dispatch(checkTrezorIsDcrwallet());

        const res = await session.signMessage({
          path: address_n,
          coin: chainParams.trezorCoinName,
          message: str2utf8hex(message),
          hex: true
        });
        return res.payload;
      });
      dispatch({
        getSignMessageSignature: payload.signature,
        type: SIGNMESSAGE_SUCCESS
      });
      return payload.signature;
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

  const clearProtection = !!selectors.trezorPinProtection(getState());

  try {
    await deviceRun(dispatch, getState, async () => {
      const res = await session.changePin({
        remove: clearProtection
      });
      return res.payload;
    });
    await dispatch(getFeatures());
    dispatch({
      clearProtection,
      type: TRZ_TOGGLEPINPROTECTION_SUCCESS
    });
  } catch (error) {
    dispatch({ error, type: TRZ_TOGGLEPINPROTECTION_FAILED });
  }
};

export const TRZ_TOGGLEPASSPHRASEPROTECTION_ATTEMPT =
  "TRZ_TOGGLEPASSPHRASEPROTECTION_ATTEMPT";
export const TRZ_TOGGLEPASSPHRASEPROTECTION_FAILED =
  "TRZ_TOGGLEPASSPHRASEPROTECTION_FAILED";
export const TRZ_TOGGLEPASSPHRASEPROTECTION_SUCCESS =
  "TRZ_TOGGLEPASSPHRASEPROTECTION_SUCCESS";
export const TRZ_TOGGLEPASSPHRASEPROTECTION_CONFIRMED =
  "TRZ_TOGGLEPASSPHRASEPROTECTION_CONFIRMED";

export const togglePassPhraseProtection = () => async (dispatch, getState) => {
  dispatch({ type: TRZ_TOGGLEPASSPHRASEPROTECTION_ATTEMPT });

  const enableProtection = !selectors.trezorPassphraseProtection(getState());

  try {
    await deviceRun(dispatch, getState, async () => {
      const res = await session.applySettings({
        use_passphrase: enableProtection
      });
      return res.payload;
    });
    await dispatch(getFeatures());
    dispatch({
      enablePassphraseProtection: enableProtection,
      type: TRZ_TOGGLEPASSPHRASEPROTECTION_SUCCESS
    });
  } catch (error) {
    dispatch({ error, type: TRZ_TOGGLEPASSPHRASEPROTECTION_FAILED });
  }
};

export const TRZ_TOGGLEPASSPHRASEONDEVICE_ATTEMPT =
  "TRZ_TOGGLEPASSPHRASEONDEVICE_ATTEMPT";
export const TRZ_TOGGLEPASSPHRASEONDEVICE_FAILED =
  "TRZ_TOGGLEPASSPHRASEONDEVICE_FAILED";
export const TRZ_TOGGLEPASSPHRASEONDEVICE_SUCCESS =
  "TRZ_TOGGLEPASSPHRASEONDEVICE_SUCCESS";

export const togglePassphraseOnDevice = () => async (dispatch, getState) => {
  dispatch({ type: TRZ_TOGGLEPASSPHRASEONDEVICE_ATTEMPT });

  const enableOnDevice = !selectors.trezorPassphraseOnDeviceProtection(
    getState()
  );

  try {
    await deviceRun(dispatch, getState, async () => {
      const res = await session.applySettings({
        passphrase_always_on_device: enableOnDevice
      });
      return res.payload;
    });
    await dispatch(getFeatures());
    dispatch({
      enablePassphraseOnDevice: enableOnDevice,
      type: TRZ_TOGGLEPASSPHRASEONDEVICE_SUCCESS
    });
  } catch (error) {
    dispatch({ error, type: TRZ_TOGGLEPASSPHRASEONDEVICE_FAILED });
  }
};

export const TRZ_CHANGEHOMESCREEN_ATTEMPT = "TRZ_CHANGEHOMESCREEN_ATTEMPT";
export const TRZ_CHANGEHOMESCREEN_FAILED = "TRZ_CHANGEHOMESCREEN_FAILED";
export const TRZ_CHANGEHOMESCREEN_SUCCESS = "TRZ_CHANGEHOMESCREEN_SUCCESS";

export const changeToDecredHomeScreen = () => async (dispatch, getState) => {
  dispatch({ type: TRZ_CHANGEHOMESCREEN_ATTEMPT });

  const features = await dispatch(getFeatures()).catch((error) => {
    dispatch({ error, type: TRZ_CHANGEHOMESCREEN_FAILED });
    return;
  });

  const hs =
    features.model == "T" ? MODELT_DECRED_HOMESCREEN : MODEL1_DECRED_HOMESCREEN;

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
  }
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
  }
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
  }
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

  const features = await dispatch(getFeatures()).catch((error) => {
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

const doUpdateFirmware = async (firmwarePath, model) => {
  let started = false;
  let completed = false;
  const rawFirmware = fs.readFileSync(firmwarePath);
  let firmwareData;
  // Different models want data in different formats. Current models are either
  // 1 or "T".
  if (model === 1) {
    firmwareData = rawToHex(rawFirmware);
  } else {
    firmwareData = rawFirmware.buffer;
  }
  try {
    started = true;
    const res = await session.firmwareUpdate({
      binary: firmwareData
    });
    completed = true;
    if (res.payload) {
      if (res.payload.error) {
        throw res.payload.error;
      }
      if (!res.payload.success) {
        throw res.payload.code;
      }
    }
    return { error: null, started };
  } catch (e) {
    if (completed) return { error: null, started };
    console.log("error uploading trezor firmware: " + e);
    return { error: e.toString(), started };
  }
};

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

  const features = await dispatch(getFeatures()).catch((error) => {
    dispatch({ error, type: TRZ_UPDATEFIRMWARE_FAILED });
    return;
  });

  try {
    if (device != BOOTLOADER_MODE) throw "device must be in bootloader mode";
    const { error, started } = await doUpdateFirmware(path, features.model);
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

export const getWalletCreationMasterPubKey =
  () => async (dispatch, getState) => {
    dispatch({ type: TRZ_GETWALLETCREATIONMASTERPUBKEY_ATTEMPT });

    if (noDevice(getState)) {
      dispatch({
        error: "Device not connected",
        type: TRZ_GETWALLETCREATIONMASTERPUBKEY_FAILED
      });
      return;
    }

    const chainParams = selectors.chainParams(getState());

    try {
      // Check that the firmware running in this trezor has the seed constant fix.
      const features = await dispatch(getFeatures()).catch((error) => {
        dispatch({ error, type: TRZ_GETWALLETCREATIONMASTERPUBKEY_FAILED });
        return;
      });
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

      const payload = await deviceRun(dispatch, getState, async () => {
        const res = await session.getPublicKey({
          path: path,
          coin: chainParams.trezorCoinName,
          showOnTrezor: false
        });
        return res.payload;
      });

      dispatch({ type: TRZ_GETWALLETCREATIONMASTERPUBKEY_SUCCESS });

      return payload.xpub;
    } catch (error) {
      dispatch({ error, type: TRZ_GETWALLETCREATIONMASTERPUBKEY_FAILED });
      throw error;
    }
  };

export const TRZ_PURCHASETICKET_ATTEMPT = "TRZ_PURCHASETICKET_ATTEMPT";
export const TRZ_PURCHASETICKET_FAILED = "TRZ_PURCHASETICKET_FAILED";
export const TRZ_PURCHASETICKET_SUCCESS = "TRZ_PURCHASETICKET_SUCCESS";

// ticketInOuts creates inputs and outputs for use with a trezor signature
// request of a ticket.
async function ticketInsOuts(
  getState,
  decodedTicket,
  decodedInp,
  refTxs,
  votingAddr
) {
  const {
    grpc: { walletService }
  } = getState();
  const chainParams = selectors.chainParams(getState());
  const ticketOutN = decodedTicket.inputs[0].outputIndex;
  const inAddr = decodedInp.outputs[ticketOutN].decodedScript.address;
  let addrValidResp = await wallet.validateAddress(walletService, inAddr);
  const inAddr_n = addressPath(
    addrValidResp.index,
    1,
    WALLET_ACCOUNT,
    chainParams.HDCoinType
  );
  const commitAddr = decodedTicket.outputs[1].decodedScript.address;
  addrValidResp = await wallet.validateAddress(walletService, commitAddr);
  const commitAddr_n = addressPath(
    addrValidResp.index,
    1,
    WALLET_ACCOUNT,
    chainParams.HDCoinType
  );
  const inputAmt = decodedTicket.inputs[0].valueIn.toString();
  const ticketInput = {
    address_n: inAddr_n,
    prev_hash: decodedTicket.inputs[0].prevTxId,
    prev_index: ticketOutN,
    amount: inputAmt
  };
  const sstxsubmission = {
    script_type: "PAYTOADDRESS",
    address: votingAddr,
    amount: decodedTicket.outputs[0].value.toString()
  };
  const ticketsstxcommitment = {
    script_type: "PAYTOADDRESS",
    address_n: commitAddr_n,
    amount: inputAmt
  };
  const ticketsstxchange = {
    script_type: "PAYTOADDRESS",
    address: decodedTicket.outputs[2].decodedScript.address,
    amount: "0"
  };
  const inputs = [ticketInput];
  const outputs = [sstxsubmission, ticketsstxcommitment, ticketsstxchange];
  return { inputs, outputs };
}

export const purchaseTicketsAttempt =
  (accountNum, numTickets, vsp) => async (dispatch, getState) => {
    dispatch({ type: TRZ_PURCHASETICKET_ATTEMPT });

    if (noDevice(getState)) {
      dispatch({
        error: "Device not connected",
        type: TRZ_PURCHASETICKET_FAILED
      });
      return;
    }

    const {
      grpc: { walletService }
    } = getState();
    const chainParams = selectors.chainParams(getState());

    try {
      // TODO: Enable on mainnet. The following todo on crypto magic must be
      // implemented first. Revocation logic and a re-fee payment method must be
      // added.
      // TODO: Check the Trezor is a model T with version >= 2.8.3
      if (chainParams.trezorCoinName != "Decred Testnet")
        throw "can only be used on testnet";
      // TODO: Fill this with deterministic crypto magic.
      const votingKey = testVotingKey;
      const votingAddr = testVotingAddr;
      const res = await wallet.purchaseTickets(
        walletService,
        accountNum,
        numTickets,
        false,
        vsp,
        {}
      );
      const splitTx = res.splitTx;
      const decodedInp = await wallet.decodeTransactionLocal(
        splitTx,
        chainParams
      );
      const changeIndexes = [];
      for (let i = 0; i < decodedInp.outputs.length; i++) {
        changeIndexes.push(i);
      }
      const signedSplitTx = await signTransactionAttemptTrezor(
        splitTx,
        changeIndexes
      )(dispatch, getState);
      if (!signedSplitTx) throw "failed to sign splittx";
      const refTxs = await walletTxToRefTx(walletService, decodedInp);

      for (const ticket of res.ticketsList) {
        const decodedTicket = await wallet.decodeTransactionLocal(
          ticket,
          chainParams
        );
        refTxs.hash = decodedTicket.inputs[0].prevTxId;
        const { inputs, outputs } = await ticketInsOuts(
          getState,
          decodedTicket,
          decodedInp,
          refTxs,
          votingAddr
        );
        const payload = await deviceRun(dispatch, getState, async () => {
          const res = await session.signTransaction({
            coin: chainParams.trezorCoinName,
            inputs: inputs,
            outputs: outputs,
            refTxs: [refTxs],
            decredStakingTicket: true
          });
          return res.payload;
        });

        const signedRaw = payload.serializedTx;
        dispatch(publishTransactionAttempt(hexToBytes(signedRaw)));
        // Pay fee.
        console.log(
          "waiting 5 seconds for the ticket to propogate throughout the network"
        );
        await new Promise((r) => setTimeout(r, 5000));
        const host = "https://" + vsp.host;
        await payVSPFee(
          host,
          signedRaw,
          signedSplitTx,
          votingKey,
          accountNum.value,
          true,
          dispatch,
          getState
        );
      }
      dispatch({ type: TRZ_PURCHASETICKET_SUCCESS });
    } catch (error) {
      dispatch({ error, type: TRZ_PURCHASETICKET_FAILED });
    }
  };

// payVSPFee attempts to contact a vsp about a ticket and pay the fee if
// necessary. It will search transacitons for a suitable fee transaction before
// attempting to pay if newTicket is false.
async function payVSPFee(
  host,
  txHex,
  parentTxHex,
  votingKey,
  accountNum,
  newTicket,
  dispatch,
  getState
) {
  const {
    grpc: { walletService }
  } = getState();
  // Gather information about the ticket.
  const chainParams = selectors.chainParams(getState());
  const txBytes = hexToBytes(txHex);
  const decodedTicket = await wallet.decodeTransactionLocal(
    txBytes,
    chainParams
  );
  const commitmentAddr = decodedTicket.outputs[1].decodedScript.address;

  const prefix = txBytes.slice(0, decodedTicket.prefixOffset);
  prefix.set(putUint16(SERTYPE_NOWITNESS), 2);
  const txid = rawHashToHex(blake256(prefix));

  // Request fee info from the vspd.
  let req = {
    timestamp: +new Date(),
    tickethash: txid,
    tickethex: txHex,
    parenthex: parentTxHex
  };
  let jsonStr = JSON.stringify(req);
  let sig = await signMessageAttemptTrezor(commitmentAddr, jsonStr)(
    dispatch,
    getState
  );
  if (!sig) throw "unable to sign fee address message";
  wallet.allowVSPHost(host);
  // This will throw becuase of http.status 400 if already paid.
  // TODO: Investigate whether other fee payment errors will cause this to
  // throw. Other fee payment errors should continue, and we should only stop
  // here if already paid or the ticket is not found by the vsp.
  let res = null;
  try {
    res = await wallet.getVSPFeeAddress({ host, sig, req });
  } catch (error) {
    if (error.response && error.response.data && error.response.data.message) {
      // NOTE: already paid is error.response.data.code == 3
      throw error.response.data.message;
    }
    throw error;
  }
  const payAddr = res.data.feeaddress;
  const fee = res.data.feeamount;

  // Find the fee transaction or make a new one.
  let feeTx = null;
  // Do not search for the fee tx of a new ticket.
  if (!newTicket) {
    feeTx = await findFeeTx(payAddr, fee, dispatch, getState);
  }
  if (!feeTx) {
    const outputs = [{ destination: payAddr, amount: fee }];
    const txResp = await wallet.constructTransaction(
      walletService,
      accountNum,
      0,
      outputs
    );
    const unsignedTx = txResp.unsignedTransaction;
    const decodedInp = await wallet.decodeTransactionLocal(
      unsignedTx,
      chainParams
    );
    let changeIndex = 0;
    for (const out of decodedInp.outputs) {
      const addr = out.decodedScript.address;
      const addrValidResp = await wallet.validateAddress(walletService, addr);
      if (addrValidResp.isInternal) {
        break;
      }
      changeIndex++;
    }
    const success = await signTransactionAttemptTrezor(unsignedTx, [
      changeIndex
    ])(dispatch, getState);
    if (!success) throw "unable to sign fee tx";
    for (let i = 0; i < 5; i++) {
      console.log(
        "waiting 5 seconds for the fee tx to propogate throughout the network"
      );
      await new Promise((r) => setTimeout(r, 5000));
      feeTx = await findFeeTx(payAddr, fee, dispatch, getState);
      if (feeTx) break;
    }
    if (!feeTx) throw "unable to find fee tx " + rawToHex(unsignedTx);
  }

  // Send ticket fee data and voting chioces back to the vsp.
  const {
    grpc: { votingService }
  } = getState();
  const voteChoicesRes = await wallet.getVoteChoices(votingService);
  const voteChoices = {};
  for (const choice of voteChoicesRes.choicesList) {
    voteChoices[choice.agendaId] = choice.choiceId;
  }
  req = {
    timestamp: +new Date(),
    tickethash: txid,
    feetx: feeTx,
    votingkey: votingKey,
    votechoices: voteChoices
  };
  jsonStr = JSON.stringify(req);
  sig = await signMessageAttemptTrezor(commitmentAddr, jsonStr)(
    dispatch,
    getState
  );
  if (!sig) throw "unable to sign fee tx message";
  wallet.allowVSPHost(host);
  await wallet.payVSPFee({ host, sig, req });
}

// findFeeTx searches unmined and recent transactions for a tx that pays to
// FeeAddr of the amount feeAmt. It stops searching below a resonable depth for
// a ticket.
async function findFeeTx(feeAddr, feeAmt, dispatch, getState) {
  const {
    grpc: { walletService }
  } = getState();
  const chainParams = selectors.chainParams(getState());
  // findFee looks for a transaction the paid out exactl feeAmt and has an
  // output address that matches feeAddr.
  const findFee = async (res) => {
    for (const credit of res) {
      if (credit.txType != "sent" && credit.txType != "regular") continue;
      const sentAmt = Math.abs(credit.amount + credit.fee);
      if (sentAmt == feeAmt) {
        const tx = await wallet.decodeTransactionLocal(
          hexToBytes(credit.rawTx),
          chainParams
        );
        if (
          tx.outputs.find(
            (e) => e.decodedScript && e.decodedScript.address == feeAddr
          )
        )
          return credit.rawTx;
      }
    }
    return null;
  };
  // First search mempool.
  const { unmined } = await wallet.getTransactions(walletService, -1, -1, 0);
  const feeTx = await findFee(unmined);
  if (feeTx) return feeTx;
  // TODO: Take these constants from the chainparams.
  const ticketMaturity = 256;
  const ticketExpiry = 40960;
  const { currentBlockHeight } = getState().grpc;
  let start = currentBlockHeight - 100;
  let end = currentBlockHeight;
  const maxAge = currentBlockHeight - (ticketMaturity + ticketExpiry);
  const blockIncrement = 100;
  // Search mined txs in reverse order up until a ticket must have expired on
  // mainnet.
  while (start > maxAge) {
    const { mined } = await wallet.getTransactions(
      walletService,
      start,
      end,
      0
    );
    start -= blockIncrement;
    end -= blockIncrement;
    const feeTx = await findFee(mined);
    if (feeTx) return feeTx;
  }
  return null;
}
