import { DISCOVERAVAILABLEVSPS_SUCCESS } from "actions/VSPActions";
import {
  STARTTICKETBUYERV3_ATTEMPT,
  STARTTICKETBUYERV3_SUCCESS,
  STARTTICKETBUYERV3_FAILED,
  STOPTICKETBUYER_SUCCESS
} from "actions/ControlActions";

export default function vsp(state = {}, action) {
  switch (action.type) {
    case DISCOVERAVAILABLEVSPS_SUCCESS:
      return {
        ...state,
        availableVSPs: action.availableVSPs
      };
    case STARTTICKETBUYERV3_ATTEMPT:
      return { ...state,
        ticketAutoBuyerRunning: false
      };
    case STARTTICKETBUYERV3_SUCCESS:
      return { ...state,
        ticketAutoBuyerRunning: true,
        ticketBuyerCall: action.ticketBuyerCall
      };
    case STARTTICKETBUYERV3_FAILED:
      return { ...state,
        ticketAutoBuyerRunning: false
      };
    case STOPTICKETBUYER_SUCCESS:
      return { ...state,
        ticketAutoBuyerRunning: false
      };
    default:
      return state;
  }
}
