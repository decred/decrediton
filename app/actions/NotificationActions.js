import { wallet } from "wallet-preload-shim";
import {
  getTicketPriceAttempt,
  updateAccount,
  getAccountNumbersBalances,
  getBalanceUpdateAttempt
} from "./ClientActions";
import { newTransactionsReceived } from "./TransactionActions";
import { stopAccountMixer } from "./AccountMixerActions";
import * as sel from "selectors";
import { MIN_RELAY_FEE_ATOMS, MIN_MIX_DENOMINATION_ATOMS } from "constants";

export const TRANSACTIONNTFNS_START = "TRANSACTIONNTFNS_START";
export const TRANSACTIONNTFNS_FAILED = "TRANSACTIONNTFNS_FAILED";
export const TRANSACTIONNTFNS_END = "TRANSACTIONNTFNS_END";

export const NEWBLOCKCONNECTED = "NEWBLOCKCONNECTED";

// transactionNtfnsDataHandler builds the handler for transaction notifications.
// Note that this is inverted from the usual redux idiom of using
// dispatch(transactionNtfnsDataHandler(data)). Instead,
// transactionNtfnsDataHandler is closed over (dispatch, getState) and returns
// a function that is to be called directly by the transaction notification data
// stream. This is done for performance reasons, as it allows the top level
// function (transactionNtfnsDataHandler) to create a local state which
// the child (anonymous) function closes over to buffer the notifications so
// that on a heavily used wallet, where a large number of notifications is
// received in a short period of time after a new block is connected, only a
// single global state change is dispatched instead of many individual changes.
const transactionNtfnsDataHandler = () => (dispatch, getState) => {
  let ntfTimer;
  let newlyMined = [];
  let newlyUnmined = [];
  let newlyMinedMap = {};
  let newlyUnminedMap = {};
  let currentBlockHeight, currentBlockTimestamp;

  // alertNewlyReceived is the function that actually sends the state update to
  // redux, triggering all calculations.
  const alertNewlyReceived = async () => {
    ntfTimer = null;

    const mined = newlyMined;
    const unmined = newlyUnmined;
    newlyMined = [];
    newlyUnmined = [];
    newlyMinedMap = {};
    newlyUnminedMap = {};

    if (currentBlockHeight) {
      const { maturingBlockHeights, accountMixerRunning } = getState().grpc;
      dispatch({
        currentBlockHeight,
        currentBlockTimestamp,
        type: NEWBLOCKCONNECTED
      });
      dispatch(getTicketPriceAttempt());

      const maturedHeights = Object.keys(maturingBlockHeights).filter(
        (h) => h <= currentBlockHeight
      );
      if (maturedHeights.length > 0) {
        const accountNumbers = maturedHeights.reduce((l, h) => {
          maturingBlockHeights[h].forEach((an) =>
            l.indexOf(an) === -1 ? l.push(an) : null
          );
          return l;
        }, []);
        dispatch(getAccountNumbersBalances(accountNumbers));
      }

      currentBlockHeight = null;
      currentBlockTimestamp = null;

      if (accountMixerRunning) {
        const changeAccount = sel.getChangeAccount(getState());
        const { spendable } = await dispatch(
          getBalanceUpdateAttempt(changeAccount, 0)
        );

        if (spendable < MIN_RELAY_FEE_ATOMS + MIN_MIX_DENOMINATION_ATOMS) {
          dispatch(stopAccountMixer());
        }
      }
    }

    dispatch(newTransactionsReceived(mined, unmined));
  };

  // addToOutstandingTxs adds the received (mined, unmined) txs to the list of
  // outstanding (newlyMined, newlyUnmined) txs that will be notified to the app
  // and resets the notification timer.
  const addToOutstandingTxs = (mined, unmined) => {
    if (ntfTimer) {
      clearTimeout(ntfTimer);
      ntfTimer = null;
    }

    unmined.forEach((tx) => {
      if (!newlyUnminedMap[tx.txHash]) {
        newlyUnmined.push(tx);
        newlyUnminedMap[tx.txHash] = tx;
      }
    });

    mined.forEach((tx) => {
      if (!newlyMinedMap[tx.txHash]) {
        newlyMined.push(tx);
      }
      if (newlyUnminedMap[tx.txHash]) {
        // remove from txs that have already been mined from the unmined list
        delete newlyUnminedMap[tx.txHash];
        const i = newlyUnmined.findIndex((v) => tx.txHash === v.txHash);
        i > -1 && newlyUnmined.splice(i, 1);
      }
    });

    ntfTimer = setTimeout(alertNewlyReceived, 5000);
  };

  // this is the actual function that is repeatedly called by the transaction
  // notification data stream
  return (response) => {
    const attachedBlocks = response.attachedBlocks;
    const unmined = response.unminedTransactions;

    // Block was mined
    if (attachedBlocks.length > 0) {
      currentBlockTimestamp =
        attachedBlocks[attachedBlocks.length - 1].timestamp;
      currentBlockHeight = attachedBlocks[attachedBlocks.length - 1].height;

      const mined = [];
      attachedBlocks.forEach((b) =>
        b.transactions.forEach((tx) => mined.push(tx))
      );

      addToOutstandingTxs(mined, unmined);
    } else if (unmined.length > 0) {
      addToOutstandingTxs([], unmined);
    }
  };
};

export const transactionNtfnsStart = () => async (dispatch, getState) => {
  const { walletService } = getState().grpc;
  const transactionNtfns = await wallet.transactionNotifications(walletService);
  dispatch({ transactionNtfns, type: TRANSACTIONNTFNS_START });
  transactionNtfns.on("data", dispatch(transactionNtfnsDataHandler()));
  transactionNtfns.on("end", () => {
    dispatch({ type: TRANSACTIONNTFNS_END });
  });
  transactionNtfns.on("error", (error) => {
    if (!String(error).includes("Cancelled"))
      console.error("Transactions ntfns error received:", error);
    dispatch({ type: TRANSACTIONNTFNS_END });
  });
};

export const ACCOUNTNTFNS_START = "ACCOUNTNTFNS_START";
export const ACCOUNTNTFNS_END = "ACCOUNTNTFNS_END";

export const accountNtfnsStart = () => async (dispatch, getState) => {
  const { walletService } = getState().grpc;
  const accountNtfns = await wallet.accountNotifications(walletService);
  dispatch({ accountNtfns, type: ACCOUNTNTFNS_START });
  accountNtfns.on("data", (data) => {
    const {
      daemon: { hiddenAccounts }
    } = getState();
    const account = {
      hidden: hiddenAccounts.indexOf(data.accountNumber) > -1,
      accountNumber: data.accountNumber,
      accountName: data.accountName,
      externalKeys: data.externalKeyCount,
      internalKeys: data.internalKeyCount,
      importedKeys: data.importedKeyCount
    };
    dispatch(updateAccount(account));
  });
  accountNtfns.on("end", () => {
    dispatch({ type: ACCOUNTNTFNS_END });
  });
  accountNtfns.on("error", (error) => {
    if (!String(error).includes("Cancelled"))
      console.error("Account ntfns error received:", error);
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
