// @flow
import * as wallet from "wallet";
import { getStakeInfoAttempt,
  getTicketPriceAttempt, getNetworkAttempt, updateAccount } from "./ClientActions";
import { UPDATETIMESINCEBLOCK, newTransactionsReceived } from "./ClientActions";
import { TransactionNotificationsRequest, AccountNotificationsRequest } from "middleware/walletrpc/api_pb";

export const TRANSACTIONNTFNS_START = "TRANSACTIONNTFNS_START";
export const TRANSACTIONNTFNS_FAILED = "TRANSACTIONNTFNS_FAILED";
export const TRANSACTIONNTFNS_DATA = "TRANSACTIONNTFNS_DATA";
export const TRANSACTIONNTFNS_DATA_UNMINED = "TRANSACTIONNTFNS_DATA_UNMINED";
export const TRANSACTIONNTFNS_DATA_UNMINED_UPDATE = "TRANSACTIONNTFNS_DATA_UNMINED_UPDATE";
export const TRANSACTIONNTFNS_SYNCING = "TRANSACTIONNTFNS_SYNCING";
export const TRANSACTIONNTFNS_END = "TRANSACTIONNTFNS_END";

function transactionNtfnsData(response) {
  return (dispatch, getState) => {
    const { neededBlocks } = getState().walletLoader;
    var currentHeight = 0;
    var { recentBlockTimestamp } = getState().grpc;
    const attachedBlocks = response.getAttachedBlocksList();
    const unminedTxList = response.getUnminedTransactionsList();

    if (attachedBlocks.length > 0) {
      currentHeight = attachedBlocks[0].getHeight();
      if (currentHeight > neededBlocks) {
        var lastBlockTimestamp = attachedBlocks[attachedBlocks.length-1].getTimestamp();
        var recentBlockTime = recentBlockTimestamp ? new Date(recentBlockTimestamp*1000) : new Date(lastBlockTimestamp*1000);
        var seconds = Math.floor((new Date() - recentBlockTime) / 1000);

        if (lastBlockTimestamp !== recentBlockTimestamp) {
          dispatch({recentBlockTimestamp: lastBlockTimestamp, type: UPDATETIMESINCEBLOCK });
        }

        // Only request other wallet information if it is within 30 minutes.
        // 60 * 30 == 30 minutes worth of seconds
        if (seconds < 60 * 30) {
          dispatch({response: response, type: TRANSACTIONNTFNS_DATA });
          setTimeout( () => {dispatch(getStakeInfoAttempt());}, 1000);
          setTimeout( () => {dispatch(getTicketPriceAttempt());}, 1000);
          setTimeout( () => {dispatch(getNetworkAttempt());}, 1000);

          const newlyMined = attachedBlocks.reduce((l, b) => {
            b.getTransactionsList().forEach((t, i) => {
              const tx = wallet.formatTransaction(b, t, i);
              l.push(tx);
            });
            return l;
          }, []);

          const newlyUnmined = unminedTxList.map((t, i) => wallet.formatUnminedTransaction(t, i));

          dispatch(newTransactionsReceived(newlyMined, newlyUnmined));
        } else if (attachedBlocks[attachedBlocks.length-1].getHeight()%100 == 0) {
          dispatch({response: response, type: TRANSACTIONNTFNS_DATA });
        }
      } else if (currentHeight%100 == 0) {
        var syncedToTimestamp = response.getAttachedBlocksList()[0].getTimestamp();
        dispatch({
          currentHeight: currentHeight,
          syncedToTimestamp: syncedToTimestamp,
          type: TRANSACTIONNTFNS_SYNCING });
      }
    } else if (unminedTxList.length > 0) {
      const newlyUnmined = unminedTxList.map((t, i) => wallet.formatUnminedTransaction(t, i));
      dispatch(newTransactionsReceived([], newlyUnmined));
    }
  };
}

export const transactionNtfnsStart = () => (dispatch, getState) => {
  var request = new TransactionNotificationsRequest();
  const { walletService } = getState().grpc;
  let transactionNtfns = walletService.transactionNotifications(request);
  dispatch({ transactionNtfns, type: TRANSACTIONNTFNS_START });
  transactionNtfns.on("data", data => dispatch(transactionNtfnsData(data)));
  transactionNtfns.on("end", () => {
    console.log("Transaction notifications done");
    dispatch({ type: TRANSACTIONNTFNS_END });
  });
  transactionNtfns.on("error", error => {
    if (!String(error).includes("Cancelled")) console.error("Transactions ntfns error received:", error);
    dispatch({ type: TRANSACTIONNTFNS_END });
  });
};

export const ACCOUNTNTFNS_START = "ACCOUNTNTFNS_START";
export const ACCOUNTNTFNS_END = "ACCOUNTNTFNS_END";

export const accountNtfnsStart = () => (dispatch, getState) => {
  var request = new AccountNotificationsRequest();
  const { walletService } = getState().grpc;
  let accountNtfns = walletService.accountNotifications(request);
  dispatch({ accountNtfns, type: ACCOUNTNTFNS_START });
  accountNtfns.on("data", data => {
    let account = {accountNumber: data.getAccountNumber(), accountName: data.getAccountName(), externalKeys: data.getExternalKeyCount(), internalKeys: data.getInternalKeyCount(), importedKeys: data.getImportedKeyCount()};
    dispatch(updateAccount(account));
  });
  accountNtfns.on("end", () => {
    console.log("Account notifications done");
    dispatch({ type: ACCOUNTNTFNS_END });
  });
  accountNtfns.on("error", error => {
    if (!String(error).includes("Cancelled")) console.error("Account ntfns error received:", error);
    dispatch({ type: ACCOUNTNTFNS_END });
  });
};

export const stopNotifcations = () => (dispatch, getState) => {
  const { transactionNtfns, accountNtfns } = getState().notifications;
  if (transactionNtfns) transactionNtfns.cancel();
  if (accountNtfns) accountNtfns.cancel();
};

export const CLEARUNMINEDMESSAGE = "CLEARUNMINEDMESSAGE";
export const clearNewUnminedMessage = () => ({ type: CLEARUNMINEDMESSAGE });
