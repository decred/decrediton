import {
  UPDATESTAKEPOOLCONFIG_ATTEMPT, UPDATESTAKEPOOLCONFIG_FAILED, UPDATESTAKEPOOLCONFIG_SUCCESS,
  DISCOVERAVAILABLESTAKEPOOLS_SUCCESS, CHANGESELECTEDSTAKEPOOL,
  REMOVESTAKEPOOLCONFIG,
} from "../actions/StakePoolActions";
import { CLEARSTAKEPOOLCONFIG } from "../actions/WalletLoaderActions";
import { WALLET_STAKEPOOL_SETTINGS } from "actions/DaemonActions";

export default function stakepool(state = {}, action) {
  switch (action.type) {
  case UPDATESTAKEPOOLCONFIG_ATTEMPT:
    return { ...state,
      currentStakePoolConfigRequest: true,
      currentStakePoolConfigError: null,
    };
  case UPDATESTAKEPOOLCONFIG_FAILED:
    return { ...state,
      currentStakePoolConfigRequest: false,
      currentStakePoolConfigError: String(action.error),
    };
  case UPDATESTAKEPOOLCONFIG_SUCCESS:
    return { ...state,
      currentStakePoolConfigError: null,
      currentStakePoolConfigRequest: false,
      currentStakePoolConfig: action.currentStakePoolConfig,
      activeStakePoolConfig: true,
      selectedStakePool: action.selectedStakePool,
    };
  case CLEARSTAKEPOOLCONFIG:
    return { ...state,
      activeStakePoolConfig: false,
      currentStakePoolConfig: action.currentStakePoolConfig,
    };
  case DISCOVERAVAILABLESTAKEPOOLS_SUCCESS:
    return { ...state, currentStakePoolConfig: action.currentStakePoolConfig };
  case CHANGESELECTEDSTAKEPOOL:
    return { ...state,
      selectedStakePool: action.selectedStakePool
    };
  case REMOVESTAKEPOOLCONFIG:
    return { ...state,
      currentStakePoolConfig: action.currentStakePoolConfig,
      selectedStakePool: action.selectedStakePool,
      activeStakePoolConfig: !!action.selectedStakePool,
    };
  case WALLET_STAKEPOOL_SETTINGS:
    return { ...state,
      activeStakePoolConfig: action.activeStakePoolConfig,
      selectedStakePool: action.selectedStakePool,
      currentStakePoolConfig: action.currentStakePoolConfig,
    };
  default:
    return state;
  }
}
