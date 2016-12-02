import { loader, createWallet, walletExist } from '../middleware/grpc/client';

export const LOADER_ATTEMPT = 'LOADER_ATTEMPT';
export const LOADER_FAILED = 'LOADER_FAILED';
export const LOADER_SUCCESS = 'LOADER_SUCCESS';

function loaderError(error) {
  return { error, type: LOADER_FAILED };
}

function loaderSuccess(loader) {
  return { loader, type: LOADER_SUCCESS };
}

export function loaderRequest(address, port) {
  return { address: address, port: port, type: LOADER_ATTEMPT };
}

export function getLoader() {
  return (dispatch, getState) => {
    const { address, port } = getState().walletLoader;
    loader(address, port, function(loader, err) {
      if (err) {
        dispatch(loaderError(err + " Please try again"));
        //throw err
      } else {
        dispatch(loaderSuccess(loader));
      }
    })
  }
}

export const WALLETEXIST_ATTEMPT = 'WALLETEXIST_ATTEMPT';
export const WALLETEXIST_FAILED = 'WALLETEXIST_FAILED';
export const WALLETEXIST_SUCCESS = 'WALLETEXIST_SUCCESS';

function walletExistError(error) {
  return { error, type: WALLETEXIST_FAILED };
}

function walletExistSuccess(exists) {
  return {exists: exists, type: WALLETEXIST_SUCCESS };
}

export function walletExistRequest() {
  return { type: WALLETEXIST_ATTEMPT };
}

export function checkWalletExist() {
  return (dispatch, getState) => {
    const { loader } = getState().walletLoader;
    walletExists(loader,
        function(exists, err) {
      if (err) {
        dispatch(walletExistError(err + " Please try again"));
      } else {
        dispatch(walletExistSuccess(exists));
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

export const OPENWALLET_ATTEMPT = 'OPENWALLET_ATTEMPT';
export const OPENWALLET_FAILED = 'OPENWALLET_FAILED';
export const OPENWALLET_SUCCESS = 'OPENWALLET_SUCCESS';

function openWalletError(error) {
  return { error, type: OPENWALLET_FAILED };
}

function openWalletSuccess() {
  return {type: OPENWALLET_SUCCESS };
}

export function openWalletRequest() {
  return { type: OPENWALLET_ATTEMPT };
}

export function openWalletAction() {
  return (dispatch, getState) => {
    const { loader } = getState().walletLoader;
    openWallet(loader,
        function(exists, err) {
      if (err) {
        dispatch(openWalletError(err + " Please try again"));
      } else {
        dispatch(openWalletSuccess());
      }
    })
  }
}