// @flow
import { getVersionService } from '../middleware/grpc/client';
import { loaderRequest } from './WalletLoaderActions';
var messages = require('../middleware/walletrpc/api_pb');
export const GETVERSIONSERVICE_ATTEMPT = 'GETVERSIONSERVICE_ATTEMPT';
export const GETVERSIONSERVICE_FAILED = 'GETVERSIONSERVICE_FAILED';
export const GETVERSIONSERVICE_SUCCESS = 'GETVERSIONSERVICE_SUCCESS';

export function getVersionServiceAttempt() {
  return (dispatch, getState) => {
    dispatch({ type: GETVERSIONSERVICE_ATTEMPT });
    const { address, port } = getState().grpc;
    getVersionService(address, port, function(versionService, error) {
      if (error) {
        dispatch({ error, type: GETVERSIONSERVICE_FAILED });
      } else {
        dispatch({ versionService, type: GETVERSIONSERVICE_SUCCESS });
        dispatch(getWalletRPCVersionAttempt());
      }
    });
  };
}

export const WALLETRPCVERSION_ATTEMPT = 'WALLETRPCVERSION_ATTEMPT';
export const WALLETRPCVERSION_FAILED = 'WALLETRPCVERSION_FAILED';
export const WALLETRPCVERSION_SUCCESS = 'WALLETRPCVERSION_SUCCESS';
export const VERSION_NOT_VALID = 'VERSION_NOT_VALID';

export function getWalletRPCVersionAttempt() {
  var request = new messages.VersionRequest();
  return (dispatch, getState) => {
    dispatch({ type: WALLETRPCVERSION_ATTEMPT });
    const { versionService } = getState().version;
    versionService.version(request,
        function(error, getWalletRPCVersionResponse) {
          if (error) {
            dispatch({ error, type: WALLETRPCVERSION_FAILED });
          } else {
            dispatch( { getWalletRPCVersionResponse: getWalletRPCVersionResponse, type: WALLETRPCVERSION_SUCCESS });
            const { requiredVersion } = getState().version;
            var versionErr = null;
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
              dispatch({error: versionErr, type: VERSION_NOT_VALID});
            } else {
              const { address, port } = getState().grpc;
              dispatch(loaderRequest(address,port));
            }
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
