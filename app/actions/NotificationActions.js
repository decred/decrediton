import { transactionNtfs, spentnessNtfs, accountNtfs } from '../middleware/grpc/client';
import { getAccountsAttempt, getBalanceAttempt, getStakeInfoAttempt,
  getTicketPriceAttempt, getNetworkAttempt } from './ClientActions';
import { timeBackString } from '../helpers/dateFormat.js';
import { TransactionNotificationsRequest, SpentnessNotificationsRequest, AccountNotificationsRequest} from '../middleware/walletrpc/api_pb';

export const TRANSACTIONNTFNS_START = 'TRANSACTIONNTFNS_START';
export const TRANSACTIONNTFNS_FAILED = 'TRANSACTIONNTFNS_FAILED';
export const TRANSACTIONNTFNS_DATA = 'TRANSACTIONNTFNS_DATA';
export const TRANSACTIONNTFNS_SYNCING = 'TRANSACTIONNTFNS_SYNCING';
export const TRANSACTIONNTFNS_END = 'TRANSACTIONNTFNS_END';

function transactionNtfnsData(response) {
  return (dispatch, getState) => {
    const { neededBlocks } = getState().walletLoader;

    var currentHeight = 0;
    if (response.getAttachedBlocksList().length > 0) {
      currentHeight = response.getAttachedBlocksList()[0].getHeight();
    }
    if (currentHeight > neededBlocks) {
      const attachedBlocks = response.getAttachedBlocksList();
      var recentBlockTime = new Date(attachedBlocks[attachedBlocks.length-1].getTimestamp()*1000);
      var seconds = Math.floor((new Date() - recentBlockTime) / 1000);
      // Only request other wallet information if it is within 2 hours.
      // 3600 * 2 == 2 hours worth of seconds
      if (seconds < 3600 * 2) {
        dispatch({response: response, type: TRANSACTIONNTFNS_DATA });
        setTimeout( () => {dispatch(getBalanceAttempt());}, 1000);
        setTimeout( () => {dispatch(getStakeInfoAttempt());}, 1000);
        setTimeout( () => {dispatch(getTicketPriceAttempt());}, 1000);
        setTimeout( () => {dispatch(getAccountsAttempt());}, 1000);
        setTimeout( () => {dispatch(getNetworkAttempt());}, 1000);
      } else if (attachedBlocks[attachedBlocks.length-1].getHeight()%100 == 0) {
        dispatch({response: response, type: TRANSACTIONNTFNS_DATA });
      }
    } else if (currentHeight%100 == 0) {
      const { blocksPerDay } = getState().notifications;
      var daysBack = Math.floor((neededBlocks - currentHeight) / blocksPerDay);
      dispatch({currentHeight: currentHeight, timeBackString: timeBackString(daysBack), type: TRANSACTIONNTFNS_SYNCING });
    }
  };
}

export function transactionNtfnsStart() {
  var request = new TransactionNotificationsRequest();
  return (dispatch) => {
    dispatch({request: request, type: TRANSACTIONNTFNS_START });
    dispatch(startTransactionNtfns());
  };
}

export function transactionNtfnsEnd() {
  var request = {};
  return (dispatch) => {
    dispatch({request: request, type: TRANSACTIONNTFNS_END });
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

export const SPENTNESSNTFNS_START = 'SPENTNESSNTFNS_START';
export const SPENTNESSNTFNS_FAILED = 'SPENTNESSNTFNS_FAILED';
export const SPENTNESSNTFNS_DATA = 'SPENTNESSNTFNS_DATA';
export const SPENTNESSNTFNS_END = 'SPENTNESSNTFNS_END';

function spentnessNtfnsData(response) {
  console.log("spentnessNtfnsData", response);
  //return { response: response, type: SPENTNESSNTFNS_DATA };
}

export function spentnessNtfnsStart(accountNum) {
  var request = new SpentnessNotificationsRequest();
  request.setAccount(accountNum);
  request.setNoNotifyUnspent(false);
  request.setNoNotifySpent(false);
  return (dispatch) => {
    dispatch({request: request, type: SPENTNESSNTFNS_START });
    dispatch(startSpentnessNtfns());
  };
}

export function spentnessNtfnsEnd() {
  var request = {};
  return (dispatch) => {
    dispatch({request: request, type: SPENTNESSNTFNS_END });
    //
  };
}

function startSpentnessNtfns() {
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    const { spentnessNtfnsRequest } = getState().notifications;
    spentnessNtfs(walletService, spentnessNtfnsRequest,
      function(data) {
        dispatch(spentnessNtfnsData(data));
      }
    );
  };
}

export const ACCOUNTNTFNS_START = 'ACCOUNTNTFNS_START';
export const ACCOUNTNTFNS_FAILED = 'ACCOUNTNTFNS_FAILED';
export const ACCOUNTNTFNS_DATA = 'ACCOUNTNTFNS_DATA';
export const ACCOUNTNTFNS_END = 'ACCOUNTNTFNS_END';

function accountNtfnsData(response) {
  console.log("accountNtfns", response);
  //return { response: response, type: ACCOUNTNTFNS_DATA };
}

export function accountNtfnsStart() {
  var request = new AccountNotificationsRequest();
  return (dispatch) => {
    dispatch({request: request, type: ACCOUNTNTFNS_START });
    dispatch(startAccountNtfns());
  };
}

export function accountNtfnsEnd() {
  var request = {};
  return (dispatch) => {
    dispatch({request: request, type: ACCOUNTNTFNS_END });
    //
  };
}

function startAccountNtfns() {
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    const { accountNtfnsRequest } = getState().notifications;
    accountNtfs(walletService, accountNtfnsRequest,
      function(data) {
        dispatch(accountNtfnsData(data));
      }
    );
  };
}
