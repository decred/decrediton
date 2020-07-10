import {
  UPDATESTAKEPOOLCONFIG_ATTEMPT,
  UPDATESTAKEPOOLCONFIG_FAILED,
  UPDATESTAKEPOOLCONFIG_SUCCESS,
  DISCOVERAVAILABLEVSPS_SUCCESS,
  CHANGESELECTEDSTAKEPOOL,
  REMOVESTAKEPOOLCONFIG,
  DISMISS_BACKUP_MSG_REDEEM_SCRIPT,
  GETSTAKEPOOLSTATS_ATTEMPT,
  GETSTAKEPOOLSTATS_FAILED,
  GETSTAKEPOOLSTATS_SUCCESS,
  ADDCUSTOMSTAKEPOOL_ATTEMPT,
  ADDCUSTOMSTAKEPOOL_SUCCESS,
  ADDCUSTOMSTAKEPOOL_FAILED
} from "../actions/VSPActions";
import { CLEARSTAKEPOOLCONFIG } from "../actions/WalletLoaderActions";
import { WALLET_STAKEPOOL_SETTINGS } from "actions/DaemonActions";

export default function stakepool(state = {}, action) {
  switch (action.type) {
    case UPDATESTAKEPOOLCONFIG_ATTEMPT:
      return {
        ...state,
        currentStakePoolConfigRequest: true
      };
    case UPDATESTAKEPOOLCONFIG_FAILED:
      return {
        ...state,
        currentStakePoolConfigRequest: false
      };
    case UPDATESTAKEPOOLCONFIG_SUCCESS:
      return {
        ...state,
        currentStakePoolConfigRequest: false,
        currentStakePoolConfig: action.currentStakePoolConfig,
        selectedStakePool: action.selectedStakePool
      };
    case CLEARSTAKEPOOLCONFIG:
      return {
        ...state,
        currentStakePoolConfig: action.currentStakePoolConfig
      };
    case DISCOVERAVAILABLEVSPS_SUCCESS:
      return {
        ...state,
        availableVSPs: action.availableVSPs,
      };
    case CHANGESELECTEDSTAKEPOOL:
      return { ...state, selectedStakePool: action.selectedStakePool };
    case REMOVESTAKEPOOLCONFIG:
      return {
        ...state,
        currentStakePoolConfig: action.currentStakePoolConfig,
        selectedStakePool: action.selectedStakePool,
      };
    case WALLET_STAKEPOOL_SETTINGS:
      return {
        ...state,
        selectedStakePool: action.selectedStakePool,
        currentStakePoolConfig: action.currentStakePoolConfig,
        dismissBackupRedeemScript: action.dismissBackupRedeemScript
      };
    case GETSTAKEPOOLSTATS_ATTEMPT:
      return {
        ...state,
        getStakePoolInfoAttempt: true,
        getStakePoolInfoError: null
      };
    case GETSTAKEPOOLSTATS_FAILED:
      return {
        ...state,
        getStakePoolInfoAttempt: false,
        getStakePoolInfoError: action.error
      };
    case GETSTAKEPOOLSTATS_SUCCESS:
      return {
        ...state,
        getStakePoolInfoAttempt: false,
        getStakePoolInfo: action.allStakePoolStats
      };
    case ADDCUSTOMSTAKEPOOL_ATTEMPT:
      return { ...state, addCustomStakePoolAttempt: true };
    case ADDCUSTOMSTAKEPOOL_SUCCESS:
      return {
        ...state,
        addCustomStakePoolAttempt: false,
        currentStakePoolConfig: action.currentStakePoolConfig
      };
    case ADDCUSTOMSTAKEPOOL_FAILED:
      return { ...state, addCustomStakePoolAttempt: false };
    case DISMISS_BACKUP_MSG_REDEEM_SCRIPT:
      return { ...state, dismissBackupRedeemScript: true };
    default:
      return state;
  }
}
