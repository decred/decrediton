
import {
  GETSTARTUPSTATS_ATTEMPT, GETSTARTUPSTATS_FAILED, GETSTARTUPSTATS_SUCCESS,
  GETMYTICKETSSTATS_ATTEMPT, GETMYTICKETSSTATS_SUCCESS, GETMYTICKETSSTATS_FAILED
} from "actions/StatisticsActions";
import {
  CLOSEWALLET_SUCCESS,
} from "actions/WalletLoaderActions";

export default function statistics(state = {}, action) {
  switch (action.type) {
  case GETSTARTUPSTATS_ATTEMPT:
    return {
      ...state,
      getStartupStatsAttempt: true,
    };
  case GETSTARTUPSTATS_FAILED:
    return {
      ...state,
      getStartupStatsAttempt: false,
    };
  case GETSTARTUPSTATS_SUCCESS:
    return {
      ...state,
      dailyBalances: action.dailyBalances,
      getStartupStatsAttempt: false,
      startupStatsCalcSeconds: action.startupStatsCalcSeconds,
      startupStatsEndCalcTime: action.startupStatsEndCalcTime,
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
      dailyBalances: Array(),
      fullDailyBalances: Array(),
      voteTime: null,
      getMyTicketsStatsRequest: false,
    };
  default:
    return state;
  }
}
