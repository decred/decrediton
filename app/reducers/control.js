import {
  GETNEXTADDRESS_ATTEMPT,
  GETNEXTADDRESS_FAILED,
  GETNEXTADDRESS_SUCCESS,
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
  IMPORTSCRIPT_ATTEMPT,
  IMPORTSCRIPT_FAILED,
  IMPORTSCRIPT_SUCCESS,
  IMPORTSCRIPT_SUCCESS_PURCHASE_TICKETS,
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
  REVOKETICKETS_ATTEMPT,
  REVOKETICKETS_FAILED,
  REVOKETICKETS_SUCCESS,
  GETTICKETBUYERCONFIG_ATTEMPT,
  GETTICKETBUYERCONFIG_FAILED,
  GETTICKETBUYERCONFIG_SUCCESS,
  SETTICKETBUYERCONFIG_ATTEMPT,
  SETTICKETBUYERCONFIG_FAILED,
  SETTICKETBUYERCONFIG_SUCCESS,
  STARTAUTOBUYER_ATTEMPT,
  STARTAUTOBUYER_FAILED,
  STARTAUTOBUYER_SUCCESS,
  STOPAUTOBUYER_ATTEMPT,
  STOPAUTOBUYER_FAILED,
  STOPAUTOBUYER_SUCCESS,
  STARTTICKETBUYERV2_ATTEMPT,
  STARTTICKETBUYERV2_FAILED,
  STARTTICKETBUYERV2_SUCCESS,
  STOPTICKETBUYERV2_ATTEMPT,
  STOPTICKETBUYERV2_SUCCESS,
  CONSTRUCTTX_ATTEMPT,
  CONSTRUCTTX_FAILED,
  CONSTRUCTTX_SUCCESS,
  CONSTRUCTTX_FAILED_LOW_BALANCE,
  SETBALANCETOMAINTAIN,
  MODAL_VISIBLE,
  MODAL_HIDDEN,
  SHOW_ABOUT_MODAL_MACOS,
  HIDE_ABOUT_MODAL_MACOS,
  GETACCOUNTEXTENDEDKEY_ATTEMPT,
  GETACCOUNTEXTENDEDKEY_FAILED,
  GETACCOUNTEXTENDEDKEY_SUCCESS,
  HIDE_CANTCLOSE_MODAL,
  SHOW_CANTCLOSE_MODAL
} from "../actions/ControlActions";
import { WALLET_AUTOBUYER_SETTINGS } from "actions/DaemonActions";
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
    case IMPORTSCRIPT_ATTEMPT:
      return {
        ...state,
        importScriptError: null,
        importScriptRequestAttempt: true
      };
    case IMPORTSCRIPT_FAILED:
      return {
        ...state,
        importScriptError: String(action.error),
        importScriptRequestAttempt: false,
        purchaseTicketsRequestAttempt: false
      };
    case IMPORTSCRIPT_SUCCESS:
      return {
        ...state,
        importScriptError: null,
        importScriptRequestAttempt: false,
        importScriptResponse: action.importScriptResponse
      };
    case IMPORTSCRIPT_SUCCESS_PURCHASE_TICKETS:
      return {
        ...state,
        importScriptError: null,
        importScriptRequestAttempt: false,
        importScriptResponse: action.importScriptResponse
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
        numTicketsToBuy: action.numTicketsToBuy
      };
    case PURCHASETICKETS_FAILED:
      return {
        ...state,
        purchaseTicketsError: String(action.error),
        purchaseTicketsRequestAttempt: false,
        importScriptRequestAttempt: false
      };
    case PURCHASETICKETS_SUCCESS_LESS:
    case PURCHASETICKETS_SUCCESS:
      return {
        ...state,
        purchaseTicketsError: null,
        purchaseTicketsRequestAttempt: false,
        purchaseTicketsResponse: action.purchaseTicketsResponse,
        numTicketsToBuy: 1
      };
    case CREATE_UNSIGNEDTICKETS_SUCCESS:
      return {
        ...state,
        purchaseTicketsError: null,
        purchaseTicketsRequestAttempt: false,
        purchaseTicketsResponse: action.purchaseTicketsResponse,
        numTicketsToBuy: 1
      };
    case REVOKETICKETS_ATTEMPT:
      return {
        ...state,
        revokeTicketsError: null,
        revokeTicketsRequestAttempt: true
      };
    case REVOKETICKETS_FAILED:
      return {
        ...state,
        revokeTicketsError: String(action.error),
        revokeTicketsRequestAttempt: false
      };
    case REVOKETICKETS_SUCCESS:
      return {
        ...state,
        revokeTicketsError: null,
        revokeTicketsRequestAttempt: false,
        revokeTicketsResponse: action.revokeTicketsResponse
      };
    case GETTICKETBUYERCONFIG_ATTEMPT:
      return {
        ...state,
        getTicketBuyerConfigError: null,
        getTicketBuyerConfigRequestAttempt: true
      };
    case GETTICKETBUYERCONFIG_FAILED:
      return {
        ...state,
        getTicketBuyerConfigError: String(action.error),
        getTicketBuyerConfigRequestAttempt: false
      };
    case GETTICKETBUYERCONFIG_SUCCESS:
      return {
        ...state,
        getTicketBuyerConfigRequestAttempt: false,
        getTicketBuyerConfigResponse: action.ticketBuyerConfig
      };
    case SETTICKETBUYERCONFIG_ATTEMPT:
      return {
        ...state,
        setTicketBuyerConfigError: null,
        setTicketBuyerConfigRequestAttempt: true,
        setTicketBuyerConfigResponse: null
      };
    case SETTICKETBUYERCONFIG_FAILED:
      return {
        ...state,
        setTicketBuyerConfigError: action.error,
        setTicketBuyerConfigRequestAttempt: false
      };
    case SETTICKETBUYERCONFIG_SUCCESS:
      return {
        ...state,
        setTicketBuyerConfigRequestAttempt: false,
        setTicketBuyerConfigResponse: action.success
      };
    case SETBALANCETOMAINTAIN:
      return {
        ...state,
        balanceToMaintain: action.balanceToMaintain
      };
    case STARTAUTOBUYER_ATTEMPT:
      return {
        ...state,
        startAutoBuyerError: null,
        startAutoBuyerRequestAttempt: true
      };
    case STARTAUTOBUYER_FAILED:
      return {
        ...state,
        startAutoBuyerError: String(action.error),
        startAutoBuyerRequestAttempt: false
      };
    case STARTAUTOBUYER_SUCCESS:
      return {
        ...state,
        startAutoBuyerError: null,
        startAutoBuyerRequestAttempt: false,
        startAutoBuyerResponse: action.startAutoBuyerResponse,
        stopAutoBuyerResponse: null,
        balanceToMaintain: action.balanceToMaintain
      };
    case STOPAUTOBUYER_ATTEMPT:
      return {
        ...state,
        stopAutoBuyerError: null,
        stopAutoBuyerRequestAttempt: true
      };
    case STOPAUTOBUYER_FAILED:
      return {
        ...state,
        //stopAutoBuyerError: String(action.error),
        stopAutoBuyerRequestAttempt: false
      };
    case STOPAUTOBUYER_SUCCESS:
      return {
        ...state,
        stopAutoBuyerError: null,
        stopAutoBuyerSuccess: action.success,
        stopAutoBuyerRequestAttempt: false,
        stopAutoBuyerResponse: action.stopAutoBuyerResponse,
        startAutoBuyerSuccess: null,
        startAutoBuyerResponse: null
      };
    case STARTTICKETBUYERV2_ATTEMPT:
      return {
        ...state,
        startTicketBuyerAttempt: true,
        startTicketBuyerError: null,
        ticketBuyerConfig: action.ticketBuyerConfig
      };
    case STARTTICKETBUYERV2_FAILED:
      return {
        ...state,
        startTicketBuyerAttempt: false,
        startTicketBuyerError: action.error,
        startAutoBuyerResponse: null
      };
    case STARTTICKETBUYERV2_SUCCESS:
      return {
        ...state,
        startTicketBuyerAttempt: false,
        startTicketBuyerError: null,
        startAutoBuyerResponse: true,
        ticketBuyerCall: action.ticketBuyerCall
      };
    case STOPTICKETBUYERV2_ATTEMPT:
      return { ...state };
    case STOPTICKETBUYERV2_SUCCESS:
      return { ...state, ticketBuyerCall: null, startAutoBuyerResponse: null };
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
    case WALLET_AUTOBUYER_SETTINGS:
      return { ...state, balanceToMaintain: action.balanceToMaintain };
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
      return { ...state, changeScriptByAccount: {} };
    default:
      return state;
  }
}
