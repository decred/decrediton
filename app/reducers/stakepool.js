import {
    GETSTAKEPOOLINFO_ATTEMPT, GETSTAKEPOOLINFO_FAILED, GETSTAKEPOOLINFO_SUCCESS
} from '../actions/StakePoolActions';

export default function stakepool(state = {}, action) {
  switch (action.type) {
  case GETSTAKEPOOLINFO_ATTEMPT:
    return {...state,
      stakePoolInfoRequest: true,
      stakePoolInfoError: null,
    };
  case GETSTAKEPOOLINFO_FAILED:
    return {...state,
      stakePoolInfoRequest: false,
      stakePoolInfoError: action.error,
    };
  case GETSTAKEPOOLINFO_SUCCESS:
    return {...state,
      stakePoolInfoRequest: false,
      stakePoolInfoData: action.data,
    };
  default:
    return state;
  }
}