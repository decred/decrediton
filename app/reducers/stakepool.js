import {
  UPDATESTAKEPOOLCONFIG_ATTEMPT, UPDATESTAKEPOOLCONFIG_FAILED, UPDATESTAKEPOOLCONFIG_SUCCESS,
  DISCOVERAVAILABLESTAKEPOOLS_SUCCESS, CHANGESELECTEDSTAKEPOOL,
  REMOVESTAKEPOOLCONFIG,
  GETSTAKEPOOLSTATS_ATTEMPT, GETSTAKEPOOLSTATS_FAILED, GETSTAKEPOOLSTATS_SUCCESS,
  ADDCUSTOMSTAKEPOOL_ATTEMPT, ADDCUSTOMSTAKEPOOL_SUCCESS, ADDCUSTOMSTAKEPOOL_FAILED,
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
    return { ...state,
      currentStakePoolConfig: action.currentStakePoolConfig,
      updatedStakePoolList: true,
    };
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
  case GETSTAKEPOOLSTATS_ATTEMPT:
    return { ...state,
      getStakePoolInfoAttempt: true,
      getStakePoolInfoError: null,
    };
  case  GETSTAKEPOOLSTATS_FAILED:
    return { ...state,
      getStakePoolInfoAttempt: false,
      getStakePoolInfoError: action.error,
    };
  case GETSTAKEPOOLSTATS_SUCCESS:
    return { ...state,
      getStakePoolInfoAttempt: false,
      getStakePoolInfo: action.allStakePoolStats,
    };
  case ADDCUSTOMSTAKEPOOL_ATTEMPT:
    return { ...state,
      addCustomStakePoolAttempt: true
    };
  case ADDCUSTOMSTAKEPOOL_SUCCESS:
    return { ...state,
      addCustomStakePoolAttempt: false,
      currentStakePoolConfig: action.currentStakePoolConfig,
    };
  case ADDCUSTOMSTAKEPOOL_FAILED:
    return { ...state,
      addCustomStakePoolAttempt: false
    };
  default:
    return state;
  }
}
