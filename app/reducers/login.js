import { LOGIN_ATTEMPT, LOGGED_FAILED, LOGGED_SUCCESSFULLY } from '../actions/LoginActions';
import Immutable from 'immutable';

const initialState = new Immutable.Map({
  address: '',
  port: '',
  password: '',
  isLoggingIn: false,
  isLoggedIn: false,
  error: null
});

export default function login(state = initialState, action) {
  switch (action.type) {
    case LOGIN_ATTEMPT:
      return state.merge({
        isLoggingIn: true,
        isLoggedIn: false,
        address: action.adress,
        port: action.port,
        password: action.password,
      });
    case LOGGED_FAILED:
      return state.merge({
        error: action.error,
        isLoggingIn: false,
        isLoggedIn: false
      });
    case LOGGED_SUCCESSFULLY:
      return state.merge({
        error: null,
        client: action.client,
        isLoggingIn: false,
        isLoggedIn: true
      });
    default:
      return state;
  }
}