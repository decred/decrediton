// @flow
import { loaderRequest, getWalletSeedService } from "./WalletLoaderActions";
import { getVersionService, getVersionResponse } from "wallet";
import { push as pushHistory } from "connected-react-router";
import { ipcRenderer } from "electron";
import { isTestNet } from "selectors";

export const GETVERSIONSERVICE_ATTEMPT = "GETVERSIONSERVICE_ATTEMPT";
export const GETVERSIONSERVICE_FAILED = "GETVERSIONSERVICE_FAILED";
export const GETVERSIONSERVICE_SUCCESS = "GETVERSIONSERVICE_SUCCESS";

export const getVersionServiceAttempt = () => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    const getVersion = async () => {
      dispatch({ type: GETVERSIONSERVICE_ATTEMPT });
      const {
        grpc: { address, port }
      } = getState();
      const {
        daemon: { walletName }
      } = getState();
      try {
        const versionService = await getVersionService(
          isTestNet(getState()),
          walletName,
          address,
          port
        );
        dispatch({ versionService, type: GETVERSIONSERVICE_SUCCESS });
        await dispatch(getWalletRPCVersionAttempt(versionService));
        return true;
      } catch (error) {
        dispatch({ error, type: GETVERSIONSERVICE_FAILED });
        reject(error);
      }
    };

    getVersion()
      .then((r) => resolve(r))
      .catch((error) => reject(error));
  });

export const WALLETRPCVERSION_ATTEMPT = "WALLETRPCVERSION_ATTEMPT";
export const WALLETRPCVERSION_FAILED = "WALLETRPCVERSION_FAILED";
export const WALLETRPCVERSION_SUCCESS = "WALLETRPCVERSION_SUCCESS";
export const VERSION_NOT_VALID = "VERSION_NOT_VALID";

export const getWalletRPCVersionAttempt = (versionService) => (
  dispatch,
  getState
) =>
  new Promise((resolve, reject) => {
    const getVersion = async () => {
      dispatch({ type: WALLETRPCVERSION_ATTEMPT });

      try {
        const getWalletRPCVersionResponse = await getVersionResponse(
          versionService
        );
        dispatch({
          getWalletRPCVersionResponse,
          type: WALLETRPCVERSION_SUCCESS
        });
        const {
          version: { requiredVersion }
        } = getState();
        let versionErr = null;
        const walletVersion = getWalletRPCVersionResponse.getVersionString();
        ipcRenderer.send("grpc-versions-determined", {
          requiredVersion,
          walletVersion
        });
        if (!walletVersion) {
          versionErr = "Unable to obtain Dcrwallet API version";
        } else if (!semverCompatible(requiredVersion, walletVersion)) {
          versionErr =
            "API versions not compatible..  Decrediton requires " +
            requiredVersion +
            " but wallet " +
            walletVersion +
            " does not satisfy the requirement. Please check your" +
            " installation, Decrediton and Dcrwallet versions should match.";
        }
        if (versionErr) {
          dispatch({ error: versionErr, type: VERSION_NOT_VALID });
          dispatch(pushHistory("/invalidRPCVersion"));
          return reject(versionErr);
        }
        const { address, port } = getState().grpc;
        await dispatch(loaderRequest(address, port));
        await dispatch(getWalletSeedService(address, port));
      } catch (error) {
        dispatch({ error, type: WALLETRPCVERSION_FAILED });
        reject(error);
      }
    };

    getVersion()
      .then((r) => resolve(r))
      .catch((error) => reject(error));
  });

export function semverCompatible(req, act) {
  const required = req.split("."),
    actual = act.split(".");

  const version = {
    MAJOR: 0,
    MINOR: 1,
    PATCH: 2
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
  if (
    required[version.MINOR] == actual[version.MINOR] &&
    required[version.PATCH] > actual[version.PATCH]
  ) {
    return false;
  }
  return true;
}
