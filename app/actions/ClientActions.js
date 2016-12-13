import { getBalance, getAccountNumber, getNetwork, getPing,
  getStakeInfo, getTicketPrice, getAccounts, getTransactions } from '../middleware/grpc/client';

export const GETBALANCE_ATTEMPT = 'GETBALANCE_ATTEMPT';
export const GETBALANCE_FAILED = 'GETBALANCE_FAILED';
export const GETBALANCE_SUCCESS = 'GETBALANCE_SUCCESS';

function getBalanceError(error) {
  return { error, type: GETBALANCE_FAILED };
}

function getBalanceSuccess(getBalanceResponse) {
  return { getBalanceResponse: getBalanceResponse, type: GETBALANCE_SUCCESS };
}

export function getBalanceAttempt(accountNumber, requiredConfs) {
  var request = {
    account_number: accountNumber,
    required_confirmations: requiredConfs
  };
  return (dispatch) => {
    dispatch({
      request: request,
      type: GETBALANCE_ATTEMPT });
    dispatch(balance());
  };
}

function balance() {
  return (dispatch, getState) => {
    const { client } = getState().login;
    const { getBalanceRequest } = getState().grpc;
    getBalance(client, getBalanceRequest,
        function(getBalanceResponse, err) {
          if (err) {
            dispatch(getBalanceError(err + ' Please try again'));
          } else {
            dispatch(getBalanceSuccess(getBalanceResponse));
          }
        });
  };
}

export const GETACCOUNTNUMBER_ATTEMPT = 'GETACCOUNTNUMBER_ATTEMPT';
export const GETACCOUNTNUMBER_FAILED = 'GETACCOUNTNUMBER_FAILED';
export const GETACCOUNTNUMBER_SUCCESS = 'GETACCOUNTNUMBER_SUCCESS';

function getAccountNumberError(error) {
  return { error, type: GETACCOUNTNUMBER_FAILED };
}

function getAccountNumberSuccess(getAccountNumberResponse) {
  return { getAccountNumberResponse: getAccountNumberRequest, type: GETACCOUNTNUMBER_SUCCESS };
}

export function getAccountNumberAttempt(accountName) {
  var request = {
    account_name: accountName
  };
  return (dispatch) => {
    dispatch({
      request: request,
      type: GETACCOUNTNUMBER_ATTEMPT });
    dispatch(accountNumber());
  };
}

function accountNumber() {
  return (dispatch, getState) => {
    const { client } = getState().login;
    const { getAccountNumberRequest } = getState().grpc;
    getAccountNumber(client, getAccountNumberRequest,
        function(getAccountNumberResponse, err) {
          if (err) {
            dispatch(getAccountNumberError(err + ' Please try again'));
          } else {
            dispatch(getAccountNumberSuccess(getAccountNumberResponse));
          }
        });
  };
}

export const GETNETWORK_ATTEMPT = 'GETNETWORK_ATTEMPT';
export const GETNETWORK_FAILED = 'GETNETWORK_FAILED';
export const GETNETWORK_SUCCESS = 'GETNETWORK_SUCCESS';

function getNetworkError(error) {
  return { error, type: GETNETWORK_FAILED };
}

function getNetworkSuccess(getNetworkResponse) {
  return { getNetworkResponse: getNetworkResponse, type: GETNETWORK_SUCCESS };
}

export function getNetworkAttempt() {
  var request = {};
  return (dispatch) => {
    dispatch({
      request: request,
      type: GETNETWORK_ATTEMPT });
    dispatch(network());
  };
}

function network() {
  return (dispatch, getState) => {
    const { client } = getState().login;
    const { getNetworkRequest } = getState().grpc;
    getNetwork(client, getNetworkRequest,
        function(getNetworkResponse, err) {
          if (err) {
            dispatch(getNetworkError(err + ' Please try again'));
          } else {
            dispatch(getNetworkSuccess(getNetworkResponse));
          }
        });
  };
}

export const GETPING_ATTEMPT = 'GETPING_ATTEMPT';
export const GETPING_FAILED = 'GETPING_FAILED';
export const GETPING_SUCCESS = 'GETPING_SUCCESS';

function getPingError(error) {
  return { error, type: GETPING_FAILED };
}

function getPingSuccess(getPingResponse) {
  return { getPingResponse: getPingResponse, type: GETPING_SUCCESS };
}

export function getPingAttempt() {
  var request = {
  };
  return (dispatch) => {
    dispatch({
      request: request,
      type: GETPING_ATTEMPT });
    dispatch(ping());
  };
}

function ping() {
  return (dispatch, getState) => {
    const { client } = getState().login;
    const { getPingRequest } = getState().grpc;
    getPing(client, getPingRequest,
        function(getPingResponse, err) {
          if (err) {
            dispatch(getPingError(err + ' Please try again'));
          } else {
            dispatch(getPingSuccess(getPingResponse));
          }
        });
  };
}

export const GETSTAKEINFO_ATTEMPT = 'GETSTAKEINFO_ATTEMPT';
export const GETSTAKEINFO_FAILED = 'GETSTAKEINFO_FAILED';
export const GETSTAKEINFO_SUCCESS = 'GETSTAKEINFO_SUCCESS';

function getStakeInfoError(error) {
  return { error, type: GETSTAKEINFO_FAILED };
}

function getStakeInfoSuccess(getStakeInfoResponse) {
  return { getStakeInfoResponse: getStakeInfoResponse, type: GETSTAKEINFO_SUCCESS };
}

export function getStakeInfoAttempt() {
  var request = {
  };
  return (dispatch) => {
    dispatch({
      request: request,
      type: GETSTAKEINFO_ATTEMPT });
    dispatch(stakeInfo());
  };
}

function stakeInfo() {
  return (dispatch, getState) => {
    const { client } = getState().login;
    const { getStakeInfoRequest } = getState().grpc;
    getStakeInfo(client, getStakeInfoRequest,
        function(getStakeInfoResponse, err) {
          if (err) {
            dispatch(getStakeInfoError(err + ' Please try again'));
          } else {
            dispatch(getStakeInfoSuccess(getStakeInfoResponse));
          }
        });
  };
}

export const GETTICKETPRICE_ATTEMPT = 'GETTICKETPRICE_ATTEMPT';
export const GETTICKETPRICE_FAILED = 'GETTICKETPRICE_FAILED';
export const GETTICKETPRICE_SUCCESS = 'GETTICKETPRICE_SUCCESS';

function getTicketPriceError(error) {
  return { error, type: GETTICKETPRICE_FAILED };
}

function getTicketPriceSuccess(getTicketPriceResponse) {
  return { getTicketPriceResponse: getTicketPriceResponse, type: GETTICKETPRICE_SUCCESS };
}

export function getTicketPriceAttempt() {
  var request = {
  };
  return (dispatch) => {
    dispatch({
      request: request,
      type: GETTICKETPRICE_ATTEMPT });
    dispatch(ticketPrice());
  };
}

function ticketPrice() {
  return (dispatch, getState) => {
    const { client } = getState().login;
    const { getTicketPriceRequest } = getState().grpc;
    getTicketPrice(client, getTicketPriceRequest,
        function(getTicketPriceResponse, err) {
          if (err) {
            dispatch(getTicketPriceError(err + ' Please try again'));
          } else {
            dispatch(getTicketPriceSuccess(getTicketPriceResponse));
          }
        });
  };
}

export const GETACCOUNTS_ATTEMPT = 'GETACCOUNTS_ATTEMPT';
export const GETACCOUNTS_FAILED = 'GETACCOUNTS_FAILED';
export const GETACCOUNTS_SUCCESS = 'GETACCOUNTS_SUCCESS';

function getAccountsError(error) {
  return { error, type: GETACCOUNTS_FAILED };
}

function getAccountsSuccess(getAccountsResponse) {
  return { getAccountsResponse: getAccountsResponse, type: GETACCOUNTS_SUCCESS };
}

export function getAccountsAttempt() {
  var request = {
  };
  return (dispatch) => {
    dispatch({
      request: request,
      type: GETACCOUNTS_ATTEMPT });
    dispatch(accounts());
  };
}

function accounts() {
  return (dispatch, getState) => {
    const { client } = getState().login;
    const { getAccountsRequest } = getState().grpc;
    getAccounts(client, getAccountsRequest,
        function(getAccountsResponse, err) {
          if (err) {
            dispatch(getAccountsError(err + ' Please try again'));
          } else {
            dispatch(getAccountsSuccess(getAccountsResponse));
          }
        });
  };
}

export const GETTRANSACTIONS_ATTEMPT = 'GETTRANSACTIONS_ATTEMPT';
export const GETTRANSACTIONS_FAILED = 'GETTRANSACTIONS_FAILED';
export const GETTRANSACTIONS_SUCCESS = 'GETTRANSACTIONS_SUCCESS';

function getTransactionsError(error) {
  return { error, type: GETTRANSACTIONS_FAILED };
}

function getTransactionsSuccess(getTransactionsResponse) {
  return { getTransactionsResponse: getTransactionsResponse, type: GETTRANSACTIONS_SUCCESS };
}

export function getTransactionsAttempt(startHeight, endHeight, startHash, endHash, ) {
  // Currently not working due to too large of messages
  // known issue by jrick.
  // GetTransactions
  var request = {
    starting_block_height: startHeight,
    starting_block_hash: startHash,
    ending_block_height: endHeight,
    ending_block_hash: endHash
  };
  return (dispatch) => {
    dispatch({
      request: request,
      type: GETTRANSACTIONS_ATTEMPT });
    dispatch(transactions());
  };
}

function transactions() {
  return (dispatch, getState) => {
    const { client } = getState().login;
    const { getTransactionsRequest } = getState().grpc;
    getTransactions(client, getTransactionsRequest,
        function(getTransactionsResponse, err) {
          if (err) {
            dispatch(getTransactionsError(err + ' Please try again'));
          } else {
            dispatch(getTransactionsSuccess(getTransactionsResponse));
          }
        });
  };
}
