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

export function loginRequest() {
  return (dispatch, getState) => {
    const { getLoaderRequest } = getState().walletLoader;
    dispatch({
      address: getLoaderRequest.address, 
      port: getLoaderRequest.port, 
      passphrase: '', 
      type: LOGIN_ATTEMPT })
    dispatch(login());
  }
}

function login() {
  return (dispatch, getState) => {
    const { address, port } = getState().login;
    client(address, port, function(client, err) {
      if (err) {
        dispatch(loginError(err + " Please try again"));
      } else {
        dispatch(loginSuccess(client));
      }
    })
  }
}
