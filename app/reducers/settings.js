import { SETTINGS_ATTEMPT } from '../actions/SettingsActions';

export default function settings(state = {}, action) {
  switch (action.type) {
    case SETTINGS_ATTEMPT:
      return {...state,
        someSettings: action.someSettings,
      };
    default:
      return state;
  }
}