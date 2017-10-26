import {
  DAEMONSTARTED,
  DAEMONSYNCING_START,
  DAEMONSYNCING_PROGRESS,
  DAEMONSYNCED,
  WALLETREADY,
  DAEMONSTARTED_ADVANCED,
  SAVE_START_ADVANCED_DAEMON_CREDENTIALS,
  SKIPPED_START_ADVANCED_LOGIN
} from "../actions/DaemonActions";

export default function version(state = {}, action) {
  switch (action.type) {
  case DAEMONSTARTED:
    return {...state,
      daemonStarted: true,
    };
  case DAEMONSTARTED_ADVANCED:
    return {...state,
      daemonAdvanced: true,
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
  case SAVE_START_ADVANCED_DAEMON_CREDENTIALS:
    return {...state,
      credentials: action.credentials,
      startType: action.startType
    };
  case SKIPPED_START_ADVANCED_LOGIN:
    return {...state,
      skippedAdvancedLoing: true,
    }
  default:
    return state;
  }
}
