// @flow
import { loaderRequest } from "./WalletLoaderActions";
import { getVersionService, getVersionResponse } from "../wallet/version";
export const GETVERSIONSERVICE_ATTEMPT = "GETVERSIONSERVICE_ATTEMPT";
export const GETVERSIONSERVICE_FAILED = "GETVERSIONSERVICE_FAILED";
export const GETVERSIONSERVICE_SUCCESS = "GETVERSIONSERVICE_SUCCESS";

export const getVersionServiceAttempt = () => (dispatch, getState) => {
  dispatch({ type: GETVERSIONSERVICE_ATTEMPT });
  const { grpc: { address, port } } = getState();
  return getVersionService(address, port)
    .then(versionService => {
      dispatch({ versionService, type: GETVERSIONSERVICE_SUCCESS });
      dispatch(getWalletRPCVersionAttempt());
    })
    .catch(error => dispatch({ error, type: GETVERSIONSERVICE_FAILED }));
};

export const WALLETRPCVERSION_ATTEMPT = "WALLETRPCVERSION_ATTEMPT";
export const WALLETRPCVERSION_FAILED = "WALLETRPCVERSION_FAILED";
export const WALLETRPCVERSION_SUCCESS = "WALLETRPCVERSION_SUCCESS";
export const VERSION_NOT_VALID = "VERSION_NOT_VALID";

export const getWalletRPCVersionAttempt = () => (dispatch, getState) => {
  dispatch({ type: WALLETRPCVERSION_ATTEMPT });
  const { version: { versionService } }= getState();
  return getVersionResponse(versionService)
    .then(getWalletRPCVersionResponse => {
      dispatch({ getWalletRPCVersionResponse, type: WALLETRPCVERSION_SUCCESS });
      const { version: { requiredVersion }} = getState();
      let versionErr = null;
      if (!getWalletRPCVersionResponse.getVersionString()) {
        versionErr = "Unable to obtain Dcrwallet API version";
      } else {
        if (!semverCompatible(requiredVersion, getWalletRPCVersionResponse.getVersionString())) {
          versionErr = "API versions not compatible..  Decrediton requires "
            + requiredVersion + " but wallet " + getWalletRPCVersionResponse.getVersionString()
            + " does not satisfy the requirement. Please check your"
            + " installation, Decrediton and Dcrwallet versions should match.";
        }
      }
      if (versionErr) {
        dispatch({error: versionErr, type: VERSION_NOT_VALID});
      } else {
        const { address, port } = getState().grpc;
        dispatch(loaderRequest(address,port));
      }
    })
    .catch(error => dispatch({ error, type: WALLETRPCVERSION_FAILED }));
};

function semverCompatible(req, act) {
  var required = req.split("."), actual = act.split(".");

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
