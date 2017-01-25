import fs from 'fs';

export const SETTINGS_ATTEMPT = 'SETTINGS_ATTEMPT';
export const SETTINGS_FAILED = 'SETTINGS_FAILED';
export const SETTINGS_SUCCESS = 'SETTINGS_SUCCESS';

function setSomeSettingsError(error) {
  return { error, type: SETTINGS_FAILED };
}

function setSomeSettingsSuccess() {
  return { type: SETTINGS_SUCCESS };
}

export function setSomeSettings(someSettings) {
  return (dispatch) => {
    dispatch({someSettings: someSettings, type: SETTINGS_ATTEMPT });
    dispatch(settingsSave());
  }
}

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

export function checkBoxSetting(someSettings) {
  return (dispatch) => {
    console.log('toggled checkbox');
    dispatch({someSettings: !someSettings, type: SETTINGS_ATTEMPT });
  }
}