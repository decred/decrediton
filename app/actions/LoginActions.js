import { client } from '../middleware/grpc/client';

export const LOGIN_ATTEMPT = 'LOGIN_ATTEMPT';
export const LOGGED_FAILED = 'LOGGED_FAILED';
export const LOGGED_SUCCESSFULLY = 'LOGGED_SUCCESSFULLY';

function loginError(error) {
  return { error, type: LOGGED_FAILED };
}

function loginSuccess(client) {
  return dispatch => {
    dispatch({ client, type: LOGGED_SUCCESSFULLY });
    //router.transitionTo('/');
  };
}

function loginRequest(address, port, passphrase) {
  const login = {address: address, port: port, passphrase: passphrase};
  return { login, type: LOGIN_ATTEMPT };
}

export function login(address, port, passphrase) {
  return dispatch =>
    client(address, port, function(client, err) {
      if (err) {
        console.log("in login action!", err);
        const error = new Error(err);
        dispatch(loginError(error));
        throw err
      } else {
        dispatch(loginSuccess(client));
      }
    })
}