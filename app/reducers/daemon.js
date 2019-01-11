import {
  SELECT_LANGUAGE,
  FINISH_TUTORIAL,
  FINISH_PRIVACY,
  FINISH_SPVCHOICE,
  DAEMONSTARTED,
  DAEMONSTARTED_REMOTE,
  DAEMONSTARTED_APPDATA,
  DAEMONSYNCING_START,
  DAEMONSYNCING_PROGRESS,
  DAEMONSYNCED,
  DAEMONSTOPPED,
  WALLETREADY,
  WALLETCREATED,
  SHUTDOWN_REQUESTED,
  SET_CREDENTIALS_APPDATA_ERROR,
  AVAILABLE_WALLETS,
  DECREDITON_VERSION,
  FATAL_DAEMON_ERROR,
  FATAL_WALLET_ERROR,
  DAEMON_WARNING,
  WALLET_WARNING,
  CLOSEDAEMON_ATTEMPT, CLOSEDAEMON_FAILED, CLOSEDAEMON_SUCCESS, NOT_SAME_CONNECTION,
  NETWORK_MATCH
} from "../actions/DaemonActions";
import {
  CREATEWALLET_GOBACK,
  CLOSEWALLET_SUCCESS, CLOSEWALLET_FAILED,
} from "../actions/WalletLoaderActions";
import {
  UPDATEHIDDENACCOUNTS
} from "../actions/ClientActions";

export default function version(state = {}, action) {
  switch (action.type) {
  case NETWORK_MATCH:
    return { ... state,
      networkMatch: true,
    };
  case DECREDITON_VERSION:
    return { ...state,
      updateAvailable: action.msg,
    };
  case SELECT_LANGUAGE:
    return { ...state,
      locale: action.language,
      setLanguage: false,
    };
  case FINISH_TUTORIAL:
    return { ...state,
      tutorial: false,
    };
  case FINISH_SPVCHOICE:
    return { ...state,
      showSpvChoice: false,
    };
  case FINISH_PRIVACY:
    return { ...state,
      showPrivacy: false,
    };
  case DAEMONSTARTED:
    return { ...state,
      daemonStarted: true,
      daemonAdvanced: false,
      daemonStopped: false,
      credentials: action.credentials,
    };
  case DAEMONSTARTED_REMOTE:
    return { ...state,
      daemonStarted: true,
      daemonAdvanced: false,
      daemonStopped: false,
      credentials: action.credentials,
      daemonRemote: true,
    };
  case DAEMONSTARTED_APPDATA:
    return { ...state,
      daemonStarted: true,
      daemonAdvanced: false,
      daemonStopped: false,
      appData: action.appData,
      credentials: action.credentials,
    };
  case CLOSEDAEMON_ATTEMPT:
    return { ...state,
      daemonCloseRequestAttempt: true,
    };
  case CLOSEDAEMON_FAILED:
    return { ...state,
      daemonCloseError: String(action.error),
      daemonCloseRequestAttempt: false,
    };
  case CLOSEDAEMON_SUCCESS:
    return { ...state,
      daemonCloseError: null,
      daemonCloseRequestAttempt: false,
      daemonCloseResponse: action.response,
      daemonStarted: false,
      daemonAdvanced: action.advanced,
      daemonStopped: true,
      credentials: null,
      appData: null,
      daemonSynced: false,
      currentBlockCount: null,
      timeLeftEstimate: null,
      timeStart: null,
      blockStart: null,
    };
  case DAEMONSYNCING_START:
    return { ...state,
      currentBlockCount: action.currentBlockCount,
      timeStart: action.timeStart,
      blockStart: action.blockStart,
      neededBlocks: action.syncHeight,
      daemonWarning: null,
    };
  case DAEMONSYNCING_PROGRESS:
    return { ...state,
      currentBlockCount: action.currentBlockCount,
      timeLeftEstimate: action.timeLeftEstimate,
    };
  case DAEMONSYNCED:
    return { ...state,
      daemonSynced: true,
      daemonWarning: null,
    };
  case WALLETREADY:
    return { ...state,
      selectCreateWalletInputRequest: false,
      walletReady: true,
      walletName: action.walletName,
      hiddenAccounts: action.hiddenAccounts,
    };
  case CREATEWALLET_GOBACK:
    return { ...state,
      walletReady: false,
      walletName: "",
      selectCreateWalletInputRequest: true,
    };
  case WALLETCREATED:
    return { ...state,
      selectCreateWalletInputRequest: false,
    };
  case SHUTDOWN_REQUESTED:
    return { ...state,
      shutdownRequested: true,
    };
  case DAEMONSTOPPED:
    return { ...state,
      daemonStarted: false,
      daemonStopped: true,
    };
  case SET_CREDENTIALS_APPDATA_ERROR:
    return { ...state,
      remoteAppdataError: true,
    };
  case AVAILABLE_WALLETS:
    return { ...state,
      availableWallets: action.availableWallets,
      previousWallet: action.previousWallet,
      selectCreateWalletInputRequest: !action.previousWallet,
    };
  case UPDATEHIDDENACCOUNTS:
    return {
      ...state,
      hiddenAccounts: action.hiddenAccounts,
    };
  case FATAL_DAEMON_ERROR:
    return {
      ...state,
      daemonError: action.error,
    };
  case FATAL_WALLET_ERROR:
    return {
      ...state,
      walletError: action.error,
    };
  case DAEMON_WARNING:
    return {
      ...state,
      daemonWarning: action.warning,
    };
  case WALLET_WARNING:
    return {
      ...state,
      walletWarning: action.warning,
    };
  case CLOSEWALLET_SUCCESS:
    return {
      ...state,
      hiddenAccounts: [],
      walletReady: false,
      walletName: null,
      daemonWarning: null,
    };
  case CLOSEWALLET_FAILED:
    return {
      ...state,
      walletError: action.error,
    };
  case NOT_SAME_CONNECTION:
    return {
      ...state,
      daemonError: action.error,
    };
  default:
    return state;
  }
}
