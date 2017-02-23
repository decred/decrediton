import { getVersionService } from '../middleware/grpc/client';
import { stakePoolInfo } from '../middleware/stakepoolapi';
export const GETSTAKEPOOLINFO_ATTEMPT = 'GETSTAKEPOOLINFO_ATTEMPT';
export const GETSTAKEPOOLINFO_FAILED = 'GETSTAKEPOOLINFO_FAILED';
export const GETSTAKEPOOLINFO_SUCCESS = 'GETSTAKEPOOLINFO_SUCCESS';

function getStakePoolInfoError(error) {
  return { error, type: GETSTAKEPOOLINFO_FAILED };
}

function getStakePoolInfoSuccess(versionService) {
  return (dispatch) => {
    dispatch({ versionService, type: GETSTAKEPOOLINFO_SUCCESS });
  };
}

export function getStakePoolInfoAttempt() {
  return (dispatch) => {
    dispatch({ type: GETSTAKEPOOLINFO_ATTEMPT });
    dispatch((getStakePoolInfoAction));
  };
}

function getStakePoolInfoAction() {
  return (dispatch, getState) => {
    const { address, port } = getState().grpc;
    stakePoolInfo(function(response, err) {
      if (err) {
        dispatch(getVersionServiceError(err + ' Please try again'));
      } else {
        dispatch(getVersionServiceSuccess(versionService));
      }
    });
  };
}