import { SETTINGS_SAVE, SETTINGS_CHANGED, SETTINGS_UNCHANGED, SETTINGS_TOGGLE_THEME,
  ALLOWEDEXTERNALREQUESTS_ADDED } from "../actions/SettingsActions";
import { WALLET_SETTINGS, SELECT_LANGUAGE } from "actions/DaemonActions";
export default function settings(state = {}, action) {
  switch (action.type) {
  case SELECT_LANGUAGE:
    var currentSettings = state.currentSettings;
    currentSettings.locale = action.language;
    return { ...state,
      currentSettings: currentSettings,
      tempSettings: currentSettings,
    };
  case SETTINGS_SAVE:
    return { ...state,
      currentSettings: action.settings,
      tempSettings: action.settings,
      settingsChanged: false,
    };
  case SETTINGS_CHANGED:
    return { ...state,
      tempSettings: action.tempSettings,
      settingsChanged: true,
      needNetworkReset: action.needNetworkReset,
    };
  case SETTINGS_UNCHANGED:
    return { ...state,
      tempSettings: action.tempSettings,
      settingsChanged: false,
    };
  case ALLOWEDEXTERNALREQUESTS_ADDED:
    return { ...state,
      currentSettings: action.newSettings,
      tempSettings: action.newTempSettings,
    };
  case WALLET_SETTINGS:
    currentSettings = state.currentSettings;
    var tempSettings = state.tempSettings;
    currentSettings.currencyDisplay = action.currencyDisplay;
    tempSettings.currencyDisplay = action.currencyDisplay;
    currentSettings.gapLimit = action.gapLimit;
    tempSettings.gapLimit = action.gapLimit;
    return { ...state,
      currentSettings: currentSettings,
      tempSettings: tempSettings
    };
  case SETTINGS_TOGGLE_THEME:
    return { ...state,
      theme: action.theme,
    };
  default:
    return state;
  }
}
