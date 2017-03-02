import { transactionNtfs, spentnessNtfs, accountNtfs } from '../middleware/grpc/client';
import { getAccountsAttempt, getBalanceAttempt, getStakeInfoAttempt,
  getTicketPriceAttempt, getNetworkAttempt } from './ClientActions';

import { TransactionNotificationsRequest } from '../middleware/walletrpc/api_pb';

export const TRANSACTIONNFTNS_START = 'TRANSACTIONNFTNS_START';
export const TRANSACTIONNFTNS_FAILED = 'TRANSACTIONNFTNS_FAILED';
export const TRANSACTIONNFTNS_DATA = 'TRANSACTIONNFTNS_DATA';
export const TRANSACTIONNFTNS_SYNCING = 'TRANSACTIONNFTNS_SYNCING';
export const TRANSACTIONNFTNS_END = 'TRANSACTIONNFTNS_END';

function transactionNtfnsData(response) {
  return (dispatch, getState) => {
    const { neededBlocks } = getState().walletLoader;
    var currentHeight = 0;
    if (response.getAttachedBlocksList().length > 0) {
      currentHeight = response.getAttachedBlocksList()[0].getHeight()
    }
    if (currentHeight > neededBlocks) {
      dispatch({response: response, type: TRANSACTIONNFTNS_DATA });
      setTimeout( () => {dispatch(getBalanceAttempt());}, 1000);
      setTimeout( () => {dispatch(getStakeInfoAttempt());}, 1000);
      setTimeout( () => {dispatch(getTicketPriceAttempt());}, 1000);
      setTimeout( () => {dispatch(getAccountsAttempt());}, 1000);
      setTimeout( () => {dispatch(getNetworkAttempt());}, 1000);
    } else if (currentHeight%100 == 0) {
      dispatch({currentHeight: currentHeight, type: TRANSACTIONNFTNS_SYNCING });
    }
  };
}

export function transactionNftnsStart() {
  var request = new TransactionNotificationsRequest();
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
    const { walletService } = getState().grpc;
    const { transactionNtfnsRequest } = getState().notifications;
    transactionNtfs(walletService, transactionNtfnsRequest,
      function(data) {
        dispatch(transactionNtfnsData(data));
      }
    );
  };
}

export const SPENTNESSNFTNS_START = 'SPENTNESSNFTNS_START';
export const SPENTNESSNFTNS_FAILED = 'SPENTNESSNFTNS_FAILED';
export const SPENTNESSNFTNS_DATA = 'SPENTNESSNFTNS_DATA';
export const SPENTNESSNFTNS_END = 'SPENTNESSNFTNS_END';

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
        dispatch(spentnessNtfnsData(data));
      }
    );
  };
}

export const ACCOUNTNFTNS_START = 'ACCOUNTNFTNS_START';
export const ACCOUNTNFTNS_FAILED = 'ACCOUNTNFTNS_FAILED';
export const ACCOUNTNFTNS_DATA = 'ACCOUNTNFTNS_DATA';
export const ACCOUNTNFTNS_END = 'ACCOUNTNFTNS_END';

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
        dispatch(accountNtfnsData(data));
      }
    );
  };
}
