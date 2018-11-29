import {
  CREATEWALLET_ATTEMPT, CREATEWALLET_FAILED, CREATEWALLET_SUCCESS,
  LOADER_ATTEMPT, LOADER_FAILED, LOADER_SUCCESS,
  WALLETEXIST_ATTEMPT, WALLETEXIST_FAILED, WALLETEXIST_SUCCESS,
  OPENWALLET_INPUT, OPENWALLET_FAILED_INPUT, OPENWALLET_ATTEMPT, OPENWALLET_FAILED, OPENWALLET_SUCCESS,
  CLOSEWALLET_ATTEMPT, CLOSEWALLET_FAILED, CLOSEWALLET_SUCCESS,
  STARTRPC_ATTEMPT, STARTRPC_FAILED, STARTRPC_SUCCESS, STARTRPC_RETRY,
  CREATEWALLET_EXISTINGSEED_INPUT, CREATEWALLET_NEWSEED_INPUT, CREATEWALLET_NEWSEED_CONFIRM_INPUT, CREATEWALLET_NEWSEED_BACK_INPUT,
  CREATEWALLET_GOBACK_EXISTING_OR_NEW, CREATEWALLET_GOBACK,
  UPDATEDISCOVERACCOUNTS, CREATEWATCHONLYWALLET_ATTEMPT,
  GETWALLETSEEDSVC_ATTEMPT, GETWALLETSEEDSVC_SUCCESS,
  RESCANPOINT_ATTEMPT, RESCANPOINT_FAILED, RESCANPOINT_SUCCESS,
  SYNC_SUCCESS, SYNC_UPDATE, SYNC_FAILED, SYNC_ATTEMPT, SYNC_INPUT,
  SYNC_SYNCED, SYNC_UNSYNCED, SYNC_FETCHED_HEADERS_STARTED, SYNC_FETCHED_HEADERS_PROGRESS, SYNC_FETCHED_HEADERS_FINISHED,
  SYNC_PEER_CONNECTED, SYNC_PEER_DISCONNECTED, SYNC_FETCHED_MISSING_CFILTERS_STARTED,
  SYNC_FETCHED_MISSING_CFILTERS_PROGRESS, SYNC_FETCHED_MISSING_CFILTERS_FINISHED,
  SYNC_DISCOVER_ADDRESSES_STARTED, SYNC_DISCOVER_ADDRESSES_FINISHED,
  SYNC_RESCAN_STARTED, SYNC_RESCAN_PROGRESS, SYNC_RESCAN_FINISHED, SYNC_CANCEL,
  GENERATESEED_ATTEMPT
} from "actions/WalletLoaderActions";
import {
  WALLETCREATED, CLOSEDAEMON_SUCCESS
} from "actions/DaemonActions";

import {
  GETSTARTUPWALLETINFO_ATTEMPT
} from "actions/ClientActions";
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
  case WALLETCREATED:
    return { ...state,
      createWalletExisting: action.createNewWallet,
      isWatchingOnly: action.isWatchingOnly,
    };
  case GENERATESEED_ATTEMPT:
    return { ...state,
      confirmNewSeed: false,
    };
  case CREATEWALLET_GOBACK:
    return { ...state,
      stepIndex: 1,
      existingOrNew: false,
      createNewWallet: false,
    };
  case CREATEWATCHONLYWALLET_ATTEMPT:
    return { ...state,
      stepIndex: 1,
    };
  case CREATEWALLET_GOBACK_EXISTING_OR_NEW:
    return { ...state,
      confirmNewSeed: false,
      existingOrNew: true,
      createNewWallet: false,
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
      createNewWallet: true,
      stepIndex: 2,
    };
  case CREATEWALLET_NEWSEED_INPUT:
    return { ...state,
      createWalletInputRequest: true,
      createWalletExisting: false,
      existingOrNew: false,
      createNewWallet: true,
      stepIndex: 2,
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
      confirmNewSeed: false,
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
      isWatchingOnly: action.isWatchingOnly,
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
      loader: null,
      stepIndex: 0,
      existingOrNew: false,
      createNewWallet: false,
      walletOpenResponse: null,
      advancedDaemonInputRequest: true,
      walletExistResponse: null,
      seedService: null,
      rescanPointResponse: null,
      syncInput: false,
      syncAttemptRequest: false,
      syncError: null,
      synced: false,
    };
  case CLOSEDAEMON_SUCCESS:
    return { ...state,
      neededBlocks: 0
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
  case GETSTARTUPWALLETINFO_ATTEMPT:
    return { ...state,
      stepIndex: 9
    };
  case UPDATEDISCOVERACCOUNTS:
    return { ...state,
      discoverAccountsComplete: action.complete,
    };
  case WALLET_LOADER_SETTINGS:
    return { ...state,
      discoverAccountsComplete: action.discoverAccountsComplete,
    };
  case GETWALLETSEEDSVC_ATTEMPT:
    return { ...state,
      seedService: null,
    };
  case GETWALLETSEEDSVC_SUCCESS:
    return { ...state,
      seedService: action.seedService
    };
  case RESCANPOINT_ATTEMPT:
    return { ...state,
      rescanPointAttemptRequest: true,
      rescanPointError: null,
      rescanPointResponse: null,
    };
  case RESCANPOINT_FAILED:
    return { ...state,
      rescanPointAttemptRequest: false,
      rescanPointError: action.error,
      rescanPointResponse: null,
    };
  case RESCANPOINT_SUCCESS:
    return { ...state,
      rescanPointAttemptRequest: false,
      rescanPointError: null,
      rescanPointResponse: action.response,
    };
  case SYNC_INPUT:
    return { ...state,
      syncInput: true,
    };
  case SYNC_ATTEMPT:
    return { ...state,
      syncInput: false,
      syncAttemptRequest: true,
      syncError: null,
      synced: false,
    };
  case SYNC_FAILED:
    return { ...state,
      syncInput: false,
      syncAttemptRequest: false,
      synced: false,
      syncCall: null,
    };
  case SYNC_UPDATE:
    return { ...state,
      syncError: null,
      syncCall: action.syncCall,
    };
  case SYNC_CANCEL:
    return { ...state,
      syncError: null,
      synced: false,
      syncCall: null,
    };
  case SYNC_SUCCESS:
    return { ...state,
      syncAttemptRequest: false,
      syncError: null,
      synced: false,
    };
  case SYNC_SYNCED:
    return { ...state,
      synced: true,
    };
  case SYNC_UNSYNCED:
    return { ...state,
      synced: false,
    };
  case SYNC_PEER_CONNECTED:
    return { ...state,
      peerCount: action.peerCount,
    };
  case SYNC_PEER_DISCONNECTED:
    return { ...state,
      peerCount: action.peerCount,
    };
  case SYNC_FETCHED_MISSING_CFILTERS_STARTED:
    return { ...state,
      syncFetchMissingCfiltersAttempt: true,
    };
  case SYNC_FETCHED_MISSING_CFILTERS_PROGRESS:
    return { ...state,
      syncFetchMissingCfiltersStart: action.cFiltersStart,
      syncFetchMissingCfiltersEnd: action.cFiltersEnd,
    };
  case SYNC_FETCHED_MISSING_CFILTERS_FINISHED:
    return { ...state,
      syncFetchMissingCfiltersAttempt: false,
    };
  case SYNC_FETCHED_HEADERS_STARTED:
    return { ...state,
      syncFetchTimeStart: action.fetchTimeStart,
      syncFetchHeadersAttempt: true,
    };
  case SYNC_FETCHED_HEADERS_PROGRESS:
    return { ...state,
      syncFetchHeadersCount: action.fetchHeadersCount,
      syncLastFetchedHeaderTime: action.lastFetchedHeaderTime,
    };
  case SYNC_FETCHED_HEADERS_FINISHED:
    return { ...state,
      syncFetchHeadersAttempt: false,
      syncFetchHeadersComplete: true,
    };
  case SYNC_DISCOVER_ADDRESSES_STARTED:
    return { ...state,
      syncDiscoverAddressesAttempt: true,
    };
  case SYNC_DISCOVER_ADDRESSES_FINISHED:
    return { ...state,
      syncDiscoverAddressesAttempt: false,
    };
  case SYNC_RESCAN_STARTED:
    return { ...state,
      syncRescanAttempt: true,
    };
  case SYNC_RESCAN_PROGRESS:
    return { ...state,
      syncRescanProgress: action.rescannedThrough,
    };
  case SYNC_RESCAN_FINISHED:
    return { ...state,
      syncRescanAttempt: false,
    };
  default:
    return state;
  }
}
