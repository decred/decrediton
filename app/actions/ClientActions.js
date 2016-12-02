import { getBalance } from '../middleware/grpc/client';

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

