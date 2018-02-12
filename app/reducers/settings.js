import { SETTINGS_SAVE, SETTINGS_CHANGED, SETTINGS_UNCHANGED } from "../actions/SettingsActions";
import { WALLET_SETTINGS } from "actions/DaemonActions";

export default function settings(state = {}, action) {
  switch (action.type) {
  case SETTINGS_SAVE:
    return {...state,
      currentSettings: action.settings,
      tempSettings: action.settings,
      settingsChanged: false,
    };
  case SETTINGS_CHANGED:
    return {...state,
      tempSettings: action.tempSettings,
      settingsChanged: true,
    };
  case SETTINGS_UNCHANGED:
    return {...state,
      tempSettings: action.tempSettings,
      settingsChanged: false,
    };
  case WALLET_SETTINGS:
    var currentSettings = state.currentSettings;
    var tempSettings = state.tempSettings;
    currentSettings.currencyDisplay = action.currencyDisplay;
    tempSettings.currencyDisplay = action.currencyDisplay;
    return {...state,
      currentSettings: currentSettings,
      tempSettings: tempSettings
    };
  default:
    return state;
  }
}
