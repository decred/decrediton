import { GETNEXTADDRESS_ATTEMPT, GETNEXTADDRESS_FAILED, GETNEXTADDRESS_SUCCESS,
  RENAMEACCOUNT_ATTEMPT, RENAMEACCOUNT_FAILED, RENAMEACCOUNT_SUCCESS,
  RENAMEACCOUNT_CLEAR_ERROR, RENAMEACCOUNT_CLEAR_SUCCESS,
  RESCAN_ATTEMPT, RESCAN_FAILED, RESCAN_PROGRESS, RESCAN_COMPLETE,
  GETNEXTACCOUNT_ATTEMPT, GETNEXTACCOUNT_FAILED, GETNEXTACCOUNT_SUCCESS,
  GETNEXTACCOUNT_CLEAR_ERROR, GETNEXTACCOUNT_CLEAR_SUCCESS,
  IMPORTPRIVKEY_ATTEMPT, IMPORTPRIVKEY_FAILED, IMPORTPRIVKEY_SUCCESS,
  IMPORTSCRIPT_ATTEMPT, IMPORTSCRIPT_FAILED, IMPORTSCRIPT_SUCCESS,
  IMPORTSCRIPT_CLEAR_ERROR, IMPORTSCRIPT_CLEAR_SUCCESS,
  CHANGEPASSPHRASE_ATTEMPT, CHANGEPASSPHRASE_FAILED, CHANGEPASSPHRASE_SUCCESS,
  CHANGEPASSPHRASE_CLEAR_ERROR, CHANGEPASSPHRASE_CLEAR_SUCCESS,
  LOADACTIVEDATAFILTERS_ATTEMPT, LOADACTIVEDATAFILTERS_FAILED, LOADACTIVEDATAFILTERS_SUCCESS,
  FUNDTX_ATTEMPT, FUNDTX_FAILED, FUNDTX_SUCCESS,
  CLEARTX,
  SIGNTX_ATTEMPT, SIGNTX_FAILED, SIGNTX_SUCCESS,
  PUBLISHTX_ATTEMPT, PUBLISHTX_FAILED, PUBLISHTX_SUCCESS,
  PURCHASETICKETS_ATTEMPT, PURCHASETICKETS_FAILED, PURCHASETICKETS_SUCCESS,
  PURCHASETICKETS_CLEAR_ERROR, PURCHASETICKETS_CLEAR_SUCCESS,
  REVOKETICKETS_ATTEMPT, REVOKETICKETS_FAILED, REVOKETICKETS_SUCCESS,
  REVOKETICKETS_CLEAR_ERROR, REVOKETICKETS_CLEAR_SUCCESS,
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
    };
  case GETNEXTADDRESS_FAILED:
    return {...state,
      getNextAddressError: action.error,
      getNextAddressRequestAttempt: false,
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
    };
  case RENAMEACCOUNT_FAILED:
    return {...state,
      renameAccountError: action.error,
      renameAccountRequestAttempt: false,
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
      rescanRequest: action.request,
      rescanRequestAttempt: true,
    };
  case RESCAN_FAILED:
    return {...state,
      rescanError: action.error,
      rescanRequestAttempt: false,
    };
  case RESCAN_PROGRESS:
    return {...state,
      rescanResponse: action.rescanResponse,
    };
  case RESCAN_COMPLETE:
    return {...state,
      rescanError: '',
      rescanRequest: null,
      rescanRequestAttempt: false,
      rescanResponse: null,
    };
  case GETNEXTACCOUNT_ATTEMPT:
    return {...state,
      getNextAccountError: null,
      getNextAccountRequestAttempt: true,
    };
  case GETNEXTACCOUNT_FAILED:
    return {...state,
      getNextAccountError: action.error,
      getNextAccountRequestAttempt: false,
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
    };
  case IMPORTPRIVKEY_FAILED:
    return {...state,
      importPrivateKeyError: action.error,
      importPrivateKeyRequestAttempt: false,
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
    };
  case IMPORTSCRIPT_FAILED:
    return {...state,
      importScriptError: action.error,
      importScriptRequestAttempt: false,
      purchaseTicketsRequestAttempt: false,
    };
  case IMPORTSCRIPT_SUCCESS:
    return {...state,
      importScriptError: null,
      importScriptRequestAttempt: false,
      importScriptResponse: action.importScriptResponse,
      importScriptSuccess: action.importScriptSuccess,
    };
  case IMPORTSCRIPT_CLEAR_ERROR:
    return {...state,
      importScriptError: null,
    };
  case  IMPORTSCRIPT_CLEAR_SUCCESS:
    return {...state,
      importScriptSuccess: '',
    };
  case CHANGEPASSPHRASE_ATTEMPT:
    return {...state,
      changePassphraseError: null,
      changePassphraseRequestAttempt: true,
    };
  case CHANGEPASSPHRASE_FAILED:
    return {...state,
      changePassphraseError: action.error,
      changePassphraseRequestAttempt: false,
    };
  case CHANGEPASSPHRASE_SUCCESS:
    return {...state,
      changePassphraseError: null,
      changePassphraseRequestAttempt: false,
      changePassphraseResponse: action.changePassphraseResponse,
      changePassphraseSuccess: 'Your private passphrase was successfully updated.',
    };
  case CHANGEPASSPHRASE_CLEAR_ERROR:
    return {...state,
      changePassphraseError: null,
    };
  case  CHANGEPASSPHRASE_CLEAR_SUCCESS:
    return {...state,
      changePassphraseSuccess: '',
    };
  case LOADACTIVEDATAFILTERS_ATTEMPT:
    return {...state,
      loadActiveDataFiltersError: null,
      loadActiveDataFiltersRequestAttempt: true,
    };
  case LOADACTIVEDATAFILTERS_FAILED:
    return {...state,
      loadActiveDataFiltersError: action.error,
      loadActiveDataFiltersRequestAttempt: false,
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
    };
  case FUNDTX_FAILED:
    return {...state,
      fundTransactionError: action.error,
      fundTransactionRequestAttempt: false,
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
    };
  case SIGNTX_FAILED:
    return {...state,
      signTransactionError: action.error,
      signTransactionRequestAttempt: false,
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
    };
  case PUBLISHTX_FAILED:
    return {...state,
      publishTransactionError: action.error,
      publishTransactionRequestAttempt: false,
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
    };
  case PURCHASETICKETS_FAILED:
    return {...state,
      purchaseTicketsError: action.error,
      purchaseTicketsRequestAttempt: false,
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
  case REVOKETICKETS_ATTEMPT:
    return {...state,
      revokeTicketsError: null,
      revokeTicketsRequestAttempt: true,
    };
  case REVOKETICKETS_FAILED:
    return {...state,
      revokeTicketsError: action.error,
      revokeTicketsRequestAttempt: false,
    };
  case REVOKETICKETS_SUCCESS:
    return {...state,
      revokeTicketsError: null,
      revokeTicketsSuccess: action.success,
      revokeTicketsRequestAttempt: false,
      revokeTicketsResponse: action.revokeTicketsResponse,
    };
  case REVOKETICKETS_CLEAR_ERROR:
    return {...state,
      revokeTicketsError: null,
    };
  case  REVOKETICKETS_CLEAR_SUCCESS:
    return {...state,
      revokeTicketsSuccess: '',
    };
  case GETTICKETBUYERCONFIG_ATTEMPT:
    return {
      ...state,
      getTicketBuyerConfigError: null,
      getTicketBuyerConfigRequestAttempt: true,
    };
  case GETTICKETBUYERCONFIG_FAILED:
    return {
      ...state,
      getTicketBuyerConfigError: action.error,
      getTicketBuyerConfigRequestAttempt: false,
    };
  case GETTICKETBUYERCONFIG_SUCCESS:
    return {
      ...state,
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
    };
  case STARTAUTOBUYER_FAILED:
    return {...state,
      startAutoBuyerError: action.error,
      startAutoBuyerRequestAttempt: false,
    };
  case STARTAUTOBUYER_SUCCESS:
    return {...state,
      startAutoBuyerError: null,
      startAutoBuyerSuccess: action.success,
      startAutoBuyerRequestAttempt: false,
      startAutoBuyerResponse: action.startAutoBuyerResponse,
      stopAutoBuyerSuccess: null,
      stopAutoBuyerResponse: null,
      balanceToMaintain: action.balanceToMaintain,
      maxFeePerKb: action.maxFeePerKb,
      maxPriceRelative: action.maxPriceRelative,
      maxPriceAbsolute: action.maxPriceAbsolute,
      maxPerBlock: action.maxPerBlock,
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
    };
  case STOPAUTOBUYER_FAILED:
    return {...state,
      stopAutoBuyerError: action.error,
      stopAutoBuyerRequestAttempt: false,
    };
  case STOPAUTOBUYER_SUCCESS:
    return {...state,
      stopAutoBuyerError: null,
      stopAutoBuyerSuccess: action.success,
      stopAutoBuyerRequestAttempt: false,
      stopAutoBuyerResponse: action.stopAutoBuyerResponse,
      startAutoBuyerSuccess: null,
      startAutoBuyerResponse: null,
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
