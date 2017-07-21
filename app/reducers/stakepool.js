import {
    UPDATESTAKEPOOLCONFIG_ATTEMPT, UPDATESTAKEPOOLCONFIG_FAILED, UPDATESTAKEPOOLCONFIG_SUCCESS,
    UPDATESTAKEPOOLCONFIG_CLEAR_ERROR, UPDATESTAKEPOOLCONFIG_CLEAR_SUCCESS,
} from '../actions/StakePoolActions';

export default function stakepool(state = {}, action) {
  switch (action.type) {
  case UPDATESTAKEPOOLCONFIG_ATTEMPT:
    return {...state,
      currentStakePoolConfigRequest: true,
      currentStakePoolConfigError: null,
      currentStakePoolConfigSuccessMessage: '',
    };
  case UPDATESTAKEPOOLCONFIG_FAILED:
    return {...state,
      currentStakePoolConfigRequest: false,
      currentStakePoolConfigError: String(action.error),
    };
  case UPDATESTAKEPOOLCONFIG_SUCCESS:
    return {...state,
      currentStakePoolConfigError: null,
      currentStakePoolConfigRequest: false,
      currentStakePoolConfigSuccessMessage: action.successMessage,
      currentStakePoolConfig: action.currentStakePoolConfig,
      activeStakePoolConfig: true,
    };
  case UPDATESTAKEPOOLCONFIG_CLEAR_ERROR:
    return {...state,
      currentStakePoolConfigError: null,
    };
  case  UPDATESTAKEPOOLCONFIG_CLEAR_SUCCESS:
    return {...state,
      currentStakePoolConfigSuccessMessage: '',
    };
  default:
    return state;
  }
}