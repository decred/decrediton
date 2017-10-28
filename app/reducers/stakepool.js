import {
    UPDATESTAKEPOOLCONFIG_ATTEMPT, UPDATESTAKEPOOLCONFIG_FAILED, UPDATESTAKEPOOLCONFIG_SUCCESS,
    DISCOVERAVAILABLESTAKEPOOLS_SUCCESS
} from "../actions/StakePoolActions";
import { CLEARSTAKEPOOLCONFIG } from "../actions/WalletLoaderActions";

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
      currentStakePoolConfigError: String(action.error),
    };
  case UPDATESTAKEPOOLCONFIG_SUCCESS:
    return {...state,
      currentStakePoolConfigError: null,
      currentStakePoolConfigRequest: false,
      currentStakePoolConfig: action.currentStakePoolConfig,
      activeStakePoolConfig: true,
    };
  case CLEARSTAKEPOOLCONFIG:
    return {...state,
      activeStakePoolConfig: false,
      currentStakePoolConfig: action.currentStakePoolConfig,
    };
  case DISCOVERAVAILABLESTAKEPOOLS_SUCCESS:
    return {...state, currentStakePoolConfig: action.currentStakePoolConfig };
  default:
    return state;
  }
}
