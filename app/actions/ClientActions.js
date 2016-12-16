import { getWalletService, getBalance, getAccountNumber, getNetwork, getPing,
  getStakeInfo, getTicketPrice, getAccounts, getTransactions } from '../middleware/grpc/client';
import { getNextAddressAttempt, loadActiveDataFiltersAttempt, rescanAttempt } from './ControlActions';
export const GETWALLETSERVICE_ATTEMPT = 'GETWALLETSERVICE_ATTEMPT';
export const GETWALLETSERVICE_FAILED = 'GETWALLETSERVICE_FAILED';
export const GETWALLETSERVICE_SUCCESS = 'GETWALLETSERVICE_SUCCESS';
import { hashHistory } from 'react-router';
function getWalletServiceError(error) {
  return { error, type: GETWALLETSERVICE_FAILED };
}

function getWalletServiceSuccess(walletService) {
  return (dispatch, getState) => {
    dispatch({ walletService, type: GETWALLETSERVICE_SUCCESS });
    setTimeout( () => {dispatch(loadActiveDataFiltersAttempt());}, 1000);
    setTimeout( () => {dispatch(getNextAddressAttempt());}, 1000);
    setTimeout( () => {dispatch(getBalanceAttempt());}, 1000);
    setTimeout( () => {dispatch(getStakeInfoAttempt());}, 1000);
    //setTimeout( () => {dispatch(getTicketPriceAttempt());}, 1000);
    setTimeout( () => {dispatch(getAccountsAttempt());}, 1000);
    //setTimeout( () => {dispatch(getPingAttempt());}, 1000);
    //setTimeout( () => {dispatch(getNetworkAttempt());}, 1000);
    //setTimeout( () => {dispatch(getAccountNumberAttempt("default"));}, 1000);
    //setTimeout( () => {dispatch(getTransactionsAttempt(2, 10, '', ''));}, 1000);

    // Check here to see if wallet was just created, if so
    // start rescan from 0
    const { fetchHeadersResponse } = getState().walletLoader;
    if ( fetchHeadersResponse !== null ) {
      console.log(fetchHeadersResponse);
      if (fetchHeadersResponse.fetched_headers_count > 0) {
        setTimeout(() => {dispatch(rescanAttempt(fetchHeadersResponse.first_new_block_height));}, 1000);
      }
    }
    setTimeout(() => {hashHistory.push('/home');}, 1000);
  };
}

export function getWalletServiceAttempt() {
  return (dispatch, getState) => {
    const { getLoaderRequest } = getState().walletLoader;
    dispatch({ type: GETWALLETSERVICE_ATTEMPT });
    dispatch(getWalletServiceAction());
  };
}

function getWalletServiceAction() {
  return (dispatch, getState) => {
    const { address, port } = getState().grpc;
    getWalletService(address, port, function(walletService, err) {
      if (err) {
        dispatch(getWalletServiceError(err + ' Please try again'));
      } else {
        dispatch(getWalletServiceSuccess(walletService));
      }
    });
  };
}

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
    dispatch(getBalanceAction());
  };
}

function getBalanceAction() {
  return (dispatch, getState) => {
    const { walletService, getBalanceRequest } = getState().grpc;
    getBalance(walletService, getBalanceRequest,
        function(getBalanceResponse, err) {
          if (err) {
            dispatch(getBalanceError(err + ' please try again'));
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
  return { getAccountNumberResponse: getAccountNumberResponse, type: GETACCOUNTNUMBER_SUCCESS };
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
    const { walletService } = getState().grpc;
    const { getAccountNumberRequest } = getState().grpc;
    getAccountNumber(walletService, getAccountNumberRequest,
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
    const { walletService } = getState().grpc;
    const { getNetworkRequest } = getState().grpc;
    getNetwork(walletService, getNetworkRequest,
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
    const { walletService } = getState().grpc;
    const { getPingRequest } = getState().grpc;
    getPing(walletService, getPingRequest,
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
    const { walletService } = getState().grpc;
    const { getStakeInfoRequest } = getState().grpc;
    getStakeInfo(walletService, getStakeInfoRequest,
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
    const { walletService } = getState().grpc;
    const { getTicketPriceRequest } = getState().grpc;
    getTicketPrice(walletService, getTicketPriceRequest,
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
  return { response: getAccountsResponse, type: GETACCOUNTS_SUCCESS };
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
    const { walletService } = getState().grpc;
    const { getAccountsRequest } = getState().grpc;
    getAccounts(walletService, getAccountsRequest,
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
    //starting_block_hash: Buffer.from(startHash),
    ending_block_height: endHeight,
    //ending_block_hash: Buffer.from(endHash)
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
    const { walletService } = getState().grpc;
    const { getTransactionsRequest } = getState().grpc;
    getTransactions(walletService, getTransactionsRequest,
        function(getTransactionsResponse, err) {
          if (err) {
            dispatch(getTransactionsError(err + ' Please try again'));
          } else {
            dispatch(getTransactionsSuccess(getTransactionsResponse));
          }
        });
  };
}
