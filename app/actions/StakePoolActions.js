import { stakePoolInfo, apiClientRequest } from '../middleware/stakepoolapi';
export const GETSTAKEPOOLINFO_ATTEMPT = 'GETSTAKEPOOLINFO_ATTEMPT';
export const GETSTAKEPOOLINFO_FAILED = 'GETSTAKEPOOLINFO_FAILED';
export const GETSTAKEPOOLINFO_SUCCESS = 'GETSTAKEPOOLINFO_SUCCESS';

function getStakePoolInfoError(error) {
  return { error, type: GETSTAKEPOOLINFO_FAILED };
}

function getStakePoolInfoSuccess(response) {
  return (dispatch, getState) => {
    const { network } = getState().grpc;
    var stakePoolNames = Object.keys(response.data);
    var usablePools = Array();
    // Only add matching network stakepool info
    for (var i = 0; i < stakePoolNames.length; i++) {
      if (response.data[stakePoolNames[i]].Network == network) {
        usablePools.push(response.data[stakePoolNames[i]]);
      }
    }
    apiClientRequest(
      "https://teststakepool.decred.org/api/v1/", 
      "getpurchaseinfo", 
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0ODc5NzM3ODQsImlzcyI6Imh0dHBzOi8vdGVzdHN0YWtlcG9vbC5kZWNyZWQub3JnIiwibG9nZ2VkSW5BcyI6MTR9.HdJuTqDJPbVWPPzetOfQ7jK7PgadPeXWZulqgzZN-4U",
      function(response, err) {
        if (err) {
          dispatch(console.log(err));
        } else {
          dispatch(console.log(response));
        }
      })
    dispatch({ data: usablePools, type: GETSTAKEPOOLINFO_SUCCESS });
  };
}

export function getStakePoolInfoAttempt() {
  return (dispatch, getState) => {
    dispatch({ type: GETSTAKEPOOLINFO_ATTEMPT });
    dispatch(getStakePoolInfoAction());
  };
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