// import fs from 'fs';
import { getCfg } from '../config.js';
export const SETTINGS_SAVE = 'SETTINGS_SAVE';
export const SETTINGS_CHANGED = 'SETTINGS_CHANGED';
export const SETTINGS_UNCHANGED = 'SETTINGS_UNCHANGED';
/*
function settingsSave() {
  return (dispatch) => {
    var fs = require('fs');
    fs.writeFile('/tmp/test.txt', 'hello world\n', (err) => {
      if (err) {
        console.log('error saving settings: ' + err);
        return dispatch(setSomeSettingsError(err));
      }
      console.log('settings saved');
      dispatch(setSomeSettingsSuccess());
    });
  }
}
*/

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
    if (settings.currencyDisplay !== tempSettings.currencyDisplay) {
      if (settings.currencyDisplay !== currentSettings.currencyDisplay) {
        cfg.set('currency_display', settings.currencyDisplay);
        dispatch({ tempSettings: settings, type: SETTINGS_CHANGED});
      } else {
        dispatch({ tempSettings: currentSettings, type: SETTINGS_UNCHANGED});
      }
    }
  };
}