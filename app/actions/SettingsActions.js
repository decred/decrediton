// @flow
import { getWalletCfg, getGlobalCfg } from "../config.js";
export const SETTINGS_SAVE = "SETTINGS_SAVE";
export const SETTINGS_CHANGED = "SETTINGS_CHANGED";
export const SETTINGS_UNCHANGED = "SETTINGS_UNCHANGED";

export const saveSettings = (settings) => {
  const config = getGlobalCfg();
  config.set("currency_display", settings.currencyDisplay);
  config.set("network", settings.network);
  config.set("locale", settings.locale);
  config.set("daemon_start_advanced", settings.daemonStartAdvanced);
  return {
    settings,
    type: SETTINGS_SAVE
  };
};

export function updateStateSettingsChanged(settings) {
  return (dispatch, getState) => {
    const { tempSettings, currentSettings } = getState().settings;
    const newSettings = {...tempSettings, ...settings};
    const settingsFields = Object.keys(tempSettings);
    const newDiffersFromTemp = settingsFields
      .reduce((d, f) => (d || newSettings[f] !== tempSettings[f]), false);

    if (newDiffersFromTemp) {
      const newDiffersFromCurrent = settingsFields
        .reduce((d, f) => (d || newSettings[f] !== currentSettings[f]), false);
      newDiffersFromCurrent
        ? dispatch({ tempSettings: newSettings, type: SETTINGS_CHANGED})
        : dispatch({ tempSettings: currentSettings, type: SETTINGS_UNCHANGED});
    }
  };
}

export const updateStateVoteSettingsChanged = (settings) => (dispatch, getState) => {
  const { settings: { tempSettings, currentSettings }} = getState();
  if (settings.enableTicketBuyer !== tempSettings.enableTicketBuyer) {
    const config = getWalletCfg("default-wallet");
    config.set("enableticketbuyer", settings.enableTicketBuyer);
    dispatch({ tempSettings: settings, type: SETTINGS_CHANGED});
  } else {
    dispatch({ tempSettings: currentSettings, type: SETTINGS_UNCHANGED});
  }
};
