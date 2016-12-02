import { client } from '../middleware/grpc/client';

export const LOGIN_ATTEMPT = 'LOGIN_ATTEMPT';
export const LOGIN_FAILED = 'LOGIN_FAILED';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';

function loginError(error) {
  return { error, type: LOGIN_FAILED };
}

function loginSuccess(client) {
  return { client, type: LOGIN_SUCCESS };
}

export function loginRequest(address, port, passphrase) {
  return { address: address, port: port, passphrase: passphrase, type: LOGIN_ATTEMPT };
}

export function login() {
  return (dispatch, getState) => {
    const { address, port } = getState().login;
    client(address, port, function(client, err) {
      if (err) {
        dispatch(loginError(err + " Please try again"));
        //throw err
      } else {
        dispatch(loginSuccess(client));
      }
    })
  }
}
