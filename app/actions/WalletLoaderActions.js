import { getBalance, createWallet, walletExist } from '../middleware/grpc/client';

export const WALLETEXIST_ATTEMPT = 'WALLETEXIST_ATTEMPT';
export const WALLETEXIST_FAILED = 'WALLETEXIST_FAILED';
export const WALLETEXIT_SUCCESS = 'WALLETEXIST_SUCCESS';

function walletExistError(error) {
  return { error, type: WALLETEXIST_FAILED };
}

function walletExistSuccess() {
  return { type: WALLETEXIT_SUCCESS };
}

export function walletExistRequest() {
  return { type: WALLETEXIST_ATTEMPT };
}

export function checkWalletExist() {
  return (dispatch, getState) => {
    const { loader } = getState().walletLoader;
    createWallet(loader,
        function(err) {
      if (err) {
        dispatch(walletExistError(err + " Please try again"));
      } else {
        dispatch(walletExistSuccess());
      }
    })
  }
}

export const CREATEWALLET_ATTEMPT = 'CREATEWALLET_ATTEMPT';
export const CREATEWALLET_FAILED = 'CREATEWALLET_FAILED';
export const CREATEWALLET_SUCCESS = 'CREATEWALLET_SUCCESS';

function createWalletError(error) {
  return { error, type: CREATEWALLET_FAILED };
}

function createWalletSuccess() {
  return { type: CREATEWALLET_SUCCESS };
}

export function createWalletRequest(pubPass, privPass, seed) {
  console.log("blah", pubPass, privPass, seed);
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
    console.log(pubPass, privPass, seed);
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
