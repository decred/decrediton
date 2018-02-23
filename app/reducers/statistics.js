
import {
  GETSTARTUPSTATS_SUCCESS
} from "actions/StatisticsActions";

export default function statistics(state = {}, action) {
  switch (action.type) {
  case GETSTARTUPSTATS_SUCCESS:
    return {
      ...state,
      dailyBalances: action.dailyBalances
    };
  default:
    return state;
  }
}
