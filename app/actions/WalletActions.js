import { createWallet } from '../middleware/grpc/client';

export const CREATEWALLET_ATTEMPT = 'CREATEWALLET_ATTEMPT';
export const CREATEWALLET_FAILED = 'CREATEWALLET_FAILED';
export const CREATEWALLET_SUCCESS = 'CREATEWALLET_SUCCESS';

function createWalletError(error) {
  return { error, type: CREATEWALLET_FAILED };
}

function getBalanceSuccess() {
  return { type: CREATEWALLET_SUCCESS };
}

export function createWalletRequest(pubPass, privPass, seed) {
  return { 
      pubPass: pubPass,
      privPass: privPass,
      seed: seed,
      type: CREATEWALLET_ATTEMPT };
}

export function createNewWallet() {
  return (dispatch, getState) => {
    const { client } = getState().login;
    const { pubPass, privPass, seed } = getState().grpc;
    createWallet(client, pubPass, privPass, seed, 
        function(err) {
      if (err) {
        dispatch(createWalletError(err + " Please try again"));
      } else {
        dispatch(createWalletSuccess());
      }
    })
  }
}
