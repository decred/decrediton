import {
  DAEMONSTARTED,
  DAEMONSTARTED_REMOTE,
  DAEMONSTARTED_APPDATA,
  DAEMONSYNCING_START,
  DAEMONSYNCING_PROGRESS,
  DAEMONSYNCED,
  WALLETREADY,
} from "../actions/DaemonActions";

export default function version(state = {}, action) {
  switch (action.type) {
  case DAEMONSTARTED:
    return {...state,
      daemonStarted: true,
      daemonAdvanced: false,
    };
  case DAEMONSTARTED_REMOTE:
    return {...state,
      daemonStarted: true,
      daemonAdvanced: false,
      credentials: action.credentials,
    };
  case DAEMONSTARTED_APPDATA:
    return {...state,
      daemonStarted: true,
      daemonAdvanced: false,
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
  default:
    return state;
  }
}
