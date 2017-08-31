import {
  DAEMONSTARTED,
  DAEMONSYNCING,
  DAEMONSYNCED,
  WALLETREADY,
} from "../actions/DaemonActions";

export default function version(state = {}, action) {
  switch (action.type) {
  case DAEMONSTARTED:
    return {...state,
      daemonStarted: true,
    };
  case DAEMONSYNCING:
    return {...state,
      daemonRpcReady: true,
      currentBlockCount: action.currentBlockCount,
    };
  case DAEMONSYNCED:
    return {...state,
      daemonSynced: true,
      currentBlockCount: action.currentBlockCount,
    };
  case WALLETREADY:
    return {...state,
      walletReady: true,
    };
  default:
    return state;
  }
}
