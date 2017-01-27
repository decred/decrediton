// import fs from 'fs';

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
    const { tempSettings, currentSettings } = getState().settings;
    if (settings.currencyDisplay !== tempSettings.currencyDisplay) {
      if (settings.currencyDisplay !== currentSettings.currencyDisplay) {
        console.log('settings changed! different than currentSettings');
        dispatch({ tempSettings: settings, type: SETTINGS_CHANGED});
      } else {
        console.log('settings changed! same as currentSettings');
        dispatch({ tempSettings: currentSettings, type: SETTINGS_UNCHANGED});
      }
    }
  };
}