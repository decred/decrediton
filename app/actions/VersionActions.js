import { getVersionService, getWalletRPCVersion } from '../middleware/grpc/version';
export const GETVERSIONSERVICE_ATTEMPT = 'GETVERSIONSERVICE_ATTEMPT';
export const GETVERSIONSERVICE_FAILED = 'GETVERSIONSERVICE_FAILED';
export const GETVERSIONSERVICE_SUCCESS = 'GETVERSIONSERVICE_SUCCESS';
import { hashHistory } from 'react-router';
function getVersionServiceError(error) {
  return { error, type: GETVERSIONSERVICE_FAILED };
}

function getVersionServiceSuccess(walletService) {
  return (dispatch) => {
    dispatch({ walletService, type: GETVERSIONSERVICE_SUCCESS });
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
    getVersionService(address, port, function(walletService, err) {
      if (err) {
        dispatch(getVersionServiceError(err + ' Please try again'));
      } else {
        dispatch(getVersionServiceSuccess(walletService));
      }
    });
  };
}

export const WALLETRPCVERSION_ATTEMPT = 'WALLETRPCVERSION_ATTEMPT';
export const WALLETRPCVERSION_FAILED = 'WALLETRPCVERSION_FAILED';
export const WALLETRPCVERSION_SUCCESS = 'WALLETRPCVERSION_SUCCESS';

function getWalletRPCVersionError(error) {
  return { error, type: WALLETRPCVERSION_FAILED };
}

function getWalletRPCVersionSuccess(getWalletRPCVersionResponse) {
  return { response: getWalletRPCVersionResponse, type: WALLETRPCVERSION_SUCCESS };
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
    const { walletService, getWalletRPCVersionRequest } = getState().grpc;
    getWalletRPCVersion(walletService, getWalletRPCVersionRequest,
        function(getWalletRPCVersionResponse, err) {
          if (err) {
            dispatch(getWalletRPCVersionError(err + ' please try again'));
          } else {
            dispatch(getWalletRPCVersionSuccess(getWalletRPCVersionResponse));
          }
        });
  };
}
