import {
  DAEMONCONNECTED
} from "../actions/DaemonActions";

export default function version(state = {}, action) {
  switch (action.type) {
  case DAEMONCONNECTED:
    return {...state,
      daemonConnected: true,
    };
  default:
    return state;
  }
}
