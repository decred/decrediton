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
  };
}

export function loginRequest(address, port, passphrase) {
  console.log(address, port, passphrase);
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