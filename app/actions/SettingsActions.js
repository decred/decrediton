// import fs from 'fs';
import { getCfg } from '../config.js';
export const SETTINGS_SAVE = 'SETTINGS_SAVE';
export const SETTINGS_CHANGED = 'SETTINGS_CHANGED';
export const SETTINGS_UNCHANGED = 'SETTINGS_UNCHANGED';

export function saveSettings(settings) {
  return {
    settings,
    type: SETTINGS_SAVE
  };
}
export function updateStateSettingsChanged(settings) {
  return (dispatch, getState) => {
    var cfg = getCfg();
    const { tempSettings, currentSettings } = getState().settings;
    if ((settings.currencyDisplay !== tempSettings.currencyDisplay) ||
      (settings.network !== tempSettings.network)) {
      if (settings.currencyDisplay !== currentSettings.currencyDisplay) {
        cfg.set('currency_display', settings.currencyDisplay);
        dispatch({ tempSettings: settings, type: SETTINGS_CHANGED });
      } else if (settings.network !== currentSettings.network) {
        cfg.set('network', settings.network);
        dispatch({ tempSettings: settings, type: SETTINGS_CHANGED });
      } else {
        dispatch({ tempSettings: currentSettings, type: SETTINGS_UNCHANGED });
      }
    }
  };
}
