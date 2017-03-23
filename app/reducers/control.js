import { GETNEXTADDRESS_ATTEMPT, GETNEXTADDRESS_FAILED, GETNEXTADDRESS_SUCCESS } from '../actions/ControlActions';
import { RENAMEACCOUNT_ATTEMPT, RENAMEACCOUNT_FAILED, RENAMEACCOUNT_SUCCESS } from '../actions/ControlActions';
import { RESCAN_ATTEMPT, RESCAN_FAILED, RESCAN_PROGRESS, RESCAN_COMPLETE } from '../actions/ControlActions';
import { GETNEXTACCOUNT_ATTEMPT, GETNEXTACCOUNT_FAILED, GETNEXTACCOUNT_SUCCESS } from '../actions/ControlActions';
import { IMPORTPRIVKEY_ATTEMPT, IMPORTPRIVKEY_FAILED, IMPORTPRIVKEY_SUCCESS } from '../actions/ControlActions';
import { IMPORTSCRIPT_ATTEMPT, IMPORTSCRIPT_FAILED, IMPORTSCRIPT_SUCCESS } from '../actions/ControlActions';
import { CHANGEPASSPHRASE_ATTEMPT, CHANGEPASSPHRASE_FAILED, CHANGEPASSPHRASE_SUCCESS } from '../actions/ControlActions';
import { LOADACTIVEDATAFILTERS_ATTEMPT, LOADACTIVEDATAFILTERS_FAILED, LOADACTIVEDATAFILTERS_SUCCESS } from '../actions/ControlActions';
import { FUNDTX_ATTEMPT, FUNDTX_FAILED, FUNDTX_SUCCESS } from '../actions/ControlActions';
import { CLEARTX } from '../actions/ControlActions';
import { SIGNTX_ATTEMPT, SIGNTX_FAILED, SIGNTX_SUCCESS } from '../actions/ControlActions';
import { PUBLISHTX_ATTEMPT, PUBLISHTX_FAILED, PUBLISHTX_SUCCESS } from '../actions/ControlActions';
import { PURCHASETICKET_ATTEMPT, PURCHASETICKET_FAILED, PURCHASETICKET_SUCCESS } from '../actions/ControlActions';
import { CONSTRUCTTX_ATTEMPT, CONSTRUCTTX_FAILED, CONSTRUCTTX_SUCCESS } from '../actions/ControlActions';

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
      renameAccountError: '',
      renameAccountRequestAttempt: false,
      renameAccountResponse: action.renameAccountResponse,
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
  case PURCHASETICKET_ATTEMPT:
    return {...state,
      purchaseTicketError: null,
      purchaseTicketRequestAttempt: true,
      purchaseTicketRequest: action.request,
    };
  case PURCHASETICKET_FAILED:
    return {...state,
      purchaseTicketError: action.error,
      purchaseTicketRequestAttempt: false,
      purchaseTicketRequest: null,
    };
  case PURCHASETICKET_SUCCESS:
    return {...state,
      purchaseTicketError: '',
      purchaseTicketRequestAttempt: false,
      purchaseTicketResponse: action.purchaseTicketResponse,
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
