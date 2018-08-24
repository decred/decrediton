// @flow
import { getWalletCfg, getGlobalCfg } from "../config";
import { isTestNet } from "selectors";
import { equalElements } from "helpers";
import * as wallet from "wallet";

export const SETTINGS_SAVE = "SETTINGS_SAVE";
export const SETTINGS_CHANGED = "SETTINGS_CHANGED";
export const SETTINGS_UNCHANGED = "SETTINGS_UNCHANGED";

export const saveSettings = (settings) => (dispatch, getState) => {
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

  const walletConfig = getWalletCfg(isTestNet(getState()), walletName);
  walletConfig.set("currency_display", settings.currencyDisplay);
  walletConfig.set("gaplimit", settings.gapLimit);

  if (!equalElements(oldAllowedExternalRequests, settings.allowedExternalRequests)) {
    wallet.reloadAllowedExternalRequests();
  }

  dispatch({ settings, type: SETTINGS_SAVE });

  if (updatedProxy) {
    wallet.setupProxy();
  }
};

export function updateStateSettingsChanged(settings) {
  return (dispatch, getState) => {
    const { tempSettings, currentSettings } = getState().settings;
    const newSettings = { ...tempSettings, ...settings };
    const settingsFields = Object.keys(tempSettings);
    const newDiffersFromTemp = settingsFields
      .reduce((d, f) => (d || newSettings[f] !== tempSettings[f]), false);

    if (newDiffersFromTemp) {
      const newDiffersFromCurrent = settingsFields
        .reduce((d, f) => (d || newSettings[f] !== currentSettings[f]), false);
      newDiffersFromCurrent
        ? dispatch({ tempSettings: newSettings, type: SETTINGS_CHANGED })
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
