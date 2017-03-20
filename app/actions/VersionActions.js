import { getVersionService } from '../middleware/grpc/client';
import { loaderRequest } from './WalletLoaderActions';
var messages = require('../middleware/walletrpc/api_pb');
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
  return (dispatch) => {
    dispatch({ type: GETVERSIONSERVICE_ATTEMPT });
    dispatch(getVersionServiceAction());
  };
}

function getVersionServiceAction() {
  return (dispatch, getState) => {
    const { address, port } = getState().grpc;
    getVersionService(address, port, function (versionService, err) {
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
export const VERSION_NOT_VALID = 'VERSION_NOT_VALID';

function getWalletRPCVersionError(error) {
  return { error, type: WALLETRPCVERSION_FAILED };
}

function getWalletRPCVersionSuccess(getWalletRPCVersionResponse) {
  return (dispatch, getState) => {
    dispatch({ getWalletRPCVersionResponse: getWalletRPCVersionResponse, type: WALLETRPCVERSION_SUCCESS });
    const { address, port } = getState().grpc;
    const { requiredVersion } = getState().version;
    var versionErr = '';

    if (!getWalletRPCVersionResponse.getVersionString()) {
      versionErr = 'Unable to obtain Dcrwallet API version';
    } else {
      if (!semverCompatible(requiredVersion, getWalletRPCVersionResponse.getVersionString())) {
        versionErr = 'API versions not compatible..  Decrediton requires '
          + requiredVersion + ' but wallet ' + getWalletRPCVersionResponse.getVersionString()
          + ' does not satisfy the requirement. Please check your'
          + ' installation, Decrediton and Dcrwallet versions should match.';
      }
    }

    if (versionErr) {
      dispatch({ error: versionErr, type: VERSION_NOT_VALID });
    } else {
      dispatch(loaderRequest(address, port));
    }
  };
}

export function getWalletRPCVersionAttempt() {
  var request = new messages.VersionRequest();
  return (dispatch) => {
    dispatch({
      request: request,
      type: WALLETRPCVERSION_ATTEMPT
    });
    dispatch(getWalletRPCVersionAction());
  };
}

function getWalletRPCVersionAction() {
  return (dispatch, getState) => {
    const { versionService, getWalletRPCVersionRequest } = getState().version;
    versionService.version(getWalletRPCVersionRequest,
      function (err, getWalletRPCVersionResponse) {
        if (err) {
          dispatch(getWalletRPCVersionError(err + ' please try again'));
        } else {
          dispatch(getWalletRPCVersionSuccess(getWalletRPCVersionResponse));
        }
      });
  };
}

function semverCompatible(req, act) {
  var required = req.split('.'), actual = act.split('.');

  var version = {
    MAJOR: 0,
    MINOR: 1,
    PATCH: 2,
  };

  if (required.length != 3 || actual.length != 3) {
    return false;
  }

  if (required[version.MAJOR] != actual[version.MAJOR]) {
    return false;
  }
  if (required[version.MINOR] > actual[version.MINOR]) {
    return false;
  }
  if (required[version.MINOR] == actual[version.MINOR]
    && required[version.PATCH] > actual[version.PATCH]) {
    return false;
  }

  return true;
}
