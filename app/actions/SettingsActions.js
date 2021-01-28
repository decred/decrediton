// @flow
import { getWalletCfg, getGlobalCfg } from "config";
import { isTestNet } from "selectors";
import { equalElements } from "helpers";
import * as wallet from "wallet";
import { closeWalletRequest } from "actions/WalletLoaderActions";
import { closeDaemonRequest, backToCredentials } from "actions/DaemonActions";
import {
  getTreasuryBalance,
  resetTreasuryBalance
} from "actions/ClientActions";
import {
  EXTERNALREQUEST_DCRDATA,
  EXTERNALREQUEST_POLITEIA
} from "main_dev/externalRequests";
import {
  getTokenAndInitialBatch,
  resetInventoryAndProposals
} from "actions/GovernanceActions";
import * as configConstants from "constants/config";

export const SETTINGS_SAVE = "SETTINGS_SAVE";
export const SETTINGS_CHANGED = "SETTINGS_CHANGED";
export const SETTINGS_UNCHANGED = "SETTINGS_UNCHANGED";

export const saveSettings = (settings) => async (dispatch, getState) => {
  const {
    settings: { needNetworkReset }
  } = getState();
  const {
    daemon: { walletName }
  } = getState();

  const config = getGlobalCfg();
  const oldAllowedExternalRequests = config.get(
    configConstants.ALLOWED_EXTERNAL_REQUESTS
  );
  const updatedProxy =
    config.get(configConstants.PROXY_TYPE) !== settings.proxyType ||
    config.get(configConstants.PROXY_LOCATION) !== settings.proxyLocation;

  config.set(configConstants.LOCALE, settings.locale);
  config.set(configConstants.DAEMON_ADVANCED, settings.daemonStartAdvanced);
  config.set(configConstants.PROXY_TYPE, settings.proxyType);
  config.set(
    configConstants.ALLOWED_EXTERNAL_REQUESTS,
    settings.allowedExternalRequests
  );
  config.set(configConstants.PROXY_LOCATION, settings.proxyLocation);
  config.set(configConstants.TIMEZONE, settings.timezone);
  config.set(configConstants.SPV_MODE, settings.spvMode);
  config.set(configConstants.SPV_CONNECT, settings.spvConnect);
  config.set(configConstants.NETWORK, settings.network);
  config.set(configConstants.THEME, settings.theme);
  config.set(configConstants.UI_ANIMATIONS, settings.uiAnimations);

  if (walletName) {
    const walletConfig = getWalletCfg(isTestNet(getState()), walletName);
    walletConfig.set(configConstants.CURRENCY_DISPLAY, settings.currencyDisplay);
    walletConfig.set(configConstants.GAP_LIMIT, settings.gapLimit);
  }

  if (
    !equalElements(oldAllowedExternalRequests, settings.allowedExternalRequests)
  ) {
    wallet.reloadAllowedExternalRequests();
  }

  const newDcrdataEnabled =
    settings.allowedExternalRequests.indexOf(EXTERNALREQUEST_DCRDATA) > -1;
  if (newDcrdataEnabled === true) {
    dispatch(getTreasuryBalance());
  }
  if (newDcrdataEnabled === false) {
    dispatch(resetTreasuryBalance());
  }

  dispatch({ settings, type: SETTINGS_SAVE });

  if (updatedProxy) {
    wallet.setupProxy();
  }

  if (needNetworkReset) {
    dispatch(closeWalletRequest());
    await dispatch(closeDaemonRequest());
    dispatch(backToCredentials());
  }

  // This should happen after dispatching `SETTINGS_SAVE` action
  const newPoliteiaEnabled =
    settings.allowedExternalRequests.indexOf(EXTERNALREQUEST_POLITEIA) > -1;
  if (newPoliteiaEnabled === true) {
    dispatch(getTokenAndInitialBatch());
  }
  if (newPoliteiaEnabled === false) {
    dispatch(resetInventoryAndProposals());
  }
};

export const ALLOWEDEXTERNALREQUESTS_ADDED = "ALLOWEDEXTERNALREQUESTS_ADDED";
export const addAllowedExternalRequest = (requestType) => (
  dispatch,
  getState
) =>
  new Promise((resolve, reject) => {
    const config = getGlobalCfg();
    const allowed = config.get(configConstants.ALLOWED_EXTERNAL_REQUESTS);

    if (allowed.indexOf(requestType) > -1) return reject(false);

    allowed.push(requestType);
    config.set(configConstants.ALLOWED_EXTERNAL_REQUESTS, allowed);
    wallet.allowExternalRequest(requestType);

    const {
      settings: { currentSettings, tempSettings }
    } = getState();
    const newSettings = { ...currentSettings };
    newSettings.allowedExternalRequests = allowed;

    // Also modify temp settings, given that it may be different than the current
    // settings.
    const newTempSettings = { ...tempSettings };
    newTempSettings.allowedExternalRequests = [
      ...newTempSettings.allowedExternalRequests
    ];
    if (newTempSettings.allowedExternalRequests.indexOf(requestType) === -1) {
      newTempSettings.allowedExternalRequests.push(requestType);
    }

    dispatch({
      newSettings,
      newTempSettings,
      type: ALLOWEDEXTERNALREQUESTS_ADDED,
      requestType
    });
    resolve(true);
  });

export function updateStateSettingsChanged(settings, norestart) {
  return (dispatch, getState) => {
    const { tempSettings, currentSettings } = getState().settings;
    const newSettings = { ...tempSettings, ...settings };
    const settingsFields = Object.keys(tempSettings);
    const networkChange = {
      network: true,
      spvMode: true,
      daemonStartAdvanced: true
    };

    const newDiffersFromTemp = settingsFields.reduce(
      (d, f) => d || newSettings[f] !== tempSettings[f],
      false
    );

    if (newDiffersFromTemp) {
      const newDiffersFromCurrent = settingsFields.reduce(
        (d, f) => d || newSettings[f] !== currentSettings[f],
        false
      );
      const needNetworkReset =
        !norestart &&
        Object.keys(networkChange).reduce(
          (d, f) => d || newSettings[f] !== currentSettings[f],
          false
        );
      newDiffersFromCurrent
        ? dispatch({
          tempSettings: newSettings,
          needNetworkReset,
          type: SETTINGS_CHANGED
        })
        : dispatch({ tempSettings: currentSettings, type: SETTINGS_UNCHANGED });
    }
  };
}

export const updateStateVoteSettingsChanged = (settings) => (
  dispatch,
  getState
) => {
  const {
    settings: { tempSettings, currentSettings }
  } = getState();
  const {
    daemon: { walletName }
  } = getState();
  if (settings.enableTicketBuyer !== tempSettings.enableTicketBuyer) {
    const config = getWalletCfg(isTestNet(getState()), walletName);
    config.set(configConstants.ENABLE_TICKET_BUYER, settings.enableTicketBuyer);
    dispatch({ tempSettings: settings, type: SETTINGS_CHANGED });
  } else {
    dispatch({ tempSettings: currentSettings, type: SETTINGS_UNCHANGED });
  }
};
