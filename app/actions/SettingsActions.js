// @flow
import { getWalletCfg, getGlobalCfg } from "../config";
import { isTestNet } from "selectors";
import { equalElements } from "helpers";
import * as wallet from "wallet";
import { closeWalletRequest } from "actions/WalletLoaderActions";
import { closeDaemonRequest, getAvailableWallets } from "actions/DaemonActions";
import { getTreasuryBalance, resetTreasuryBalance } from "actions/ClientActions";
import { EXTERNALREQUEST_DCRDATA } from "main_dev/externalRequests";

export const SETTINGS_SAVE = "SETTINGS_SAVE";
export const SETTINGS_CHANGED = "SETTINGS_CHANGED";
export const SETTINGS_UNCHANGED = "SETTINGS_UNCHANGED";

export const saveSettings = (settings) => (dispatch, getState) => {
  const { settings: { needNetworkReset } } = getState();
  const { daemon: { walletName } } = getState();

  const config = getGlobalCfg();
  const oldAllowedExternalRequests = config.get("allowed_external_requests");
  const updatedProxy =
    (config.get("proxy_type") !== settings.proxyType) ||
    (config.get("proxy_location") !== settings.proxyLocation);

  config.set("locale", settings.locale);
  config.set("daemon_start_advanced", settings.daemonStartAdvanced);
  config.set("allowed_external_requests", settings.allowedExternalRequests);
  config.set("proxy_type", settings.proxyType);
  config.set("proxy_location", settings.proxyLocation);
  config.set("timezone", settings.timezone);
  config.set("spv_mode", settings.spvMode);
  config.set("spv_connect", settings.spvConnect);
  config.set("network", settings.network);

  if (walletName) {
    const walletConfig = getWalletCfg(isTestNet(getState()), walletName);
    walletConfig.set("currency_display", settings.currencyDisplay);
    walletConfig.set("gaplimit", settings.gapLimit);
  }

  if (!equalElements(oldAllowedExternalRequests, settings.allowedExternalRequests)) {
    wallet.reloadAllowedExternalRequests();
  }

  const oldDcrdataEnabled = oldAllowedExternalRequests.indexOf(EXTERNALREQUEST_DCRDATA) > -1;
  const newDcrdataEnabled = settings.allowedExternalRequests.indexOf(EXTERNALREQUEST_DCRDATA) > -1;
  if (newDcrdataEnabled === true && oldDcrdataEnabled === false) {
    dispatch(getTreasuryBalance());
  }
  if (newDcrdataEnabled === false && oldDcrdataEnabled === true) {
    dispatch(resetTreasuryBalance());
  }

  dispatch({ settings, type: SETTINGS_SAVE });

  if (updatedProxy) {
    wallet.setupProxy();
  }

  if (needNetworkReset) {
    dispatch(closeWalletRequest());
    dispatch(closeDaemonRequest());
    dispatch(getAvailableWallets());
  }

};

export const ALLOWEDEXTERNALREQUESTS_ADDED = "ALLOWEDEXTERNALREQUESTS_ADDED";
export const addAllowedExternalRequest = (requestType) => (dispatch, getState) => {
  const config = getGlobalCfg();
  const allowed = config.get("allowed_external_requests");
  if (allowed.indexOf(requestType) > -1) return;

  allowed.push(requestType);
  config.set("allowed_external_requests", allowed);
  wallet.allowExternalRequest(requestType);

  const { settings: { currentSettings, tempSettings } } = getState();
  const newSettings = { ...currentSettings };
  newSettings.allowedExternalRequests = allowed;

  // Also modify temp settings, given that it may be different than the current
  // settings.
  const newTempSettings = { ...tempSettings };
  newTempSettings.allowedExternalRequests = [ ...newTempSettings.allowedExternalRequests ];
  if (newTempSettings.allowedExternalRequests.indexOf(requestType) === -1) {
    newTempSettings.allowedExternalRequests.push(requestType);
  }

  dispatch({ newSettings, newTempSettings, type: ALLOWEDEXTERNALREQUESTS_ADDED });
};

export function updateStateSettingsChanged(settings, norestart) {
  return (dispatch, getState) => {
    const { tempSettings, currentSettings } = getState().settings;
    const newSettings = { ...tempSettings, ...settings };
    const settingsFields = Object.keys(tempSettings);
    const networkChange = {
      network: true,
      spvMode: true,
      daemonStartAdvanced: true,
    };
    const newDiffersFromTemp = settingsFields
      .reduce((d, f) => (d || newSettings[f] !== tempSettings[f]), false);

    if (newDiffersFromTemp) {
      const newDiffersFromCurrent = settingsFields
        .reduce((d, f) => (d || newSettings[f] !== currentSettings[f]), false);
      const needNetworkReset =  !norestart && Object.keys(networkChange)
        .reduce((d, f) => (d || newSettings[f] !== currentSettings[f]), false);
      newDiffersFromCurrent
        ? dispatch({ tempSettings: newSettings, needNetworkReset, type: SETTINGS_CHANGED })
        : dispatch({ tempSettings: currentSettings, type: SETTINGS_UNCHANGED });
    }
  };
}

export const updateStateVoteSettingsChanged = (settings) => (dispatch, getState) => {
  const { settings: { tempSettings, currentSettings } } = getState();
  const { daemon: { walletName } } = getState();
  if (settings.enableTicketBuyer !== tempSettings.enableTicketBuyer) {
    const config = getWalletCfg(isTestNet(getState()), walletName);
    config.set("enableticketbuyer", settings.enableTicketBuyer);
    dispatch({ tempSettings: settings, type: SETTINGS_CHANGED });
  } else {
    dispatch({ tempSettings: currentSettings, type: SETTINGS_UNCHANGED });
  }
};

export const SETTINGS_TOGGLE_THEME = "SETTINGS_TOGGLE_THEME";
export const toggleTheme = () => (dispatch, getState) => {
  const { settings: { theme } } = getState();
  const config = getGlobalCfg();
  if (theme == "theme-light") {
    dispatch({ theme: "theme-dark", type: SETTINGS_TOGGLE_THEME });
    config.set("theme", "theme-dark");
  } else if (theme == "theme-dark") {
    dispatch({ theme: "theme-light", type: SETTINGS_TOGGLE_THEME });
    config.set("theme", "theme-light");
  }

};
