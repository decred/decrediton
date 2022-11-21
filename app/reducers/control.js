import {
  GETNEXTADDRESS_ATTEMPT,
  GETNEXTADDRESS_FAILED,
  GETNEXTADDRESS_SUCCESS,
  GETNEXTCHANGEADDRESS_ATTEMPT,
  GETNEXTCHANGEADDRESS_FAILED,
  GETNEXTCHANGEADDRESS_SUCCESS,
  RENAMEACCOUNT_ATTEMPT,
  RENAMEACCOUNT_FAILED,
  RENAMEACCOUNT_SUCCESS,
  RESCAN_ATTEMPT,
  RESCAN_FAILED,
  RESCAN_PROGRESS,
  RESCAN_COMPLETE,
  RESCAN_CANCEL,
  GETNEXTACCOUNT_ATTEMPT,
  GETNEXTACCOUNT_FAILED,
  GETNEXTACCOUNT_SUCCESS,
  IMPORTPRIVKEY_ATTEMPT,
  IMPORTPRIVKEY_FAILED,
  IMPORTPRIVKEY_SUCCESS,
  CHANGEPASSPHRASE_ATTEMPT,
  CHANGEPASSPHRASE_FAILED,
  CHANGEPASSPHRASE_SUCCESS,
  FUNDTX_ATTEMPT,
  FUNDTX_FAILED,
  FUNDTX_SUCCESS,
  CLEARTX,
  CREATE_UNSIGNEDTICKETS_SUCCESS,
  SIGNTX_ATTEMPT,
  SIGNTX_FAILED,
  SIGNTX_SUCCESS,
  PUBLISHTX_ATTEMPT,
  PUBLISHTX_FAILED,
  PUBLISHTX_SUCCESS,
  PURCHASETICKETS_ATTEMPT,
  PURCHASETICKETS_FAILED,
  PURCHASETICKETS_SUCCESS,
  PURCHASETICKETS_SUCCESS_LESS,
  CONSTRUCTTX_ATTEMPT,
  CONSTRUCTTX_FAILED,
  CONSTRUCTTX_SUCCESS,
  CONSTRUCTTX_FAILED_LOW_BALANCE,
  MODAL_VISIBLE,
  MODAL_HIDDEN,
  SHOW_ABOUT_MODAL_MACOS,
  HIDE_ABOUT_MODAL_MACOS,
  GETACCOUNTEXTENDEDKEY_ATTEMPT,
  GETACCOUNTEXTENDEDKEY_FAILED,
  GETACCOUNTEXTENDEDKEY_SUCCESS,
  HIDE_CANTCLOSE_MODAL,
  SHOW_CANTCLOSE_MODAL,
  SETACCOUNTPASSPHRASE_SUCCESS,
  UNLOCKANDEXECFN_ATTEMPT,
  UNLOCKANDEXECFN_FAILED,
  UNLOCKANDEXECFN_SUCCESS,
  MONITORLOCKACBLEACCOUNTS_STARTED,
  MONITORLOCKACBLEACCOUNTS_STOPPED,
  CONFIRMATIONDIALOG_REQUESTED,
  CONFIRMATIONDIALOG_HIDDEN,
  DISCOVERUSAGE_SUCCESS,
  DISCOVERUSAGE_ATTEMPT,
  DISCOVERUSAGE_FAILED,
  SETACCOUNTSPASSPHRASE_ATTEMPT,
  SETACCOUNTSPASSPHRASE_SUCCESS,
  SETACCOUNTSPASSPHRASE_FAILED,
  SET_PAGEBODY_SCROLLHANDLER,
  SET_PAGEBODY_TOP_REF
} from "../actions/ControlActions";
import { CLOSEWALLET_SUCCESS } from "actions/WalletLoaderActions";

import {
  EXPORT_STARTED,
  EXPORT_COMPLETED,
  EXPORT_ERROR
} from "actions/StatisticsActions";

export default function control(state = {}, action) {
  switch (action.type) {
    case GETNEXTADDRESS_ATTEMPT:
      return {
        ...state,
        getNextAddressError: null,
        getNextAddressRequestAttempt: true
      };
    case GETNEXTADDRESS_FAILED:
      return {
        ...state,
        getNextAddressError: String(action.error),
        getNextAddressRequestAttempt: false
      };
    case GETNEXTADDRESS_SUCCESS:
      return {
        ...state,
        getNextAddressError: "",
        getNextAddressRequestAttempt: false,
        getNextAddressResponse: action.getNextAddressResponse
      };
    case GETNEXTCHANGEADDRESS_ATTEMPT:
      return {
        ...state,
        getNextChangeAddressError: null,
        getNextChangeAddressRequestAttempt: true
      };
    case GETNEXTCHANGEADDRESS_FAILED:
      return {
        ...state,
        getNextChangeAddressError: String(action.error),
        getNextChangeAddressRequestAttempt: false
      };
    case GETNEXTCHANGEADDRESS_SUCCESS:
      return {
        ...state,
        getNextChangeAddressError: "",
        getNextChangeAddressRequestAttempt: false,
        getNextChangeAddressResponse: action.getNextChangeAddressResponse
      };
    case RENAMEACCOUNT_ATTEMPT:
      return {
        ...state,
        renameAccountError: null,
        renameAccountRequestAttempt: true
      };
    case RENAMEACCOUNT_FAILED:
      return {
        ...state,
        renameAccountError: String(action.error),
        renameAccountRequestAttempt: false
      };
    case RENAMEACCOUNT_SUCCESS:
      return {
        ...state,
        renameAccountError: null,
        renameAccountRequestAttempt: false,
        renameAccountResponse: action.renameAccountResponse,
        renameAccountSuccess: action.renameAccountSuccess
      };
    case RESCAN_ATTEMPT:
      return {
        ...state,
        rescanCall: null,
        rescanError: null,
        rescanRequest: action.request,
        rescanRequestAttempt: true
      };
    case RESCAN_FAILED:
      return {
        ...state,
        rescanCall: null,
        rescanError: String(action.error),
        rescanRequestAttempt: false
      };
    case RESCAN_PROGRESS:
      return {
        ...state,
        rescanCall: action.rescanCall,
        rescanResponse: action.rescanResponse
      };
    case RESCAN_CANCEL:
    case RESCAN_COMPLETE:
      return {
        ...state,
        rescanCall: null,
        rescanError: "",
        rescanRequest: null,
        rescanRequestAttempt: false,
        rescanResponse: null
      };
    case GETNEXTACCOUNT_ATTEMPT:
      return {
        ...state,
        getNextAccountError: null,
        getNextAccountRequestAttempt: true
      };
    case GETNEXTACCOUNT_FAILED:
      return {
        ...state,
        getNextAccountError: String(action.error),
        getNextAccountRequestAttempt: false
      };
    case GETNEXTACCOUNT_SUCCESS:
      return {
        ...state,
        getNextAccountError: null,
        getNextAccountRequestAttempt: false,
        getNextAccountResponse: action.getNextAccountResponse,
        getNextAccountSuccess: action.successMessage
      };
    case IMPORTPRIVKEY_ATTEMPT:
      return {
        ...state,
        importPrivateKeyError: null,
        importPrivateKeyRequestAttempt: true
      };
    case IMPORTPRIVKEY_FAILED:
      return {
        ...state,
        importPrivateKeyError: String(action.error),
        importPrivateKeyRequestAttempt: false
      };
    case IMPORTPRIVKEY_SUCCESS:
      return {
        ...state,
        importPrivateKeyError: "",
        importPrivateKeyRequestAttempt: false,
        importPrivateKeyResponse: action.importPrivateKeyResponse
      };
    case CHANGEPASSPHRASE_ATTEMPT:
      return {
        ...state,
        changePassphraseError: null,
        changePassphraseRequestAttempt: true
      };
    case CHANGEPASSPHRASE_FAILED:
      return {
        ...state,
        changePassphraseError: String(action.error),
        changePassphraseRequestAttempt: false
      };
    case CHANGEPASSPHRASE_SUCCESS:
      return {
        ...state,
        changePassphraseError: null,
        changePassphraseRequestAttempt: false,
        changePassphraseResponse: action.changePassphraseResponse,
        changePassphraseSuccess:
          "Your private passphrase was successfully updated."
      };
    case SETACCOUNTPASSPHRASE_SUCCESS:
      return {
        ...state,
        balances: action.accounts
      };
    case FUNDTX_ATTEMPT:
      return {
        ...state,
        fundTransactionError: null,
        fundTransactionRequestAttempt: true
      };
    case FUNDTX_FAILED:
      return {
        ...state,
        fundTransactionError: String(action.error),
        fundTransactionRequestAttempt: false
      };
    case FUNDTX_SUCCESS:
      return {
        ...state,
        fundTransactionError: null,
        fundTransactionRequestAttempt: false,
        fundTransactionResponse: action.fundTransactionResponse
      };
    case CLEARTX:
      return {
        ...state,
        constructTxResponse: null,
        constructTxLowBalance: false,
        validateAddressResponse: null,
        validateAddressError: null
      };
    case SIGNTX_ATTEMPT:
      return {
        ...state,
        signTransactionRequestAttempt: true,
        signTransactionResponse: null
      };
    case SIGNTX_FAILED:
      return {
        ...state,
        signTransactionRequestAttempt: false,
        signTransactionResponse: null
      };
    case SIGNTX_SUCCESS:
      return {
        ...state,
        signTransactionRequestAttempt: false,
        signTransactionResponse: action.signTransactionResponse
      };
    case PUBLISHTX_ATTEMPT:
      return { ...state, publishTransactionRequestAttempt: true };
    case PUBLISHTX_FAILED:
      return { ...state, publishTransactionRequestAttempt: false };
    case PUBLISHTX_SUCCESS:
      return {
        ...state,
        publishTransactionRequestAttempt: false,
        publishTransactionResponse: action.hash,
        constructTxResponse: null,
        signTxResponse: null,
        changeScriptByAccount: action.changeScriptByAccount
      };
    case PURCHASETICKETS_ATTEMPT:
      return {
        ...state,
        purchaseTicketsError: null,
        purchaseTicketsRequestAttempt: true,
        // set modalVisible to false to hide blur effect instantly.
        // Without this, it is dismissed with delay. Some hint for later
        // investigation: the redux store updates fine, but the selector reads
        // the value of `modalVisible` wrong at first, and after some delay,
        // it is updated with the right value.
        modalVisible: false
      };
    case PURCHASETICKETS_FAILED:
      return {
        ...state,
        purchaseTicketsError: String(action.error),
        purchaseTicketsRequestAttempt: false
      };
    case PURCHASETICKETS_SUCCESS_LESS:
    case PURCHASETICKETS_SUCCESS:
      return {
        ...state,
        purchaseTicketsError: null,
        purchaseTicketsRequestAttempt: false,
        purchaseTicketsResponse: action.purchaseTicketsResponse
      };
    case CREATE_UNSIGNEDTICKETS_SUCCESS:
      return {
        ...state,
        purchaseTicketsError: null,
        purchaseTicketsRequestAttempt: false,
        purchaseTicketsResponse: action.purchaseTicketsResponse
      };
    case CONSTRUCTTX_ATTEMPT:
      return {
        ...state,
        constructTxRequestAttempt: action.constructTxRequestAttempt,
        constructTxLowBalance: false
      };
    case CONSTRUCTTX_FAILED:
      return {
        ...state,
        constructTxRequestAttempt: false,
        constructTxResponse: null
      };
    case CONSTRUCTTX_FAILED_LOW_BALANCE:
      return {
        ...state,
        constructTxRequestAttempt: false,
        constructTxResponse: null,
        constructTxLowBalance: true
      };
    case CONSTRUCTTX_SUCCESS:
      return {
        ...state,
        changeScriptByAccount: action.changeScriptByAccount,
        constructTxRequestAttempt: false,
        constructTxResponse: action.constructTxResponse
      };
    case EXPORT_STARTED:
      return { ...state, exportingData: true };
    case EXPORT_COMPLETED:
      return { ...state, exportingData: false };
    case EXPORT_ERROR:
      return { ...state, exportingData: false };
    case MODAL_VISIBLE:
      return { ...state, modalVisible: true };
    case MODAL_HIDDEN:
      return { ...state, modalVisible: false };
    case SHOW_ABOUT_MODAL_MACOS:
      return { ...state, aboutModalMacOSVisible: true };
    case HIDE_ABOUT_MODAL_MACOS:
      return { ...state, aboutModalMacOSVisible: false };
    case SHOW_CANTCLOSE_MODAL:
      return { ...state, cantCloseModalVisible: true };
    case HIDE_CANTCLOSE_MODAL:
      return { ...state, cantCloseModalVisible: false };
    case GETACCOUNTEXTENDEDKEY_ATTEMPT:
      return {
        ...state,
        getAccountExtendedKeyRequest: true,
        getAccountExtendedKeyResponse: null
      };
    case GETACCOUNTEXTENDEDKEY_FAILED:
      return {
        ...state,
        getAccountExtendedKeyRequest: false,
        getAccountExtendedKeyResponse: null
      };
    case GETACCOUNTEXTENDEDKEY_SUCCESS:
      return {
        ...state,
        getAccountExtendedKeyRequest: false,
        getAccountExtendedKeyResponse: action.getAccountExtendedKeyResponse
      };
    case CLOSEWALLET_SUCCESS:
      return {
        ...state,
        changeScriptByAccount: {}
      };
    case MONITORLOCKACBLEACCOUNTS_STARTED:
      return {
        ...state,
        monitorLockableAccountsTimer: action.timer
      };
    case MONITORLOCKACBLEACCOUNTS_STOPPED:
      return {
        ...state,
        monitorLockableAccountsTimer: null
      };
    case UNLOCKANDEXECFN_ATTEMPT:
      return {
        ...state,
        unlockAndExecFnRunning: true
      };
    case UNLOCKANDEXECFN_FAILED:
      return {
        ...state,
        unlockAndExecFnRunning: false
      };
    case UNLOCKANDEXECFN_SUCCESS:
      return {
        ...state,
        unlockAndExecFnRunning: false
      };
    case CONFIRMATIONDIALOG_REQUESTED:
      return {
        ...state,
        confirmationDialogModalVisible: true
      };
    case CONFIRMATIONDIALOG_HIDDEN:
      return {
        ...state,
        confirmationDialogModalVisible: false
      };
    case DISCOVERUSAGE_ATTEMPT:
      return {
        ...state,
        discoverUsageAttempt: true
      };
    case DISCOVERUSAGE_FAILED:
      return {
        ...state,
        discoverUsageAttempt: false
      };
    case DISCOVERUSAGE_SUCCESS:
      return {
        ...state,
        discoverUsageAttempt: false
      };
    case SETACCOUNTSPASSPHRASE_ATTEMPT:
      return {
        ...state,
        settingAccountsPassphrase: true
      };
    case SETACCOUNTSPASSPHRASE_SUCCESS:
      return {
        ...state,
        settingAccountsPassphrase: false
      };
    case SETACCOUNTSPASSPHRASE_FAILED:
      return {
        ...state,
        settingAccountsPassphrase: false
      };
    case SET_PAGEBODY_SCROLLHANDLER:
      return {
        ...state,
        pageBodyScrollHandler: action.scrollHandler
      };
    case SET_PAGEBODY_TOP_REF:
      return {
        ...state,
        pageBodyTopRef: action.ref
      };
    default:
      return state;
  }
}
