// @flow
import { getCfg, writeCfg } from "../config.js";
export const SETTINGS_SAVE = "SETTINGS_SAVE";
export const SETTINGS_CHANGED = "SETTINGS_CHANGED";
export const SETTINGS_UNCHANGED = "SETTINGS_UNCHANGED";

export const saveSettings = (settings) => {
  const cfg = getCfg();
  cfg.set("currency_display", settings.currencyDisplay);
  cfg.set("network", settings.network);
  cfg.set("locale", settings.locale);
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
  const cfg = getCfg();
  const { settings: { tempSettings, currentSettings }} = getState();

  if (settings.enableTicketBuyer !== tempSettings.enableTicketBuyer) {
    cfg.set("enableticketbuyer", settings.enableTicketBuyer);
    dispatch({ tempSettings: settings, type: SETTINGS_CHANGED});
    writeCfg();
  } else {
    dispatch({ tempSettings: currentSettings, type: SETTINGS_UNCHANGED});
  }
};
