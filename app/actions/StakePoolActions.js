import { stakePoolInfo, getPurchaseInfo, setStakePoolAddress } from '../middleware/stakepoolapi';
export const GETSTAKEPOOLINFO_ATTEMPT = 'GETSTAKEPOOLINFO_ATTEMPT';
export const GETSTAKEPOOLINFO_FAILED = 'GETSTAKEPOOLINFO_FAILED';
export const GETSTAKEPOOLINFO_SUCCESS = 'GETSTAKEPOOLINFO_SUCCESS';

function getStakePoolInfoError(error) {
  return { error, type: GETSTAKEPOOLINFO_FAILED };
}

function getStakePoolInfoSuccess(response) {
  return (dispatch, getState) => {
    const { network } = getState().grpc;
    const { stakePoolConfig } = getState().stakepool;
    var stakePoolNames = Object.keys(response.data);
    var usablePools = Array();
    // Only add matching network stakepool info
    var foundStakePoolConfigs = stakePoolConfig;
    for (var i = 0; i < stakePoolNames.length; i++) {
      if (response.data[stakePoolNames[i]].Network == network) {
        if (foundStakePoolConfigs == null) {
          foundStakePoolConfigs = Array({
            Host:response.data[stakePoolNames[i]].URL,
            ApiKey:"",
            MultigsigVoteScript:"",
            VotingAccount:"",
          });
        } else {
          foundStakePoolConfigs.push({
            Host:response.data[stakePoolNames[i]].URL,
            ApiKey:"",
            MultigsigVoteScript:"",
            VotingAccount:"",
          });
        }
      }
    }
    dispatch({ stakePoolConfig: foundStakePoolConfigs, type: GETSTAKEPOOLINFO_SUCCESS });
  };
}

export const SETSTAKEPOOLAPIKEY = "SETSTAKEPOOLAPIKEY"
export function setStakePoolApiKey(poolHost, apikey) {
  return (dispatch, getState) => {
    const { stakePoolConfig } = getState().stakepool;
    var updatedStakePoolConfig = stakePoolConfig;
    for (var i = 0; i < updatedStakePoolConfig.length; i++) {
      if (poolHost == updatedStakePoolConfig[i].Host) {
        updatedStakePoolConfig[i].ApiKey = apikey
      }
    }
    dispatch({ updatedStakePoolConfig: updatedStakePoolConfig, type: SETSTAKEPOOLAPIKEY });
  };
}
export function getStakePoolInfoAttempt() {
  return (dispatch, getState) => {
    dispatch({ type: GETSTAKEPOOLINFO_ATTEMPT });
    dispatch(getStakePoolInfoAction());
  };
}
function setStakePoolAddressAttempt(poolConfig) {
  return (dispatch, getState) => {
    const { getNextAddress } = getState().control
    setStakePoolAddress(
      poolConfig.Host, 
      poolConfig.ApiKey,
      getNextAddress.GetPublicKey(),
      function(response, err) {
        if (err) {
          console.error(err);
        } else {
          console.log(response);
          dispatch(requestPurchaseInfo());
        }
    });
  }
}

function requestPurchaseInfo() {
  return (dispatch) => {
    getPurchaseInfo(
      "https://teststakepool.decred.org/api/v1/", 
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODc5NzM3ODQsImlzcyI6Imh0dHBzOi8vdGVzdHN0YWtlcG9vbC5kZWNyZWQub3JnIiwibG9nZ2VkSW5BcyI6MTR9.HdJuTqDJPbVWPPzetOfQ7jK7PgadPeXWZulqgzZN-4U",
      function(response, err) {
        if (err) {
          console.error(err);
        } else {
          console.log(response);
        }
      });
  }
}
function getStakePoolInfoAction() {
  return (dispatch) => {
    stakePoolInfo(function(response, err) {
      if (err) {
        dispatch(getStakePoolInfoError(err + ' Please try again'));
      } else {
        dispatch(getStakePoolInfoSuccess(response));
      }
    });
  };
}