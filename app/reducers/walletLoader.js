import {
  CREATEWALLET_ATTEMPT, CREATEWALLET_FAILED, CREATEWALLET_SUCCESS,
  LOADER_ATTEMPT, LOADER_FAILED, LOADER_SUCCESS,
  WALLETEXIST_ATTEMPT, WALLETEXIST_FAILED, WALLETEXIST_SUCCESS,
  OPENWALLET_INPUT, OPENWALLET_FAILED_INPUT, OPENWALLET_ATTEMPT, OPENWALLET_FAILED, OPENWALLET_SUCCESS,
  CLOSEWALLET_ATTEMPT, CLOSEWALLET_FAILED, CLOSEWALLET_SUCCESS,
  STARTRPC_ATTEMPT, STARTRPC_FAILED, STARTRPC_SUCCESS, STARTRPC_RETRY,
  DISCOVERADDRESS_INPUT, DISCOVERADDRESS_FAILED_INPUT, DISCOVERADDRESS_ATTEMPT, DISCOVERADDRESS_FAILED, DISCOVERADDRESS_SUCCESS,
  SUBSCRIBEBLOCKNTFNS_ATTEMPT, SUBSCRIBEBLOCKNTFNS_FAILED, SUBSCRIBEBLOCKNTFNS_SUCCESS,
  FETCHHEADERS_ATTEMPT, FETCHHEADERS_FAILED, FETCHHEADERS_PROGRESS, FETCHHEADERS_SUCCESS,
  CREATEWALLET_EXISTINGSEED_INPUT, CREATEWALLET_NEWSEED_INPUT, CREATEWALLET_NEWSEED_CONFIRM_INPUT, CREATEWALLET_NEWSEED_BACK_INPUT,
  CREATEWALLET_GOBACK_EXISITNG_OR_NEW,
  UPDATEDISCOVERACCOUNTS, NEEDED_BLOCKS_DETERMINED
} from "actions/WalletLoaderActions";
import {
  GETSTARTUPWALLETINFO_ATTEMPT
} from "actions/ClientActions";
import {
  RESCAN_ATTEMPT
} from "actions/ControlActions";
import { WALLET_LOADER_SETTINGS } from "actions/DaemonActions";

export default function walletLoader(state = {}, action) {
  switch (action.type) {
  case LOADER_ATTEMPT:
    return { ...state,
      getLoaderRequestAttempt: true,
    };
  case LOADER_FAILED:
    return { ...state,
      getLoaderError: String(action.error),
      getLoaderRequestAttempt: false,
      loader: null,
    };
  case LOADER_SUCCESS:
    return { ...state,
      getLoaderError: null,
      loader: action.loader,
      getLoaderRequestAttempt: false,
      stepIndex: 1,
    };
  case WALLETEXIST_ATTEMPT:
    return { ...state,
      walletExistRequestAttempt: true,
    };
  case WALLETEXIST_FAILED:
    return { ...state,
      walletExistError: String(action.error),
      walletExistRequestAttempt: false,
      walletExistResponse: null,
    };
  case WALLETEXIST_SUCCESS:
    return { ...state,
      walletExistError: null,
      walletExistRequestAttempt: false,
      walletExistResponse: action.response,
      stepIndex: 2,
    };
  case CREATEWALLET_GOBACK_EXISITNG_OR_NEW:
    return { ...state,
      confirmNewSeed: false,
      existingOrNew: true,
    };
  case CREATEWALLET_NEWSEED_CONFIRM_INPUT:
    return { ...state,
      createWalletInputRequest: true,
      createWalletExisting: false,
      confirmNewSeed: true,
    };
  case  CREATEWALLET_NEWSEED_BACK_INPUT:
    return { ...state,
      createWalletInputRequest: true,
      confirmNewSeed: false,
    };
  case CREATEWALLET_EXISTINGSEED_INPUT:
    return { ...state,
      createWalletInputRequest: true,
      createWalletExisting: true,
      existingOrNew: false,
    };
  case CREATEWALLET_NEWSEED_INPUT:
    return { ...state,
      createWalletInputRequest: true,
      createWalletExisting: false,
      existingOrNew: false,
    };
  case CREATEWALLET_ATTEMPT:
    return { ...state,
      createWalletInputRequest: false,
      walletCreateExisting: action.existing,
      walletCreateRequestAttempt: true,
    };
  case CREATEWALLET_FAILED:
    return { ...state,
      walletCreateError: String(action.error),
      walletCreateRequestAttempt: false,
    };
  case CREATEWALLET_SUCCESS:
    return { ...state,
      walletCreateError: null,
      walletCreateRequestAttempt: false,
      walletCreateResponse: action.response,
      advancedDaemonInputRequest: true,
      stepIndex: 3,
    };
  case OPENWALLET_INPUT:
    return { ...state,
      openWalletInputRequest: true,
      walletOpenRequestAttempt: false,
    };
  case OPENWALLET_FAILED_INPUT:
    return { ...state,
      walletOpenError: String(action.error),
      openWalletInputRequest: true,
      walletOpenRequestAttempt: false,
    };
  case OPENWALLET_ATTEMPT:
    return { ...state,
      walletOpenError: false,
      openWalletInputRequest: false,
      walletOpenRequestAttempt: true,
    };
  case OPENWALLET_FAILED:
    return { ...state,
      walletOpenError: String(action.error),
      walletOpenRequestAttempt: false,
    };
  case OPENWALLET_SUCCESS:
    return { ...state,
      walletOpenError: null,
      walletOpenRequestAttempt: false,
      walletOpenResponse: action.response,
      advancedDaemonInputRequest: true,
      stepIndex: 3,
    };
  case CLOSEWALLET_ATTEMPT:
    return { ...state,
      walletCloseRequestAttempt: true,
    };
  case CLOSEWALLET_FAILED:
    return { ...state,
      walletCloseError: String(action.error),
      walletCloseRequestAttempt: false,
    };
  case CLOSEWALLET_SUCCESS:
    return { ...state,
      walletCloseError: null,
      walletCloseRequestAttempt: false,
      walletCloseResponse: action.response,
    };
  case STARTRPC_ATTEMPT:
    return { ...state,
      startRpcError: null,
      startRpcRequestAttempt: true,
    };
  case STARTRPC_RETRY:
    return { ...state,
      rpcRetryAttempts: action.rpcRetryAttempts,
    };
  case STARTRPC_FAILED:
    return { ...state,
      startRpcError: String(action.error),
      startRpcRequestAttempt: false,
      rpcRetryAttempts: 0,
    };
  case STARTRPC_SUCCESS:
    return { ...state,
      startRpcError: null,
      startRpcRequestAttempt: false,
      startRpcResponse: true,
      stepIndex: 4,
    };
  case DISCOVERADDRESS_INPUT:
    return { ...state,
      discoverAddressInputRequest: true,
    };
  case DISCOVERADDRESS_FAILED_INPUT:
    return { ...state,
      discoverAddressInputRequest: true,
      discoverAddressError: String(action.error),
    };
  case DISCOVERADDRESS_ATTEMPT:
    return { ...state,
      discoverAddressInputRequest: false,
      discoverAddressError: null,
      discoverAddressRequestAttempt: true,
    };
  case DISCOVERADDRESS_FAILED:
    return { ...state,
      discoverAddressError: String(action.error),
      discoverAddressRequestAttempt: false,
    };
  case DISCOVERADDRESS_SUCCESS:
    return { ...state,
      discoverAddressError: null,
      discoverAddressRequestAttempt: false,
      discoverAddressResponse: true,
      stepIndex: 6,
    };
  case FETCHHEADERS_ATTEMPT:
    return { ...state,
      fetchHeadersRequestAttempt: true,
    };
  case FETCHHEADERS_FAILED:
    return { ...state,
      fetchHeadersError: String(action.error),
      fetchHeadersRequestAttempt: false,
    };
  case FETCHHEADERS_PROGRESS:
    return { ...state,
      fetchHeadersResponse: action.response,
    };
  case FETCHHEADERS_SUCCESS:
    return { ...state,
      fetchHeadersError: null,
      fetchHeadersRequestAttempt: false,
      fetchHeadersResponse: action.response,
    };
  case RESCAN_ATTEMPT:
    return { ...state,
      stepIndex: 7
    };
  case GETSTARTUPWALLETINFO_ATTEMPT:
    return { ...state,
      stepIndex: 8
    };
  case SUBSCRIBEBLOCKNTFNS_ATTEMPT:
    return { ...state,
      subscribeBlockNtfnsRequestAttempt: true,
    };
  case SUBSCRIBEBLOCKNTFNS_FAILED:
    return { ...state,
      subscribeBlockNtfnsError: String(action.error),
      subscribeBlockNtfnsRequestAttempt: false,
    };
  case SUBSCRIBEBLOCKNTFNS_SUCCESS:
    return { ...state,
      subscribeBlockNtfnsError: null,
      subscribeBlockNtfnsRequestAttempt: false,
      subscribeBlockNtfnsRequest: null,
      subscribeBlockNtfnsResponse: action.response,
      stepIndex: 5,  // Onto final prep
    };
  case UPDATEDISCOVERACCOUNTS:
    return { ...state,
      discoverAccountsComplete: action.complete,
    };
  case NEEDED_BLOCKS_DETERMINED:
    return { ...state,
      neededBlocks: action.neededBlocks
    };
  case WALLET_LOADER_SETTINGS:
    return { ...state,
      discoverAccountsComplete: action.discoverAccountsComplete,
    };
  default:
    return state;
  }
}
