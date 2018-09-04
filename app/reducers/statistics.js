
import {
  GETSTARTUPSTATS_SUCCESS,
  GETMYTICKETSSTATS_ATTEMPT, GETMYTICKETSSTATS_SUCCESS, GETMYTICKETSSTATS_FAILED
} from "actions/StatisticsActions";
import {
  CLOSEWALLET_SUCCESS,
} from "actions/WalletLoaderActions";

export default function statistics(state = {}, action) {
  switch (action.type) {
  case GETSTARTUPSTATS_SUCCESS:
    return {
      ...state,
      dailyBalances: action.dailyBalances
    };
  case GETMYTICKETSSTATS_ATTEMPT:
    return {
      ...state,
      getMyTicketsStatsRequest: true,
    };
  case GETMYTICKETSSTATS_SUCCESS:
    return {
      ...state,
      getMyTicketsStatsRequest: false,
      voteTime: action.voteTime,
      fullDailyBalances: action.dailyBalances.data,
    };
  case GETMYTICKETSSTATS_FAILED:
    return {
      ...state,
      getMyTicketsStatsRequest: false,
    };
  case CLOSEWALLET_SUCCESS:
    return {
      ...state,
      statistics: {
        dailyBalances: Array(),
        fullDailyBalances: Array(),
        voteTime: null,
        getMyTicketsStatsRequest: false,
      },
    };
  default:
    return state;
  }
}
