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
    setTimeout( () => {dispatch(getTransactionInfoAttempt());}, 1000);
    //setTimeout( () => {dispatch(getMinedPaginatedTransactions(false))}, 1500);

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
export const GETTRANSACTIONS_PROGRESS = 'GETTRANSACTIONS_PROGRESS';
export const GETTRANSACTIONS_COMPLETE = 'GETTRANSACTIONS_COMPLETE';
export const PAGINATETRANSACTIONS_START = 'PAGINATETRANSACTIONS_START';
export const PAGINATETRANSACTIONS_END = 'PAGINATETRANSACTIONS_END';
export const PAGINATETRANSACTIONS_MORE = 'PAGINATETRANSACTIONS_MORE';
export const PAGINATETRANSACTIONS_UPDATE_END = 'PAGINATETRANSACTIONS_UPDATE_END';

export function getTransactionInfoAttempt() {
  return (dispatch, getState) => {
    const { getAccountsResponse } = getState().grpc;
    var startRequestHeight, endRequestHeight = 0;
    // Check to make sure getAccountsResponse (which has current block height) is available
    if ( getAccountsResponse !== null ) {
      endRequestHeight = getAccountsResponse.getCurrentBlockHeight();
      startRequestHeight = 0;
    } else {
      // Wait a little then re-dispatch this call since we have no starting height yet
      setTimeout( () => {dispatch(getTransactionInfoAttempt());}, 1000);
      return;
    }
    var request = new GetTransactionsRequest();
    request.setStartingBlockHeight(startRequestHeight);
    request.setEndingBlockHeight(endRequestHeight);
    console.log('sending getTransactionsInfo request',startRequestHeight, endRequestHeight);
    dispatch({type: GETTRANSACTIONS_ATTEMPT});
    dispatch(getTransactionsInfo(request));
  };
}

function getTransactionsInfo(request) {
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    getTransactions(walletService, request,
      function(finished, getTransactionsResponse, err) {
        if (err) {
          console.error(err + ' Please try again');
        } else if (finished) {
          dispatch(getTransactionsInfoEnd());
        } else {
          dispatch(getTransactionsInfoProgress(getTransactionsResponse));
        }
      });
  };
}

function getTransactionsInfoProgress(response) {
  return (dispatch) => {
    for (var i = 0; i < response.getMinedTransactions().getTransactionsList().length; i++) {
      var newHeight = response.getMinedTransactions().getHeight();
      var tx = {
        height: newHeight,
        index: i,
      };
      dispatch({tx, type: GETTRANSACTIONS_PROGRESS});
    }
    response = null;
  };
}
function getTransactionsInfoEnd() {
  return (dispatch, getState) => {
    const { transactionsInfo } = getState().grpc;
    console.log(transactionsInfo.length);
    dispatch({type: GETTRANSACTIONS_COMPLETE});
    setTimeout( () => {dispatch(getMinedPaginatedTransactions(1));}, 1500);
  };
}

function paginatedTransactionsProgess(getTransactionsResponse, requestedTxs) {
  return (dispatch, getState) => {
    const { paginatingTxs } = getState().grpc;
    if (!paginatingTxs) {
      return;
    }
    var newTxs = getTransactionsResponse.getMinedTransactions().getTransactionsList();
    var blockHeight = getTransactionsResponse.getMinedTransactions().getHeight();
    for (var i = 0; i < newTxs.length; i++) {
      for (var j = 0; j < requestedTxs.length; j++) {
        // Only add requested tx if it was already included in the previous set
        if (blockHeight == requestedTxs[j].height && i == requestedTxs[j].index)  {
          newTxs[i].timestamp = getTransactionsResponse.getMinedTransactions().getTimestamp();
          newTxs[i].height = getTransactionsResponse.getMinedTransactions().getHeight();
          newTxs[i].index = i;
          dispatch({ tempPaginatedTxs: newTxs[i], type: PAGINATETRANSACTIONS_MORE });
          break;
        }
      }
    }
  };
}

// Once the get transactions call is complete we must check to see if we
// got enough tx to please txPerPage, if not keep looking back until we
// get to 0.
function getMinedPaginatedTransactionsFinished() {
  return { type: PAGINATETRANSACTIONS_END };
}

export function getMinedPaginatedTransactions(pageNumber) {
  return (dispatch, getState) => {
    const { paginatingTxs, txPerPage, transactionsInfo } = getState().grpc;
    if (transactionsInfo.length === 0) {
      return;
    }
    var startRange = transactionsInfo.length - (pageNumber * txPerPage) - 1;
    var endRange = startRange + txPerPage;
    if (startRange < 0) {
      startRange = 0;
    }
    if (endRange >= transactionsInfo.length) {
      endRange = transactionsInfo.length - 1;
    }
    var startBlockHeight = transactionsInfo[startRange].height;
    var endBlockHeight = transactionsInfo[endRange].height;

    if (!paginatingTxs) {
      dispatch({
        currentPage: pageNumber,
        type: PAGINATETRANSACTIONS_START });
    }
    var request = new GetTransactionsRequest();
    request.setStartingBlockHeight(startBlockHeight);
    request.setEndingBlockHeight(endBlockHeight);

    dispatch(getPaginatedTransactions(request, transactionsInfo.slice(startRange,endRange)));
  };
}

function getPaginatedTransactions(request, requestedTxs) {
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    getTransactions(walletService, request,
        function(finished, getTransactionsResponse, err) {
          if (err) {
            console.log(err + ' Please try again');
          } else if (finished) {
            dispatch(getMinedPaginatedTransactionsFinished());
          } else {
            dispatch(paginatedTransactionsProgess(getTransactionsResponse, requestedTxs));
          }
        });
  };
}

export const GETTRANSACTIONDETAILS_SET = 'GETTRANSACTIONDETAILS_SET';
export const GETTRANSACTIONDETAILS_CLEAR = 'GETTRANSACTIONDETAILS_CLEAR';

export function setTransactionDetails(tx) {
  return {tx, type: GETTRANSACTIONDETAILS_SET}
}

export function clearTransactionDetails(tx) {
  return {type: GETTRANSACTIONDETAILS_CLEAR}
}