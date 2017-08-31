import {
  DAEMONRPCREADY,
  DAEMONRPCREADY_ERROR,
  DAEMONSYNCED,
  DAEMONREADY,
  WALLETREADY,
} from "../actions/DaemonActions";

export default function version(state = {}, action) {
  switch (action.type) {
  case DAEMONRPCREADY:
    return {...state,
      daemonReady: true,
      currentBlockCount: action.currentBlockCount,
    };
  case WALLETREADY:
    return {...state,
      walletReady: true,
    };
  case DAEMONRPCREADY_ERROR:
    return {...state,
      daemonReady: true,
    };
  default:
    return state;
  }
}
