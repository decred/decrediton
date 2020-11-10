import {
  TRZ_TREZOR_ENABLED,
  TRZ_TREZOR_DISABLED,
  TRZ_CONNECT_ATTEMPT,
  TRZ_CONNECT_FAILED,
  TRZ_CONNECT_SUCCESS,
  TRZ_NOCONNECTEDDEVICE,
  TRZ_BACKUPDEVICE_ATTEMPT,
  TRZ_BACKUPDEVICE_SUCCESS,
  TRZ_BACKUPDEVICE_FAILED,
  TRZ_LOADDEVICE,
  TRZ_DEVICETRANSPORT_START,
  TRZ_DEVICETRANSPORT_LOST,
  TRZ_SELECTEDDEVICE_CHANGED,
  TRZ_PIN_REQUESTED,
  TRZ_PIN_ENTERED,
  TRZ_PIN_CANCELED,
  TRZ_PASSPHRASE_REQUESTED,
  TRZ_PASSPHRASE_ENTERED,
  TRZ_PASSPHRASE_CANCELED,
  TRZ_WORD_REQUESTED,
  TRZ_WORD_ENTERED,
  TRZ_WORD_CANCELED,
  TRZ_CANCELOPERATION_SUCCESS,
  TRZ_TOGGLEPINPROTECTION_ATTEMPT,
  TRZ_TOGGLEPINPROTECTION_FAILED,
  TRZ_TOGGLEPINPROTECTION_SUCCESS,
  TRZ_TOGGLEPASSPHRASEPROTECTION_ATTEMPT,
  TRZ_TOGGLEPASSPHRASEPROTECTION_FAILED,
  TRZ_TOGGLEPASSPHRASEPROTECTION_SUCCESS,
  TRZ_CHANGEHOMESCREEN_ATTEMPT,
  TRZ_CHANGEHOMESCREEN_FAILED,
  TRZ_CHANGEHOMESCREEN_SUCCESS,
  TRZ_CHANGELABEL_ATTEMPT,
  TRZ_CHANGELABEL_FAILED,
  TRZ_CHANGELABEL_SUCCESS,
  TRZ_WIPEDEVICE_ATTEMPT,
  TRZ_WIPEDEVICE_FAILED,
  TRZ_WIPEDEVICE_SUCCESS,
  TRZ_RECOVERDEVICE_ATTEMPT,
  TRZ_RECOVERDEVICE_FAILED,
  TRZ_RECOVERDEVICE_SUCCESS,
  TRZ_INITDEVICE_ATTEMPT,
  TRZ_INITDEVICE_FAILED,
  TRZ_INITDEVICE_SUCCESS,
  TRZ_UPDATEFIRMWARE_ATTEMPT,
  TRZ_UPDATEFIRMWARE_FAILED,
  TRZ_UPDATEFIRMWARE_SUCCESS,
  TRZ_GETWALLETCREATIONMASTERPUBKEY_ATTEMPT,
  TRZ_GETWALLETCREATIONMASTERPUBKEY_FAILED,
  TRZ_GETWALLETCREATIONMASTERPUBKEY_SUCCESS
} from "actions/TrezorActions";
import {
  SIGNTX_ATTEMPT,
  SIGNTX_FAILED,
  SIGNTX_SUCCESS
} from "actions/ControlActions";
import { CLOSEWALLET_SUCCESS } from "actions/WalletLoaderActions";

export default function trezor(state = {}, action) {
  switch (action.type) {
    case TRZ_TREZOR_ENABLED:
      return { ...state, enabled: true };
    case TRZ_TREZOR_DISABLED:
      return { ...state, enabled: false };
    case TRZ_CONNECT_ATTEMPT:
      return {
        ...state,
        connectAttempt: true
      };
    case TRZ_CONNECT_SUCCESS:
      return {
        ...state,
        connectAttempt: false
      };
    case TRZ_CONNECT_FAILED:
      return {
        ...state,
        connectError: action.error,
        connectAttempt: false
      };
    case TRZ_DEVICETRANSPORT_START:
      return {
        ...state,
        transportError: false,
        connected: true
      };
    case TRZ_DEVICETRANSPORT_LOST:
      return {
        ...state,
        transportError: action.error,
        device: null,
        deviceLabel: null,
        performingOperation: false,
        connected: false
      };
    case TRZ_NOCONNECTEDDEVICE:
      return {
        ...state,
        device: null,
        deviceLabel: null
      };
    case TRZ_SELECTEDDEVICE_CHANGED:
    case TRZ_LOADDEVICE:
      return {
        ...state,
        device: action.device,
        deviceLabel: action.deviceLabel
      };
    case TRZ_PIN_REQUESTED:
      return {
        ...state,
        waitingForPin: true,
        pinCallBack: action.pinCallBack,
        pinMessage: action.pinMessage,
        performingOperation: true
      };
    case TRZ_PIN_CANCELED:
    case TRZ_PIN_ENTERED:
      return {
        ...state,
        waitingForPin: false,
        pinCallBack: null,
        pinMessage: null,
        performingOperation: false
      };
    case TRZ_PASSPHRASE_REQUESTED:
      return {
        ...state,
        waitingForPassPhrase: true,
        passPhraseCallBack: action.passPhraseCallBack,
        performingOperation: true
      };
    case TRZ_PASSPHRASE_CANCELED:
    case TRZ_PASSPHRASE_ENTERED:
      return {
        ...state,
        waitingForPassPhrase: false,
        passPhraseCallBack: null,
        performingOperation: false
      };
    case TRZ_WORD_REQUESTED:
      return {
        ...state,
        waitingForWord: true,
        wordCallBack: action.wordCallBack,
        performingOperation: true
      };
    case TRZ_WORD_CANCELED:
    case TRZ_WORD_ENTERED:
      return {
        ...state,
        waitingForWord: false,
        wordCallBack: null,
        performingOperation: false
      };
    case TRZ_CANCELOPERATION_SUCCESS:
      return {
        ...state,
        waitingForPin: false,
        pinCallBack: null,
        pinMessage: null,
        wordCallBack: null,
        waitingForPassPhrase: false,
        passPhraseCallBack: null,
        performingOperation: false,
        waitingForWord: false
      };
    case TRZ_GETWALLETCREATIONMASTERPUBKEY_ATTEMPT:
      return { ...state, walletCreationMasterPubkeyAttempt: true };
    case TRZ_GETWALLETCREATIONMASTERPUBKEY_SUCCESS:
    case TRZ_GETWALLETCREATIONMASTERPUBKEY_FAILED:
      return { ...state, walletCreationMasterPubkeyAttempt: false };
    case SIGNTX_ATTEMPT:
    case TRZ_TOGGLEPINPROTECTION_ATTEMPT:
    case TRZ_BACKUPDEVICE_ATTEMPT:
    case TRZ_TOGGLEPASSPHRASEPROTECTION_ATTEMPT:
    case TRZ_CHANGEHOMESCREEN_ATTEMPT:
    case TRZ_CHANGELABEL_ATTEMPT:
    case TRZ_WIPEDEVICE_ATTEMPT:
    case TRZ_RECOVERDEVICE_ATTEMPT:
    case TRZ_INITDEVICE_ATTEMPT:
      return { ...state, performingOperation: true };
    case TRZ_UPDATEFIRMWARE_ATTEMPT:
      return {
        ...state,
        performingOperation: true,
        performingUpdate: true
      };
    case TRZ_CHANGELABEL_SUCCESS:
      return {
        ...state,
        deviceLabel: action.deviceLabel,
        performingOperation: false
      };
    case SIGNTX_FAILED:
    case SIGNTX_SUCCESS:
    case TRZ_TOGGLEPINPROTECTION_FAILED:
    case TRZ_TOGGLEPINPROTECTION_SUCCESS:
    case TRZ_TOGGLEPASSPHRASEPROTECTION_FAILED:
    case TRZ_TOGGLEPASSPHRASEPROTECTION_SUCCESS:
    case TRZ_CHANGEHOMESCREEN_FAILED:
    case TRZ_CHANGEHOMESCREEN_SUCCESS:
    case TRZ_CHANGELABEL_FAILED:
    case TRZ_WIPEDEVICE_FAILED:
    case TRZ_WIPEDEVICE_SUCCESS:
    case TRZ_RECOVERDEVICE_FAILED:
    case TRZ_RECOVERDEVICE_SUCCESS:
    case TRZ_INITDEVICE_FAILED:
    case TRZ_INITDEVICE_SUCCESS:
    case TRZ_BACKUPDEVICE_FAILED:
    case TRZ_BACKUPDEVICE_SUCCESS:
      return { ...state, performingOperation: false };
    case TRZ_UPDATEFIRMWARE_FAILED:
    case TRZ_UPDATEFIRMWARE_SUCCESS:
      return {
        ...state,
        performingOperation: false,
        performingUpdate: false
      };
    case CLOSEWALLET_SUCCESS:
      return { ...state, enabled: false };
    default:
      return state;
  }
}
