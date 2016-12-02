import { getBalance, createWallet } from '../middleware/grpc/client';

export const GETBALANCE_ATTEMPT = 'GETBALANCE_ATTEMPT';
export const GETBALANCE_FAILED = 'GETBALANCE_FAILED';
export const GETBALANCE_SUCCESS = 'GETBALANCE_SUCCESS';

function getBalanceError(error) {
  return { error, type: GETBALANCE_FAILED };
}

function getBalanceSuccess(balance) {
  return { balance, type: GETBALANCE_SUCCESS };
}

export function getBalanceRequest(accountNumber, requiredConfs) {
  return { 
      accountNumber: accountNumber,
      requireConfs: requiredConfs,
      type: GETBALANCE_ATTEMPT };
}

export function grpcBalance() {
  return (dispatch, getState) => {
    const { client } = getState().login;
    const { balanceAccountNumber, balanceRequiredConfs } = getState().grpc;
    getBalance(client, balanceAccountNumber, balanceRequiredConfs, 
        function(balance, err) {
      if (err) {
        dispatch(getBalanceError(err + " Please try again"));
      } else {
        dispatch(getBalanceSuccess(balance));
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
