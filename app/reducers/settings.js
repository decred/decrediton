import { SETTINGS_SAVE, SETTINGS_CHANGED, SETTINGS_UNCHANGED } from '../actions/SettingsActions';

export default function settings(state = {}, action) {
  switch (action.type) {
  case SETTINGS_SAVE:
    return {
      ...state,
      currentSettings: action.settings,
      tempSettings: action.settings,
      settingsChanged: false,
    };
  case SETTINGS_CHANGED:
    return {
      ...state,
      tempSettings: action.tempSettings,
      settingsChanged: true,
    };
  case SETTINGS_UNCHANGED:
    return {
      ...state,
      tempSettings: action.tempSettings,
      settingsChanged: false,
    };
  default:
    return state;
  }
}