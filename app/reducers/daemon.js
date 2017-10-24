import {
  DAEMONSTARTED,
  DAEMONSTARTED_REMOTE,
  DAEMONSTARTED_APPDATA,
  DAEMONSYNCING_START,
  DAEMONSYNCING_PROGRESS,
  DAEMONSYNCED,
  DAEMONSTOPPED,
  WALLETREADY,
  SHUTDOWN_REQUESTED,
} from "../actions/DaemonActions";

export default function version(state = {}, action) {
  switch (action.type) {
  case DAEMONSTARTED:
    return {...state,
      daemonStarted: true,
      daemonAdvanced: false,
      daemonStopped: false,
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
      walletReady: true,
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
  default:
    return state;
  }
}
