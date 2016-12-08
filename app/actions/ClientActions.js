import { getBalance } from '../middleware/grpc/client';

export const GETBALANCE_ATTEMPT = 'GETBALANCE_ATTEMPT';
export const GETBALANCE_FAILED = 'GETBALANCE_FAILED';
export const GETBALANCE_SUCCESS = 'GETBALANCE_SUCCESS';

function getBalanceError(error) {
  return { error, type: GETBALANCE_FAILED };
}

function getBalanceSuccess(balanceResponse) {
  return { balanceResponse: balanceResponse, type: GETBALANCE_SUCCESS };
}

export function getBalanceRequest(accountNumber, requiredConfs) {
  return (dispatch) => {
    dispatch({
      accountNumber: accountNumber,
      requireConfs: requiredConfs,
      type: GETBALANCE_ATTEMPT });
    dispatch(balance());
  }
}

function balance() {
  return (dispatch, getState) => {
    const { client } = getState().login;
    const { getBalanceAccountNumber, getBalanceRequiredConfs } = getState().grpc;
    getBalance(client, getBalanceAccountNumber, getBalanceRequiredConfs, 
        function(balanceResponse, err) {
      if (err) {
        dispatch(getBalanceError(err + " Please try again"));
      } else {
        dispatch(getBalanceSuccess(balanceResponse));
      }
    })
  }
}
