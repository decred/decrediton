import { LOGIN_ATTEMPT, LOGGED_FAILED, LOGGED_SUCCESSFULLY } from '../actions/LoginActions';

export default function login(state = {}, action) {
  switch (action.type) {
    case LOGIN_ATTEMPT:
      return {...state,
        isLoggingIn: true,
        isLoggedIn: false,
        address: action.address,
        port: action.port,
        password: action.password,
      };
    case LOGGED_FAILED:
      return {...state,
        error: action.error,
        isLoggingIn: false,
        isLoggedIn: false,
        address: '',
        port: '',
        passphrase: ''
      };
    case LOGGED_SUCCESSFULLY:
      return {...state,
        error: "",
        client: action.client,
        isLoggingIn: false,
        isLoggedIn: true
      };
    default:
      return state;
  }
}