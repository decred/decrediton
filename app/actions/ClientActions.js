import { getWalletService, getBalance, getAccountNumber, getNetwork, getPing,
  getStakeInfo, getTicketPrice, getAccounts, getTransactions } from '../middleware/grpc/client';
import { getNextAddressAttempt, loadActiveDataFiltersAttempt, rescanAttempt } from './ControlActions';
import { transactionNftnsStart } from './NotificationActions';
export const GETWALLETSERVICE_ATTEMPT = 'GETWALLETSERVICE_ATTEMPT';
export const GETWALLETSERVICE_FAILED = 'GETWALLETSERVICE_FAILED';
export const GETWALLETSERVICE_SUCCESS = 'GETWALLETSERVICE_SUCCESS';
import { hashHistory } from 'react-router';
import { PingRequest, NetworkRequest, AccountNumberRequest,AccountsRequest,
BalanceRequest, GetTransactionsRequest, TicketPriceRequest, StakeInfoRequest } from '../middleware/walletrpc/api_pb';
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
    setTimeout( () => {dispatch(getTicketPriceAttempt());}, 1000);
    setTimeout( () => {dispatch(getAccountsAttempt());}, 1000);
    setTimeout( () => {dispatch(getPingAttempt());}, 1000);
    setTimeout( () => {dispatch(getNetworkAttempt());}, 1000);
    //setTimeout( () => {dispatch(getAccountNumberAttempt("default"));}, 1000);

    setTimeout( () => {dispatch(getMinedPaginatedTransactions(false))}, 1500);

    // Check here to see if wallet was just created from an existing
    // seed.  If it was created from a newly generated seed there is no
    // expectation of address use so rescan can be skipped.
    setTimeout( () => {dispatch(transactionNftnsStart());}, 1000);
    const { walletCreateExisting } = getState().walletLoader;
    if ( walletCreateExisting ) {
      setTimeout(() => {dispatch(rescanAttempt(0));}, 1000);
    }
    setTimeout(() => {hashHistory.push('/home');}, 1000);
  };
}

export function getWalletServiceAttempt() {
  return (dispatch) => {
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
  var request = new BalanceRequest();
  request.setAccountNumber(accountNumber);
  request.setRequiredConfirmations(requiredConfs);
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
  var request = new AccountNumberRequest();
  request.setAccountName(accountName);
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
  var request = new NetworkRequest();
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
  return (dispatch) => {
    dispatch({error, type: GETPING_FAILED });
    setTimeout(() => {hashHistory.push('/walletError');}, 1000);
  };
}

function getPingSuccess(getPingResponse) {
  return (dispatch) => {
    setTimeout( () => {dispatch(getPingAttempt());}, 10000);
    dispatch({getPingResponse: getPingResponse, type: GETPING_SUCCESS });
  };
}

export function getPingAttempt() {
  var request = new PingRequest();
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
  var request = new StakeInfoRequest();
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
  var request = new TicketPriceRequest();
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
  var request = new AccountsRequest();
  return (dispatch) => {
    dispatch({
      request: request,
      type: GETACCOUNTS_ATTEMPT });
    dispatch(accounts());
  };
}

function accounts() {
  var request = new AccountsRequest();
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    getAccounts(walletService, request,
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
export const GETTRANSACTIONS_MINED_PROGRESS = 'GETTRANSACTIONS_MINED_PROGRESS';
export const GETTRANSACTIONS_UNMINED_PROGRESS = 'GETTRANSACTIONS_UNMINED_PROGRESS';
export const GETTRANSACTIONS_COMPLETE = 'GETTRANSACTIONS_COMPLETE';
export const PAGINATETRANSACTIONS_START = 'PAGINATETRANSACTIONS_START';
export const PAGINATETRANSACTIONS_END = 'PAGINATETRANSACTIONS_END';
export const PAGINATETRANSACTIONS_MORE = 'PAGINATETRANSACTIONS_MORE';
export const PAGINATETRANSACTIONS_UPDATE_END = 'PAGINATETRANSACTIONS_UPDATE_END';

function paginatedTransactionsProgess(getTransactionsResponse) {
  return (dispatch, getState) => {
    const { tempPaginatedTxs, txPerPage, paginatingTxs } = getState().grpc;
    if (!paginatingTxs) {
      return;
    }
    var neededTxs = txPerPage - tempPaginatedTxs.length;
    var newTxs = getTransactionsResponse.getMinedTransactions().getTransactionsList();
    // Need less transactions than what we got, so stop it after the number we need
    // then close the request.
    console.log("new txs have arrived: previousLength ", tempPaginatedTxs.length);
    console.log("new txs have arrived: newTxsLength ", newTxs.length);
    console.log("new txs have arrived: needed ", neededTxs);
    if (neededTxs <= newTxs.length) {
      tempPaginatedTxs.push(newTxs.slice(0,neededTxs));
      dispatch({ paginatedTxs: tempPaginatedTxs, type: PAGINATETRANSACTIONS_END });
    } else {
      // Transactions can just be appended here
      dispatch({ tempPaginatedTxs: newTxs, type: PAGINATETRANSACTIONS_MORE });
    }
  }
}

// Once the get transactions call is complete we must check to see if we 
// got enough tx to please txPerPage, if not keep looking back until we 
// get to 0.
function getMinedPaginatedTransactionsCheck() {
  return (dispatch, getState) => {
    const { paginatingTxs, lookForward } = getState().grpc;
    if (paginatingTxs) {
      console.log("getting more txs. current length:", paginatingTxs.length);
      // Still need to get more transactions
      dispatch(getMinedPaginatedTransactions(lookForward));
    }
  };
}

export function getMinedPaginatedTransactions(forward) {
  return (dispatch, getState) => {
    const { paginatingTxs, txLookBack, lookForward, startHeight, endHeight, getAccountsResponse } = getState().grpc;
    if (!paginatingTxs) {
      var startRequestHeight, endRequestHeight = 0;
      // On startup endHeight will be 0.
      // After the first successful paginated reqeuest it will hold where we left off while getting transactions.
      if ( endHeight === 0 ) {
        // Check to make sure getAccountsResponse (which has current block height) is available
        if ( getAccountsResponse !== null ) {
          endRequestHeight = getAccountsResponse.getCurrentBlockHeight();
          startRequestHeight = endRequestHeight - txLookBack;
        } else {
          // Wait a little then re-dispatch this call since we have no starting height yet
          setTimeout( () => {dispatch(getMinedPaginatedTransactions(forward));}, 1000);
          return;
        }
      } else {
        // Check if we want to look forward or backward
        if (!forward) {
          // Subtract 1 from end height so we don't overlap
          endRequestHeight = endHeight - 1;
          startRequestHeight = endRequestHeight - txLookBack;
        } else {
          // Add 1 to start height so we don't overlap
          startRequestHeight = endHeightTxHistory + 1;
          endRequestHeight = startRequestHeight + txLookBack;
        }
      }
      dispatch({
        endHeight: endRequestHeight,
        lookForward: forward,
        type: PAGINATETRANSACTIONS_START });
    } else {
      dispatch({
        endHeight: endRequestHeight,
        type: PAGINATETRANSACTIONS_UPDATE_END });
    }
    var request = new GetTransactionsRequest();
    request.setStartingBlockHeight(startRequestHeight);
    request.setEndingBlockHeight(endRequestHeight);

    dispatch(getPaginatedTransactions(request));
  };
}

function getPaginatedTransactions(request) {
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    getTransactions(walletService, request,
        function(finished, getTransactionsResponse, err) {
          if (err) {
            dispatch(getTransactionsError(err + ' Please try again'));
          } else if (finished) {
            dispatch(getMinedPaginatedTransactionsCheck());
          } else {
            dispatch(paginatedTransactionsProgess(getTransactionsResponse));
          }
        });
  };
}