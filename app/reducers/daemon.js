import {
  SELECT_LANGUAGE,
  FINISH_TUTORIAL,
  FINISH_PRIVACY,
  FINISH_SPVCHOICE,
  DAEMONSTART_SUCCESS,
  CONNECTDAEMON_ATTEMPT,
  CONNECTDAEMON_SUCCESS,
  CONNECTDAEMON_FAILURE,
  DAEMONSYNCING_START,
  DAEMONSYNCING_PROGRESS,
  DAEMONSYNCED,
  DAEMONSTOPPED,
  WALLETREADY,
  SHUTDOWN_REQUESTED,
  AVAILABLE_WALLETS,
  DECREDITON_VERSION,
  DAEMON_ERROR,
  DAEMON_WARNING,
  WALLET_WARNING,
  CLOSEDAEMON_ATTEMPT,
  CLOSEDAEMON_FAILED,
  CLOSEDAEMON_SUCCESS,
  CHECK_NETWORKMATCH_ATTEMPT,
  CHECK_NETWORKMATCH_SUCCESS,
  CHECK_NETWORKMATCH_FAILED
} from "../actions/DaemonActions";
import {
  CLOSEWALLET_SUCCESS,
  CLOSEWALLET_FAILED
} from "../actions/WalletLoaderActions";
import { UPDATEHIDDENACCOUNTS } from "../actions/ClientActions";

export default function version(state = {}, action) {
  switch (action.type) {
    case DECREDITON_VERSION:
      return { ...state, updateAvailable: action.msg };
    case SELECT_LANGUAGE:
      return { ...state, locale: action.language, setLanguage: false };
    case FINISH_TUTORIAL:
      return { ...state, tutorial: false };
    case FINISH_SPVCHOICE:
      return { ...state, showSpvChoice: false };
    case FINISH_PRIVACY:
      return { ...state, showPrivacy: false };
    case DAEMONSTART_SUCCESS:
      return {
        ...state,
        daemonStarted: true,
        daemonStopped: false,
        credentials: action.credentials,
        daemonRemote: action.daemonRemote,
        appdata: action.appdata,
        daemonError: null
      };
    case CONNECTDAEMON_ATTEMPT:
      return { ...state, daemonConnected: false, daemonError: null };
    case CONNECTDAEMON_SUCCESS:
      return { ...state, daemonConnected: true, daemonError: null };
    case CONNECTDAEMON_FAILURE:
      return {
        ...state,
        daemonConnected: false,
        daemonError: action.error,
        daemonTimeout: action.daemonTimeout
      };
    case CLOSEDAEMON_ATTEMPT:
      return { ...state, daemonCloseRequestAttempt: true };
    case CLOSEDAEMON_FAILED:
      return {
        ...state,
        daemonCloseError: String(action.error),
        daemonCloseRequestAttempt: false
      };
    case CLOSEDAEMON_SUCCESS:
      return {
        ...state,
        daemonCloseError: null,
        daemonCloseRequestAttempt: false,
        daemonCloseResponse: action.response,
        daemonStarted: false,
        daemonStopped: true,
        credentials: null,
        appdata: null,
        daemonSynced: false,
        currentBlockCount: null,
        timeLeftEstimate: null,
        timeStart: null,
        blockStart: null
      };
    case DAEMONSYNCING_START:
      return {
        ...state,
        daemonStarted: true,
        currentBlockCount: action.currentBlockCount,
        timeStart: action.timeStart,
        blockStart: action.blockStart,
        neededBlocks: action.syncHeight,
        daemonWarning: null
      };
    case DAEMONSYNCING_PROGRESS:
      return {
        ...state,
        currentBlockCount: action.currentBlockCount,
        timeLeftEstimate: action.timeLeftEstimate,
        neededBlocks: action.syncHeight
      };
    case DAEMONSYNCED:
      return {
        ...state,
        neededBlocks: action.syncHeight,
        currentBlockCount: action.blockCount,
        daemonSynced: true,
        daemonWarning: null
      };
    case WALLETREADY:
      return {
        ...state,
        selectCreateWalletInputRequest: false,
        walletReady: true,
        walletName: action.walletName,
        hiddenAccounts: action.hiddenAccounts
      };
    case SHUTDOWN_REQUESTED:
      return { ...state, shutdownRequested: true };
    case DAEMONSTOPPED:
      return { ...state, daemonStarted: false, daemonStopped: true };
    case AVAILABLE_WALLETS:
      return {
        ...state,
        availableWallets: action.availableWallets,
        previousWallet: action.previousWallet,
        selectCreateWalletInputRequest: !action.previousWallet
      };
    case UPDATEHIDDENACCOUNTS:
      return {
        ...state,
        hiddenAccounts: action.hiddenAccounts
      };
    case DAEMON_ERROR:
      return {
        ...state,
        daemonError: action.error
      };
    case DAEMON_WARNING:
      return {
        ...state,
        daemonWarning: action.warning
      };
    case WALLET_WARNING:
      return {
        ...state,
        walletWarning: action.warning
      };
    case CLOSEWALLET_SUCCESS:
      return {
        ...state,
        hiddenAccounts: [],
        walletReady: false,
        walletName: null,
        daemonWarning: null
      };
    case CLOSEWALLET_FAILED:
      return {
        ...state,
        walletError: action.error
      };
    case CHECK_NETWORKMATCH_ATTEMPT:
      return { ...state, daemonError: null, networkMatch: null };
    case CHECK_NETWORKMATCH_SUCCESS:
      return { ...state, networkMatch: true, daemonError: null };
    case CHECK_NETWORKMATCH_FAILED:
      return { ...state, daemonError: action.error };
    default:
      return state;
  }
}
