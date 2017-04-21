import { CREATEWALLET_ATTEMPT, CREATEWALLET_FAILED, CREATEWALLET_SUCCESS } from '../actions/WalletLoaderActions';
import { LOADER_ATTEMPT, LOADER_FAILED, LOADER_SUCCESS } from '../actions/WalletLoaderActions';
import { WALLETEXIST_ATTEMPT, WALLETEXIST_FAILED, WALLETEXIST_SUCCESS } from '../actions/WalletLoaderActions';
import { OPENWALLET_ATTEMPT, OPENWALLET_FAILED, OPENWALLET_SUCCESS } from '../actions/WalletLoaderActions';
import { CLOSEWALLET_ATTEMPT, CLOSEWALLET_FAILED, CLOSEWALLET_SUCCESS } from '../actions/WalletLoaderActions';
import { STARTRPC_ATTEMPT, STARTRPC_FAILED, STARTRPC_SUCCESS } from '../actions/WalletLoaderActions';
import { DISCOVERADDRESS_ATTEMPT, DISCOVERADDRESS_FAILED, DISCOVERADDRESS_SUCCESS } from '../actions/WalletLoaderActions';
import { SUBSCRIBEBLOCKNTFNS_ATTEMPT, SUBSCRIBEBLOCKNTFNS_FAILED, SUBSCRIBEBLOCKNTFNS_SUCCESS } from '../actions/WalletLoaderActions';
import { FETCHHEADERS_ATTEMPT, FETCHHEADERS_FAILED, FETCHHEADERS_PROGRESS, FETCHHEADERS_SUCCESS } from '../actions/WalletLoaderActions';
import { CREATEWALLET_EXISTINGSEED, CREATEWALLET_NEWSEED, CREATEWALLET_NEWSEED_CONFIRM, CREATEWALLET_NEWSEED_BACK } from '../actions/WalletLoaderActions';

export default function walletLoader(state = {}, action) {
  switch (action.type) {
  case LOADER_ATTEMPT:
    return {...state,
      getLoaderRequestAttempt: true,
      getLoaderRequest: action.request,
    };
  case LOADER_FAILED:
    return {...state,
      getLoaderError: action.error,
      getLoaderRequestAttempt: false,
      getLoaderRequest: null,
      loader: null,
    };
  case LOADER_SUCCESS:
    return {...state,
      getLoaderError: null,
      loader: action.loader,
      getLoaderRequestAttempt: false,
      stepIndex: 1,
    };
  case WALLETEXIST_ATTEMPT:
    return {...state,
      walletExistRequestAttempt: true,
      walletExistRequest: action.request,
    };
  case WALLETEXIST_FAILED:
    return {...state,
      walletExistError: action.error,
      walletExistRequestAttempt: false,
      walletExistsResponse: null,
    };
  case WALLETEXIST_SUCCESS:
    return {...state,
      walletExistError: null,
      walletExistRequestAttempt: false,
      walletExistResponse: action.response,
      walletExistRequest: null,
      stepIndex: 2,
    };
  case CREATEWALLET_NEWSEED_CONFIRM:
    return {...state,
      confirmNewSeed: true,
    };
  case  CREATEWALLET_NEWSEED_BACK:
    return {...state,
      confirmNewSeed: false,
    };
  case CREATEWALLET_EXISTINGSEED:
    return {...state,
      createWalletExisting: true,
    };
  case CREATEWALLET_NEWSEED:
    return {...state,
      createWalletExisting: false,
    };
  case CREATEWALLET_ATTEMPT:
    return {...state,
      walletCreateExisting: action.existing,
      walletCreateRequestAttempt: true,
      walletCreateRequest: action.request,
    };
  case CREATEWALLET_FAILED:
    return {...state,
      walletCreateError: action.error,
      walletCreateRequestAttempt: false,
      walletCreateRequest: null,
    };
  case CREATEWALLET_SUCCESS:
    return {...state,
      walletCreateError: null,
      walletCreateRequestAttempt: false,
      walletCreateRequest: null,
      walletCreateResponse: action.response,
      stepIndex: 3,
    };
  case OPENWALLET_ATTEMPT:
    return {...state,
      walletOpenRequestAttempt: true,
      walletOpenRequest: action.request,
    };
  case OPENWALLET_FAILED:
    return {...state,
      walletOpenError: action.error,
      walletOpenRequestAttempt: false,
      walletOpenRequest: null,
    };
  case OPENWALLET_SUCCESS:
    return {...state,
      walletOpenError: null,
      walletOpenRequestAttempt: false,
      walletOpenRequest: null,
      walletOpenResponse: action.response,
      stepIndex: 3,
    };
  case CLOSEWALLET_ATTEMPT:
    return {...state,
      walletCloseRequestAttempt: true,
      walletCloseRequest: action.request,
    };
  case CLOSEWALLET_FAILED:
    return {...state,
      walletCloseError: action.error,
      walletCloseRequestAttempt: false,
      walletCloseRequest: null,
    };
  case CLOSEWALLET_SUCCESS:
    return {...state,
      walletCloseError: null,
      walletCloseRequestAttempt: false,
      walletCloseRequest: null,
      walletCloseResponse: action.response,
    };
  case STARTRPC_ATTEMPT:
    return {...state,
      startRpcRequestAttempt: true,
      startRpcRequest: action.request,
    };
  case STARTRPC_FAILED:
    return {...state,
      startRpcError: action.error,
      startRpcRequestAttempt: false,
      startRpcRequest: null,
    };
  case STARTRPC_SUCCESS:
    return {...state,
      startRpcError: null,
      startRpcRequestAttempt: false,
      startRpcRequest: null,
      startRpcResponse: action.response,
      stepIndex: 4,
    };
  case DISCOVERADDRESS_ATTEMPT:
    return {...state,
      discoverAddressRequestAttempt: true,
      discoverAddressRequest: action.request,
    };
  case DISCOVERADDRESS_FAILED:
    return {...state,
      discoverAddressError: action.error,
      discoverAddressRequestAttempt: false,
      discoverAddressRequest: null
    };
  case DISCOVERADDRESS_SUCCESS:
    return {...state,
      discoverAddressError: null,
      discoverAddressRequestAttempt: false,
      discoverAddressRequest: null,
      discoverAddressResponse: action.response,
      stepIndex: 6,
    };
  case FETCHHEADERS_ATTEMPT:
    return {...state,
      fetchHeadersRequestAttempt: true,
      fetchHeadersRequest: action.request,
    };
  case FETCHHEADERS_FAILED:
    return {...state,
      fetchHeadersError: action.error,
      fetchHeadersRequestAttempt: false,
      fetchHeadersRequest: null,
    };
  case FETCHHEADERS_PROGRESS:
    return {...state,
      fetchHeadersResponse: action.response,
    };
  case FETCHHEADERS_SUCCESS:
    return {...state,
      fetchHeadersError: null,
      fetchHeadersRequestAttempt: false,
      fetchHeadersRequest: null,
      fetchHeadersResponse: action.response,
      stepIndex: 7,
    };
  case SUBSCRIBEBLOCKNTFNS_ATTEMPT:
    return {...state,
      subscribeBlockNtfnsRequestAttempt: true,
      subscribeBlockNtfnsRequest: action.request,
    };
  case SUBSCRIBEBLOCKNTFNS_FAILED:
    return {...state,
      subscribeBlockNtfnsError: action.error,
      subscribeBlockNtfnsRequestAttempt: false,
      subscribeBlockNtfnsRequest: null,
    };
  case SUBSCRIBEBLOCKNTFNS_SUCCESS:
    return {...state,
      subscribeBlockNtfnsError: null,
      subscribeBlockNtfnsRequestAttempt: false,
      subscribeBlockNtfnsRequest: null,
      subscribeBlockNtfnsResponse: action.response,
      stepIndex: 5,  // Onto final prep
    };

  default:
    return state;
  }
}
