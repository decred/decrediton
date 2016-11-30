import { client } from '../middleware/grpc/client';

export const LOGIN_ATTEMPT = 'LOGIN_ATTEMPT';
export const LOGGED_FAILED = 'LOGGED_FAILED';
export const LOGGED_SUCCESSFULLY = 'LOGGED_SUCCESSFULLY';

export function loginError(error) {
  return { error, type: LOGGED_FAILED };
}

export function loginSuccess(response) {
  return dispatch => {
    dispatch({ response, type: LOGGED_SUCCESSFULLY });
    router.transitionTo('/');
  };
}

export function loginRequest(email, password) {
  const login = {address: address, port: port, passphrase: passphrase};
  return { login, type: LOGIN_ATTEMPT };
}

export function login(userData) {
  return dispatch =>
    fetch('http://localhost/login', {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: userData.email,
        password: userData.password,
      }),
    })
    .then(response => {
      if (response.status >= 200 && response.status < 300) {
        console.log(response);
        dispatch(loginSuccess(response));
      } else {
        const error = new Error(response.statusText);
        error.response = response;
        dispatch(loginError(error));
        throw error;
      }
    })
    .catch(error => { console.log('request failed', error); });
}