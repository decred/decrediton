import {
  DISCOVERAVAILABLEVSPS_ATTEMPT,
  DISCOVERAVAILABLEVSPS_SUCCESS,
  DISCOVERAVAILABLEVSPS_FAILED
} from "../actions/VSPActions";

export default function vsp(state = {}, action) {
  switch (action.type) {
    case DISCOVERAVAILABLEVSPS_SUCCESS:
      return {
        ...state,
        availableVSPs: action.availableVSPs,
      };
    default:
      return state;
  }
}
