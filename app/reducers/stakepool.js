import {
    UPDATESTAKEPOOLCONFIG_ATTEMPT, UPDATESTAKEPOOLCONFIG_FAILED, UPDATESTAKEPOOLCONFIG_SUCCESS,
} from '../actions/StakePoolActions';

export default function stakepool(state = {}, action) {
  switch (action.type) {
  case UPDATESTAKEPOOLCONFIG_ATTEMPT:
    return {...state,
      currentStakePoolConfigRequest: true,
      currentStakePoolConfigError: null,
    };
  case UPDATESTAKEPOOLCONFIG_FAILED:
    return {...state,
      currentStakePoolConfigRequest: false,
      currentStakePoolConfigError: action.error,
    };
  case UPDATESTAKEPOOLCONFIG_SUCCESS:
    return {...state,
      currentStakePoolConfigRequest: false,
      currentStakePoolConfig: action.currentStakePoolConfig,
      activeStakePoolConfig: true,
    };
  default:
    return state;
  }
}