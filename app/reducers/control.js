import { GETNEXTADDRESS_ATTEMPT, GETNEXTADDRESS_FAILED, GETNEXTADDRESS_SUCCESS,
  RENAMEACCOUNT_ATTEMPT, RENAMEACCOUNT_FAILED, RENAMEACCOUNT_SUCCESS,
  RENAMEACCOUNT_CLEAR_ERROR, RENAMEACCOUNT_CLEAR_SUCCESS,
  RESCAN_ATTEMPT, RESCAN_FAILED, RESCAN_PROGRESS, RESCAN_COMPLETE,
  GETNEXTACCOUNT_ATTEMPT, GETNEXTACCOUNT_FAILED, GETNEXTACCOUNT_SUCCESS,
  GETNEXTACCOUNT_CLEAR_ERROR, GETNEXTACCOUNT_CLEAR_SUCCESS,
  IMPORTPRIVKEY_ATTEMPT, IMPORTPRIVKEY_FAILED, IMPORTPRIVKEY_SUCCESS,
  IMPORTSCRIPT_ATTEMPT, IMPORTSCRIPT_FAILED, IMPORTSCRIPT_SUCCESS,
  CHANGEPASSPHRASE_ATTEMPT, CHANGEPASSPHRASE_FAILED, CHANGEPASSPHRASE_SUCCESS,
  LOADACTIVEDATAFILTERS_ATTEMPT, LOADACTIVEDATAFILTERS_FAILED, LOADACTIVEDATAFILTERS_SUCCESS,
  FUNDTX_ATTEMPT, FUNDTX_FAILED, FUNDTX_SUCCESS,
  CLEARTX,
  SIGNTX_ATTEMPT, SIGNTX_FAILED, SIGNTX_SUCCESS,
  PUBLISHTX_ATTEMPT, PUBLISHTX_FAILED, PUBLISHTX_SUCCESS,
  PURCHASETICKETS_ATTEMPT, PURCHASETICKETS_FAILED, PURCHASETICKETS_SUCCESS,
  PURCHASETICKETS_CLEAR_ERROR, PURCHASETICKETS_CLEAR_SUCCESS,
  GETTICKETBUYERCONFIG_ATTEMPT, GETTICKETBUYERCONFIG_FAILED, GETTICKETBUYERCONFIG_SUCCESS,
  SETTICKETBUYERCONFIG_ATTEMPT, SETTICKETBUYERCONFIG_FAILED, SETTICKETBUYERCONFIG_SUCCESS,
  STARTAUTOBUYER_ATTEMPT, STARTAUTOBUYER_FAILED, STARTAUTOBUYER_SUCCESS,
  STARTAUTOBUYER_CLEAR_ERROR, STARTAUTOBUYER_CLEAR_SUCCESS,
  STOPAUTOBUYER_ATTEMPT, STOPAUTOBUYER_FAILED, STOPAUTOBUYER_SUCCESS,
  STOPAUTOBUYER_CLEAR_ERROR, STOPAUTOBUYER_CLEAR_SUCCESS,
  CONSTRUCTTX_ATTEMPT, CONSTRUCTTX_FAILED, CONSTRUCTTX_SUCCESS,
  CONSTRUCTTX_CLEAR_ERROR, PUBLISHTX_CLEAR_ERROR, SIGNTX_CLEAR_ERROR, PUBLISHTX_CLEAR_SUCCESS,
  SETBALANCETOMAINTAIN, SETMAXFEE, SETMAXPRICEABSOLUTE, SETMAXPRICERELATIVE, SETMAXPERBLOCK
 } from '../actions/ControlActions';

export default function control(state = {}, action) {
  switch (action.type) {
  case GETNEXTADDRESS_ATTEMPT:
    return {...state,
      getNextAddressError: null,
      getNextAddressRequestAttempt: true,
      getNextAddressRequest: action.request,
    };
  case GETNEXTADDRESS_FAILED:
    return {...state,
      getNextAddressError: action.error,
      getNextAddressRequestAttempt: false,
      getNextAddressRequest: null,
    };
  case GETNEXTADDRESS_SUCCESS:
    return {...state,
      getNextAddressError: '',
      getNextAddressRequestAttempt: false,
      getNextAddressResponse: action.getNextAddressResponse,
    };
  case RENAMEACCOUNT_ATTEMPT:
    return {...state,
      renameAccountError: null,
      renameAccountRequestAttempt: true,
      renameAccountRequest: action.request,
    };
  case RENAMEACCOUNT_FAILED:
    return {...state,
      renameAccountError: action.error,
      renameAccountRequestAttempt: false,
      renameAccountRequest: null,
    };
  case RENAMEACCOUNT_SUCCESS:
    return {...state,
      renameAccountError: null,
      renameAccountRequestAttempt: false,
      renameAccountResponse: action.renameAccountResponse,
      renameAccountSuccess: action.renameAccountSuccess,
    };
  case  RENAMEACCOUNT_CLEAR_ERROR:
    return {...state,
      renameAccountError: null,
    };
  case  RENAMEACCOUNT_CLEAR_SUCCESS:
    return {...state,
      renameAccountSuccess: null,
    };
  case RESCAN_ATTEMPT:
    return {...state,
      rescanError: null,
      rescanRequestAttempt: true,
      rescanRequest: action.request,
    };
  case RESCAN_FAILED:
    return {...state,
      rescanError: action.error,
      rescanRequestAttempt: false,
      rescanRequest: null,
    };
  case RESCAN_PROGRESS:
    return {...state,
      rescanResponse: action.rescanResponse,
    };
  case RESCAN_COMPLETE:
    return {...state,
      rescanError: '',
      rescanRequestAttempt: false,
      rescanResponse: null,
      rescanRequest: null,
    };
  case GETNEXTACCOUNT_ATTEMPT:
    return {...state,
      getNextAccountError: null,
      getNextAccountRequestAttempt: true,
      getNextAccountRequest: action.request,
    };
  case GETNEXTACCOUNT_FAILED:
    return {...state,
      getNextAccountError: action.error,
      getNextAccountRequestAttempt: false,
      getNextAccountRequest: null,
    };
  case GETNEXTACCOUNT_SUCCESS:
    return {...state,
      getNextAccountError: null,
      getNextAccountRequestAttempt: false,
      getNextAccountResponse: action.getNextAccountResponse,
      getNextAccountSuccess: action.successMessage,
    };
  case  GETNEXTACCOUNT_CLEAR_ERROR:
    return {...state,
      getNextAccountError: null,
    };
  case  GETNEXTACCOUNT_CLEAR_SUCCESS:
    return {...state,
      getNextAccountSuccess: null,
    };
  case IMPORTPRIVKEY_ATTEMPT:
    return {...state,
      importPrivateKeyError: null,
      importPrivateKeyRequestAttempt: true,
      importPrivateKeyRequest: action.request,
    };
  case IMPORTPRIVKEY_FAILED:
    return {...state,
      importPrivateKeyError: action.error,
      importPrivateKeyRequestAttempt: false,
      importPrivateKeyRequest: null,
    };
  case IMPORTPRIVKEY_SUCCESS:
    return {...state,
      importPrivateKeyError: '',
      importPrivateKeyRequestAttempt: false,
      importPrivateKeyResponse: action.importPrivateKeyResponse,
    };
  case IMPORTSCRIPT_ATTEMPT:
    return {...state,
      importScriptError: null,
      importScriptRequestAttempt: true,
      importScriptRequest: action.request,
    };
  case IMPORTSCRIPT_FAILED:
    return {...state,
      importScriptError: action.error,
      importScriptRequestAttempt: false,
      importScriptRequest: null,
    };
  case IMPORTSCRIPT_SUCCESS:
    return {...state,
      importScriptError: '',
      importScriptRequestAttempt: false,
      importScriptResponse: action.importScriptResponse,
    };
  case CHANGEPASSPHRASE_ATTEMPT:
    return {...state,
      changePassphraseError: null,
      changePassphraseRequestAttempt: true,
      changePassphraseRequest: action.request,
    };
  case CHANGEPASSPHRASE_FAILED:
    return {...state,
      changePassphraseError: action.error,
      changePassphraseRequestAttempt: false,
      changePassphraseRequest: null,
    };
  case CHANGEPASSPHRASE_SUCCESS:
    return {...state,
      changePassphraseError: '',
      changePassphraseRequestAttempt: false,
      changePassphraseResponse: action.changePassphraseResponse,
    };
  case LOADACTIVEDATAFILTERS_ATTEMPT:
    return {...state,
      loadActiveDataFiltersError: null,
      loadActiveDataFiltersRequestAttempt: true,
      loadActiveDataFiltersRequest: action.request,
    };
  case LOADACTIVEDATAFILTERS_FAILED:
    return {...state,
      loadActiveDataFiltersError: action.error,
      loadActiveDataFiltersRequestAttempt: false,
      loadActiveDataFiltersRequest: null,
    };
  case LOADACTIVEDATAFILTERS_SUCCESS:
    return {...state,
      loadActiveDataFiltersError: null,
      loadActiveDataFiltersRequestAttempt: false,
      loadActiveDataFiltersResponse: action.response,
    };
  case FUNDTX_ATTEMPT:
    return {...state,
      fundTransactionError: null,
      fundTransactionRequestAttempt: true,
      fundTransactionRequest: action.request,
    };
  case FUNDTX_FAILED:
    return {...state,
      fundTransactionError: action.error,
      fundTransactionRequestAttempt: false,
      fundTransactionRequest: null,
    };
  case FUNDTX_SUCCESS:
    return {...state,
      fundTransactionError: null,
      fundTransactionRequestAttempt: false,
      fundTransactionResponse: action.fundTransactionResponse,
    };
  case CLEARTX:
    return {...state,
      constructTxResponse: null,
    };
  case SIGNTX_ATTEMPT:
    return {...state,
      signTransactionError: null,
      signTransactionRequestAttempt: true,
      signTransactionRequest: action.request,
    };
  case SIGNTX_FAILED:
    return {...state,
      signTransactionError: action.error,
      signTransactionRequestAttempt: false,
      signTransactionRequest: null,
    };
  case SIGNTX_SUCCESS:
    return {...state,
      signTransactionError: null,
      signTransactionRequestAttempt: false,
      signTransactionResponse: action.signTransactionResponse,
    };
  case PUBLISHTX_ATTEMPT:
    return {...state,
      publishTransactionError: null,
      publishTransactionRequestAttempt: true,
      publishTransactionRequest: action.request,
    };
  case PUBLISHTX_FAILED:
    return {...state,
      publishTransactionError: action.error,
      publishTransactionRequestAttempt: false,
      publishTransactionRequest: null,
    };
  case PUBLISHTX_SUCCESS:
    return {...state,
      publishTransactionError: null,
      publishTransactionRequestAttempt: false,
      publishTransactionResponse: action.publishTransactionResponse,
      constructTxResponse: null,
      signTxResponse: null,
    };
  case  PUBLISHTX_CLEAR_ERROR:
    return {...state,
      publishTransactionError: null,
    };
  case  PUBLISHTX_CLEAR_SUCCESS:
    return {...state,
      publishTransactionResponse: null,
    };
  case  SIGNTX_CLEAR_ERROR:
    return {...state,
      signTransactionError: null,
    };
  case CONSTRUCTTX_CLEAR_ERROR:
    return {...state,
      constructTxError: null,
    };
  case PURCHASETICKETS_ATTEMPT:
    return {...state,
      purchaseTicketsError: null,
      purchaseTicketsRequestAttempt: true,
      purchaseTicketsRequest: action.request,
    };
  case PURCHASETICKETS_FAILED:
    return {...state,
      purchaseTicketsError: action.error,
      purchaseTicketsRequestAttempt: false,
      purchaseTicketsRequest: null,
    };
  case PURCHASETICKETS_SUCCESS:
    return {...state,
      purchaseTicketsError: null,
      purchaseTicketsSuccess: action.success,
      purchaseTicketsRequestAttempt: false,
      purchaseTicketsResponse: action.purchaseTicketsResponse,
    };
  case PURCHASETICKETS_CLEAR_ERROR:
    return {...state,
      purchaseTicketsError: null,
    };
  case  PURCHASETICKETS_CLEAR_SUCCESS:
    return {...state,
      purchaseTicketsSuccess: '',
    };
  case GETTICKETBUYERCONFIG_ATTEMPT:
    return {
      ...state,
      getTicketBuyerConfigRequest: action.request,
      getTicketBuyerConfigError: null,
      getTicketBuyerConfigRequestAttempt: true,
    };
  case GETTICKETBUYERCONFIG_FAILED:
    return {
      ...state,
      getTicketBuyerConfigRequest: null,
      getTicketBuyerConfigError: action.error,
      getTicketBuyerConfigRequestAttempt: false,
    };
  case GETTICKETBUYERCONFIG_SUCCESS:
    return {
      ...state,
      getTicketBuyerConfigRequest: null,
      getTicketBuyerConfigRequestAttempt: false,
      getTicketBuyerConfigResponse: action.ticketBuyerConfig,
    };
  case SETTICKETBUYERCONFIG_ATTEMPT:
    return {
      ...state,
      setTicketBuyerConfigError: null,
      setTicketBuyerConfigRequestAttempt: true,
      setTicketBuyerConfigResponse: null,
    };
  case SETTICKETBUYERCONFIG_FAILED:
    return {
      ...state,
      setTicketBuyerConfigError: action.error,
      setTicketBuyerConfigRequestAttempt: false,
    };
  case SETTICKETBUYERCONFIG_SUCCESS:
    return {
      ...state,
      setTicketBuyerConfigRequestAttempt: false,
      setTicketBuyerConfigResponse: action.success,
    };
  case SETBALANCETOMAINTAIN:
    return {
      ...state,
      balanceToMaintain: action.balanceToMaintain,
    };
  case SETMAXFEE:
    return {
      ...state,
      maxFee: action.maxFee,
    };
  case SETMAXPRICEABSOLUTE:
    return {
      ...state,
      maxPriceAbsolute: action.maxPriceAbsolute,
    };
  case SETMAXPRICERELATIVE:
    return {
      ...state,
      maxPriceRelative: action.maxPriceRelative,
    };
  case SETMAXPERBLOCK:
    return {
      ...state,
      maxPerBlock: action.maxPerBlock,
    };
  case STARTAUTOBUYER_ATTEMPT:
    return {...state,
      startAutoBuyerError: null,
      startAutoBuyerRequestAttempt: true,
      startAutoBuyerRequest: action.request,
    };
  case STARTAUTOBUYER_FAILED:
    return {...state,
      startAutoBuyerError: action.error,
      startAutoBuyerRequestAttempt: false,
      startAutoBuyerRequest: null,
    };
  case STARTAUTOBUYER_SUCCESS:
    return {...state,
      startAutoBuyerError: null,
      startAutoBuyerSuccess: action.success,
      startAutoBuyerRequestAttempt: false,
      startAutoBuyerResponse: action.startAutoBuyerResponse,
      stopAutoBuyerSuccess: null,
      stopAutoBuyerRequest: null,
      stopAutoBuyerResponse: null,
    };
  case STARTAUTOBUYER_CLEAR_ERROR:
    return {...state,
      startAutoBuyerError: null,
    };
  case  STARTAUTOBUYER_CLEAR_SUCCESS:
    return {...state,
      startAutoBuyerSuccess: null,
    };
  case STOPAUTOBUYER_ATTEMPT:
    return {...state,
      stopAutoBuyerError: null,
      stopAutoBuyerRequestAttempt: true,
      stopAutoBuyerRequest: action.request,
    };
  case STOPAUTOBUYER_FAILED:
    return {...state,
      stopAutoBuyerError: action.error,
      stopAutoBuyerRequestAttempt: false,
      stopAutoBuyerRequest: null,
    };
  case STOPAUTOBUYER_SUCCESS:
    return {...state,
      stopAutoBuyerError: null,
      stopAutoBuyerRequest: null,
      stopAutoBuyerSuccess: action.success,
      stopAutoBuyerRequestAttempt: false,
      stopAutoBuyerResponse: action.stopAutoBuyerResponse,
      startAutoBuyerSuccess: null,
      startAutoBuyerResponse: null,
      startAutoBuyerRequest: null,
    };
  case STOPAUTOBUYER_CLEAR_ERROR:
    return {...state,
      stopAutoBuyerError: null,
    };
  case  STOPAUTOBUYER_CLEAR_SUCCESS:
    return {...state,
      stopAutoBuyerSuccess: null,
    };
  case CONSTRUCTTX_ATTEMPT:
    return {...state,
      constructTxError: null,
      constructTxRequestAttempt: true,
      constructTxRequest: action.request,
    };
  case CONSTRUCTTX_FAILED:
    return {...state,
      constructTxError: action.error,
      constructTxRequestAttempt: false,
      constructTxResponse: null,
    };
  case CONSTRUCTTX_SUCCESS:
    return {...state,
      constructTxError: null,
      constructTxRequestAttempt: false,
      constructTxResponse: action.constructTxResponse,
    };
  default:
    return state;
  }
}
