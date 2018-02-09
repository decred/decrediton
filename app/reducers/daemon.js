import {
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
  AVAILABLE_WALLETS
} from "../actions/DaemonActions";

export default function version(state = {}, action) {
  switch (action.type) {
  case DAEMONSTARTED:
    return {...state,
      daemonStarted: true,
      daemonAdvanced: false,
      daemonStopped: false,
      credentials: action.credentials,
    };
  case DAEMONSTARTED_REMOTE:
    return {...state,
      daemonStarted: true,
      daemonAdvanced: false,
      daemonStopped: false,
      credentials: action.credentials,
    };
  case DAEMONSTARTED_APPDATA:
    return {...state,
      daemonStarted: true,
      daemonAdvanced: false,
      daemonStopped: false,
      appData: action.appData,
      credentials: action.credentials,
    };
  case DAEMONSYNCING_START:
    return {...state,
      currentBlockCount: action.currentBlockCount,
      timeStart: action.timeStart,
      blockStart: action.blockStart,
    };
  case DAEMONSYNCING_PROGRESS:
    return {...state,
      currentBlockCount: action.currentBlockCount,
      timeLeftEstimate: action.timeLeftEstimate,
    };
  case DAEMONSYNCED:
    return {...state,
      daemonSynced: true,
    };
  case WALLETREADY:
    return {...state,
      selectCreateWalletInputRequest: false,
      walletReady: true,
      walletName: action.walletName,
      network: action.network,
      hiddenAccounts: action.hiddenAccounts,
    };
  case WALLETCREATED:
    return {...state,
      selectCreateWalletInputRequest: false,
    };
  case SHUTDOWN_REQUESTED:
    return {...state,
      shutdownRequested: true,
    };
  case DAEMONSTOPPED:
    return {...state,
      daemonStarted: false,
      daemonStopped: true,
    };
  case SET_CREDENTIALS_APPDATA_ERROR:
    return {...state,
      remoteAppdataError: true,
    };
  case AVAILABLE_WALLETS:
    return {...state,
      availableWallets: action.availableWallets
    };
  default:
    return state;
  }
}
