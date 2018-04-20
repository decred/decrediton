// @flow
import * as wallet from "wallet";
import { getTicketPriceAttempt, updateAccount, getAccountNumbersBalances } from "./ClientActions";
import { newTransactionsReceived } from "./ClientActions";
import { TransactionNotificationsRequest, AccountNotificationsRequest } from "middleware/walletrpc/api_pb";

export const TRANSACTIONNTFNS_START = "TRANSACTIONNTFNS_START";
export const TRANSACTIONNTFNS_FAILED = "TRANSACTIONNTFNS_FAILED";
export const TRANSACTIONNTFNS_END = "TRANSACTIONNTFNS_END";

export const NEWBLOCKCONNECTED = "NEWBLOCKCONNECTED";

function transactionNtfnsData(response) {
  return (dispatch, getState) => {
    const attachedBlocks = response.getAttachedBlocksList();
    const unminedTxList = response.getUnminedTransactionsList();

    // Block was mined
    if (attachedBlocks.length > 0) {
      var currentBlockTimestamp = attachedBlocks[attachedBlocks.length-1].getTimestamp();
      var currentBlockHeight = attachedBlocks[attachedBlocks.length-1].getHeight();
      const { maturingBlockHeights } = getState().grpc;
      dispatch({ currentBlockHeight, currentBlockTimestamp, type: NEWBLOCKCONNECTED });
      setTimeout( () => {dispatch(getTicketPriceAttempt());}, 1000);

      const maturedHeights = Object.keys(maturingBlockHeights).filter(h => h <= currentBlockHeight);
      if (maturedHeights.length > 0) {
        const accountNumbers = maturedHeights.reduce((l, h) => {
          maturingBlockHeights[h].forEach(an => l.indexOf(an) === -1 ? l.push(an) : null);
          return l;
        }, []);
        dispatch(getAccountNumbersBalances(accountNumbers));
      }

      const newlyMined = attachedBlocks.reduce((l, b) => {
        b.getTransactionsList().forEach((t, i) => {
          const tx = wallet.formatTransaction(b, t, i);
          l.push(tx);
        });
        return l;
      }, []);

      const newlyUnmined = unminedTxList.map((t, i) => wallet.formatUnminedTransaction(t, i));
      dispatch(newTransactionsReceived(newlyMined, newlyUnmined));
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
    const { daemon: { hiddenAccounts } } = getState();
    let account = {
      hidden: hiddenAccounts.indexOf(data.getAccountNumber()) > -1,
      accountNumber: data.getAccountNumber(),
      accountName: data.getAccountName(),
      externalKeys: data.getExternalKeyCount(),
      internalKeys: data.getInternalKeyCount(),
      importedKeys: data.getImportedKeyCount()
    };
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
