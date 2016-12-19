import { getVersionService, getWalletRPCVersion } from '../middleware/grpc/version';
import { loaderRequest } from './WalletLoaderActions';
import { hashHistory } from 'react-router';

export const GETVERSIONSERVICE_ATTEMPT = 'GETVERSIONSERVICE_ATTEMPT';
export const GETVERSIONSERVICE_FAILED = 'GETVERSIONSERVICE_FAILED';
export const GETVERSIONSERVICE_SUCCESS = 'GETVERSIONSERVICE_SUCCESS';

function getVersionServiceError(error) {
  return { error, type: GETVERSIONSERVICE_FAILED };
}

function getVersionServiceSuccess(versionService) {
  return (dispatch) => {
    dispatch({ versionService, type: GETVERSIONSERVICE_SUCCESS });
    dispatch(getWalletRPCVersionAttempt());
  };
}

export function getVersionServiceAttempt() {
  return (dispatch, getState) => {
    const { getLoaderRequest } = getState().walletLoader;
    dispatch({ type: GETVERSIONSERVICE_ATTEMPT });
    dispatch(getVersionServiceAction());
  };
}

function getVersionServiceAction() {
  return (dispatch, getState) => {
    const { address, port } = getState().grpc;
    getVersionService(address, port, function(versionService, err) {
      if (err) {
        dispatch(getVersionServiceError(err + ' Please try again'));
      } else {
        dispatch(getVersionServiceSuccess(versionService));
      }
    });
  };
}

export const WALLETRPCVERSION_ATTEMPT = 'WALLETRPCVERSION_ATTEMPT';
export const WALLETRPCVERSION_FAILED = 'WALLETRPCVERSION_FAILED';
export const WALLETRPCVERSION_SUCCESS = 'WALLETRPCVERSION_SUCCESS';
export const VERSION_NOT_VALID = "VERSION_NOT_VALID";

function getWalletRPCVersionError(error) {
  return { error, type: WALLETRPCVERSION_FAILED };
}

function getWalletRPCVersionSuccess(getWalletRPCVersionResponse) {
  return (dispatch, getState) => {
    dispatch( { getWalletRPCVersionResponse: getWalletRPCVersionResponse, type: WALLETRPCVERSION_SUCCESS });
    const { address, port } = getState().grpc;
    const { requiredVersion } = getState().version;
    if (requiredVersion != getWalletRPCVersionResponse.version_string) {
      var versionErr = "Version not valid got" + getWalletRPCVersionResponse.version_string + " expect " + requiredVersion
      dispatch( { error: versionErr, type: VERSION_NOT_VALID })
    } else {
      dispatch(loaderRequest(address,port));
    }
  }
}

export function getWalletRPCVersionAttempt(accountNumber, requiredConfs) {
  var request = {
    account_number: accountNumber,
    required_confirmations: requiredConfs
  };
  return (dispatch) => {
    dispatch({
      request: request,
      type: WALLETRPCVERSION_ATTEMPT });
    dispatch(getWalletRPCVersionAction());
  };
}

function getWalletRPCVersionAction() {
  return (dispatch, getState) => {
    const { versionService, getWalletRPCVersionRequest } = getState().version;
    getWalletRPCVersion(versionService, getWalletRPCVersionRequest,
        function(getWalletRPCVersionResponse, err) {
          if (err) {
            dispatch(getWalletRPCVersionError(err + ' please try again'));
          } else {
            dispatch(getWalletRPCVersionSuccess(getWalletRPCVersionResponse));
          }
        });
  };
}
