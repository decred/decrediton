import { transactionNtfs, spentnessNtfs, accountNtfs } from '../middleware/grpc/client';

export const TRANSACTIONNFTNS_START = 'TRANSACTIONNFTNS_START';
export const TRANSACTIONNFTNS_FAILED = 'TRANSACTIONNFTNS_FAILED';
export const TRANSACTIONNFTNS_DATA = 'TRANSACTIONNFTNS_DATA';
export const TRANSACTIONNFTNS_END = 'TRANSACTIONNFTNS_END';

function transactionNftnsError(error) {
  return { error, type: TRANSACTIONNFTNS_FAILED};
}

function transactionNtfnsData(response) {
  return { response: response, type: TRANSACTIONNFTNS_DATA };
}

export function transactionNftnsStart() {
  var request = {};
  return (dispatch) => {
    dispatch({request: request, type: TRANSACTIONNFTNS_START });
    dispatch(startTransactionNtfns());
  };
}

export function transactionNftnsEnd() {
  var request = {};
  return (dispatch) => {
    dispatch({request: request, type: TRANSACTIONNFTNS_END });
    //
  };
}

function startTransactionNtfns() {
  return (dispatch, getState) => {
    const { client } = getState().login;
    const { transactionNftnsRequest } = getState().notifications;
    transactionNtfs(client, transactionNftnsRequest,
      function(data) {
        console.log('Transaction received:', data);
        dispatch(startTransactionNtfns(data));
      }
    );
  };
}

export const SPENTNESSNFTNS_START = 'SPENTNESSNFTNS_START';
export const SPENTNESSNFTNS_FAILED = 'SPENTNESSNFTNS_FAILED';
export const SPENTNESSNFTNS_DATA = 'SPENTNESSNFTNS_DATA';
export const SPENTNESSNFTNS_END = 'SPENTNESSNFTNS_END';

function spentnessNftnsError(error) {
  return { error, type: SPENTNESSNFTNS_FAILED};
}

function spentnessNtfnsData(response) {
  return { response: response, type: SPENTNESSNFTNS_DATA };
}

export function spentnessNftnsStart() {
  var request = {};
  return (dispatch) => {
    dispatch({request: request, type: SPENTNESSNFTNS_START });
    dispatch(startSpentnessNtfns());
  };
}

export function spentnessNftnsEnd() {
  var request = {};
  return (dispatch) => {
    dispatch({request: request, type: SPENTNESSNFTNS_END });
    //
  };
}

function startSpentnessNtfns() {
  return (dispatch, getState) => {
    const { client } = getState().login;
    const { spentnessNftnsRequest } = getState().notifications;
    spentnessNtfs(client, spentnessNftnsRequest,
      function(data) {
        console.log('Spentness received:', data);
        dispatch(startSpentnessNtfns(data));
      }
    );
  };
}

export const ACCOUNTNFTNS_START = 'ACCOUNTNFTNS_START';
export const ACCOUNTNFTNS_FAILED = 'ACCOUNTNFTNS_FAILED';
export const ACCOUNTNFTNS_DATA = 'ACCOUNTNFTNS_DATA';
export const ACCOUNTNFTNS_END = 'ACCOUNTNFTNS_END';

function accountNftnsError(error) {
  return { error, type: ACCOUNTNFTNS_FAILED};
}

function accountNtfnsData(response) {
  return { response: response, type: ACCOUNTNFTNS_DATA };
}

export function accountNftnsStart(accountNum) {
  var request = {
    account: accountNum,
    no_notify_unspent: false,
    no_notify_spent: false,
  };
  return (dispatch) => {
    dispatch({request: request, type: ACCOUNTNFTNS_START });
    dispatch(startAccountNtfns());
  };
}

export function accountNftnsEnd() {
  var request = {};
  return (dispatch) => {
    dispatch({request: request, type: ACCOUNTNFTNS_END });
    //
  };
}

function startAccountNtfns() {
  return (dispatch, getState) => {
    const { client } = getState().login;
    const { accountNftnsRequest } = getState().notifications;
    accountNtfs(client, accountNftnsRequest,
      function(data) {
        console.log('Account received:', data);
        dispatch(startAccountNtfns(data));
      }
    );
  };
}