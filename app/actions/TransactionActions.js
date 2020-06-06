import * as wallet from "wallet";
import * as sel from "selectors";
import eq from "lodash/fp/eq";
import { getStakeInfoAttempt, getBalanceUpdateAttempt } from "./ClientActions";
import { TransactionDetails } from "middleware/walletrpc/api_pb";
import { getStartupStats } from "./StatisticsActions";
import { hexToBytes, strHashToRaw } from "helpers";
import { RECENT_TX_COUNT, BATCH_TX_COUNT, DESC } from "constants";
import { TICKET, VOTE, VOTED, REVOKED } from "constants/Decrediton";
export const { TRANSACTION_TYPES } = wallet;

export const GETTRANSACTIONS_CANCEL = "GETTRANSACTIONS_CANCEL";
export const cancelGetTransactions = () => (dispatch) =>
  dispatch({ type: GETTRANSACTIONS_CANCEL });

function checkAccountsToUpdate(txs, accountsToUpdate) {
  txs.forEach((tx) => {
    tx.tx.getCreditsList().forEach((credit) => {
      if (accountsToUpdate.find(eq(credit.getAccount())) === undefined)
        accountsToUpdate.push(credit.getAccount());
    });
    tx.tx.getDebitsList().forEach((debit) => {
      if (accountsToUpdate.find(eq(debit.getPreviousAccount())) === undefined)
        accountsToUpdate.push(debit.getPreviousAccount());
    });
  });
  return accountsToUpdate;
}

function checkForStakeTransactions(txs) {
  let stakeTxsFound = false;
  txs.forEach((tx) => {
    if (tx.isStake) {
      stakeTxsFound = true;
      return;
    }
  });
  return stakeTxsFound;
}

const divideTransactions = (transactions) => {
  const stakeTransactions = transactions.reduce((m, t) => {
    t.isStake ? (m[t.txHash] = t) : null;
    return m;
  }, {});
  const regularTransactions = transactions.reduce((m, t) => {
    !t.isStake ? (m[t.txHash] = t) : null;
    return m;
  }, {});

  return { stakeTransactions, regularTransactions };
};

export const NEW_TRANSACTIONS_RECEIVED = "NEW_TRANSACTIONS_RECEIVED";
export const MATURINGHEIGHTS_CHANGED = "MATURINGHEIGHTS_CHANGED";

// newTransactionsReceived should be called when a new set of transactions has
// been received from the wallet (through a notification).
export const newTransactionsReceived = (
  newlyMinedTransactions,
  newlyUnminedTransactions
) => async (dispatch, getState) => {
  if (!newlyMinedTransactions.length && !newlyUnminedTransactions.length)
    return;
  let {
    unminedTransactions,
    recentRegularTransactions,
    recentStakeTransactions
  } = getState().grpc;
  const { walletService, maturingBlockHeights } = getState().grpc;
  const chainParams = sel.chainParams(getState());
  newlyUnminedTransactions = await normalizeBatchTx(
    walletService,
    chainParams,
    newlyUnminedTransactions
  );
  newlyMinedTransactions = await normalizeBatchTx(
    walletService,
    chainParams,
    newlyMinedTransactions
  );

  const transactions = [];
  transactions.push(...newlyUnminedTransactions);
  transactions.push(...newlyMinedTransactions);

  // aux maps of [txhash] => tx (used to ensure no duplicate txs)
  const newlyMinedMap = newlyMinedTransactions.reduce((m, v) => {
    m[v.txHash] = v;
    return m;
  }, {});
  const newlyUnminedMap = newlyUnminedTransactions.reduce((m, v) => {
    m[v.txHash] = v;
    return m;
  }, {});

  let accountsToUpdate = new Array();
  accountsToUpdate = checkAccountsToUpdate(
    newlyUnminedTransactions,
    accountsToUpdate
  );
  accountsToUpdate = checkAccountsToUpdate(
    newlyMinedTransactions,
    accountsToUpdate
  );
  accountsToUpdate = Array.from(new Set(accountsToUpdate));
  accountsToUpdate.forEach((v) => dispatch(getBalanceUpdateAttempt(v, 0)));

  const hasStakeTxs =
    checkForStakeTransactions(newlyUnminedTransactions) ||
    checkForStakeTransactions(newlyMinedTransactions);
  if (hasStakeTxs) {
    dispatch(getStakeInfoAttempt());
  }

  unminedTransactions = [
    ...newlyUnminedTransactions,
    ...unminedTransactions.filter(
      (tx) => !newlyMinedMap[tx.txHash] && !newlyUnminedMap[tx.txHash]
    )
  ];

  recentRegularTransactions = [
    ...unminedTransactions,
    ...newlyMinedTransactions,
    ...recentRegularTransactions.filter(
      (tx) => !newlyMinedMap[tx.txHash] && !newlyUnminedMap[tx.txHash]
    )
  ].filter((tx) => !tx.isStake);

  recentStakeTransactions = [
    ...unminedTransactions,
    ...newlyMinedTransactions,
    ...recentStakeTransactions.filter(
      (tx) => !newlyMinedMap[tx.txHash] && !newlyUnminedMap[tx.txHash]
    )
  ].filter((tx) => tx.isStake);

  const newMaturingHeights = { ...maturingBlockHeights };
  const mergeNewMaturingHeights = (hs) =>
    Object.keys(hs).forEach((h) => {
      const accounts = newMaturingHeights[h] || [];
      hs[h].forEach((a) =>
        accounts.indexOf(a) === -1 ? accounts.push(a) : null
      );
      newMaturingHeights[h] = accounts;
    });

  mergeNewMaturingHeights(
    transactionsMaturingHeights(newlyMinedTransactions, chainParams)
  );
  dispatch({
    maturingBlockHeights: newMaturingHeights,
    type: MATURINGHEIGHTS_CHANGED
  });

  const { stakeTransactions, regularTransactions } = divideTransactions(
    transactions
  );
  dispatch({
    recentRegularTransactions,
    recentStakeTransactions,
    type: NEW_TRANSACTIONS_RECEIVED,
    unminedTransactions,
    newlyUnminedTransactions,
    newlyMinedTransactions,
    stakeTransactions,
    regularTransactions
  });

  if (newlyMinedTransactions.length > 0) {
    const {
      startupStatsEndCalcTime,
      startupStatsCalcSeconds
    } = getState().statistics;
    const secFromLastStats = (new Date() - startupStatsEndCalcTime) / 1000;
    if (secFromLastStats > 5 * startupStatsCalcSeconds) {
      dispatch(getStartupStats());
    }
  }
};

export const CHANGE_TRANSACTIONS_FILTER = "CHANGE_TRANSACTIONS_FILTER";
export const changeTransactionsFilter = (newFilter) => (dispatch, getState) =>
  new Promise((resolve) => {
    const {
      transactionsFilter: { listDirection }
    } = getState().grpc;
    let { regularTransactions, getRegularTxsAux } = getState().grpc;
    // If list direction changes (from asc to desc or vice versa), we need to
    // clean txs, otherwise the UI gets buggy with infinite scroll.
    if (listDirection !== newFilter.listDirection) {
      regularTransactions = {};
      getRegularTxsAux = {
        noMoreTransactions: false,
        lastTransaction: null
      };
    }
    dispatch({
      transactionsFilter: newFilter,
      regularTransactions,
      getRegularTxsAux,
      type: CHANGE_TRANSACTIONS_FILTER
    });
    resolve();
  });

export const CHANGE_TICKETS_FILTER = "CHANGE_TICKETS_FILTER";
export const changeTicketsFilter = (newFilter) => (dispatch, getState) =>
  new Promise((resolve) => {
    const {
      transactionsFilter: { listDirection }
    } = getState().grpc;
    let { stakeTransactions, getStakeTxsAux } = getState().grpc;
    // If list direction changes (from asc to desc or vice versa), we need to
    // clean txs, otherwise the UI gets buggy with infinite scroll.
    if (listDirection !== newFilter.listDirection) {
      stakeTransactions = {};
      getStakeTxsAux = {
        noMoreTransactions: false,
        lastTransaction: null
      };
    }
    dispatch({
      ticketsFilter: newFilter,
      stakeTransactions,
      getStakeTxsAux,
      type: CHANGE_TICKETS_FILTER
    });
    resolve();
  });

export const GETSTARTUPTRANSACTIONS_ATTEMPT = "GETSTARTUPTRANSACTIONS_ATTEMPT";
export const GETSTARTUPTRANSACTIONS_SUCCESS = "GETSTARTUPTRANSACTIONS_SUCCESS";

// getStartupTransactions fetches all recent transaction data needed for display
// and updates. This includes:
// - Recent regular tx data
// - Recent stake tx data
// - Immature future blocks (when we should update balances)
// - Transactions since last start
export const getStartupTransactions = () => async (dispatch, getState) => {
  dispatch({ type: GETSTARTUPTRANSACTIONS_ATTEMPT });

  const { currentBlockHeight, walletService } = getState().grpc;
  const chainParams = sel.chainParams(getState());
  let startRequestHeight = currentBlockHeight;
  const pageSize = 50;
  const voteTypes = [
    TransactionDetails.TransactionType.VOTE,
    TransactionDetails.TransactionType.REVOCATION
  ];
  const checkHeightDeltas = [
    chainParams.TicketMaturity,
    chainParams.CoinbaseMaturity,
    chainParams.SStxChangeMaturity
  ];
  const immatureHeight = currentBlockHeight - Math.max(...checkHeightDeltas);

  let foundNeededTransactions = false;
  const recentRegularTxs = [];
  const recentStakeTxs = [];
  // maturingBlockHeights are kept to check when having new blocks if we need
  // to update account's balances.
  const maturingBlockHeights = {};
  const votedTickets = {}; // aux map of ticket hash => true
  const transactions = [];

  // the mergeXXX functions pick a list of transactions returned from
  // getTransactions and fills the appropriate result variables
  const mergeRegularTxs = (txs) =>
    recentRegularTxs.length < RECENT_TX_COUNT &&
    recentRegularTxs.push(...txs.filter((tx) => !tx.isStake));

  const mergeStakeTxs = (txs) =>
    recentStakeTxs.length < RECENT_TX_COUNT &&
    recentStakeTxs.push(
      ...txs.filter((tx) => {
        if (voteTypes.indexOf(tx.type) > -1) {
          // always include vote or revocation and mark ticket as voted so we
          // don't include it in the recent list
          const decodedSpender = wallet.decodeRawTransaction(
            Buffer.from(tx.tx.getTransaction()),
            chainParams
          );
          const spenderInputs = decodedSpender.inputs;
          const ticketHash = spenderInputs[spenderInputs.length - 1].prevTxId;
          votedTickets[ticketHash] = true;
          return true;
        }
        if (tx.type === TransactionDetails.TransactionType.TICKET_PURCHASE) {
          // tickets are only added to the recent list if they haven't voted yet
          return !votedTickets[tx.txHash];
        }
        return false;
      })
    );

  const mergeImmatureHeights = (txs) => {
    if (startRequestHeight < immatureHeight) return;
    const txHeights = transactionsMaturingHeights(txs, chainParams);
    Object.keys(txHeights).forEach((h) => {
      if (h < currentBlockHeight) return;
      const accounts = maturingBlockHeights[h] || [];
      txHeights[h].forEach((a) =>
        accounts.indexOf(a) === -1 ? accounts.push(a) : null
      );
      maturingBlockHeights[h] = accounts;
    });
  };

  // get any unmined transactions
  let { unmined } = await wallet.getTransactions(
    walletService,
    -1,
    -1,
    pageSize
  );
  unmined = await normalizeBatchTx(walletService, chainParams, unmined);
  transactions.push(...unmined);

  mergeRegularTxs(unmined);
  mergeStakeTxs(unmined);
  mergeImmatureHeights(unmined);

  while (!foundNeededTransactions) {
    let { mined } = await wallet.getTransactions(
      walletService,
      startRequestHeight,
      1,
      pageSize
    );
    mined = await normalizeBatchTx(walletService, chainParams, mined);
    // make transactions map
    transactions.push(...mined);

    if (mined.length === 0) {
      // TODO dispatch nomoretransactions to selector
      break; // no more transactions
    }

    mergeRegularTxs(mined);
    mergeStakeTxs(mined);
    mergeImmatureHeights(mined);

    foundNeededTransactions =
      recentRegularTxs.length >= RECENT_TX_COUNT &&
      recentStakeTxs.length >= RECENT_TX_COUNT;

    const lastTransaction = mined[mined.length - 1];
    startRequestHeight = lastTransaction.height - 1;

    if (startRequestHeight < 1) {
      // TODO dispatch nomoretransactions to selector
      break; // reached genesis
    }
  }

  const { stakeTransactions, regularTransactions } = divideTransactions(
    transactions
  );

  dispatch({
    type: GETSTARTUPTRANSACTIONS_SUCCESS,
    recentRegularTxs,
    recentStakeTxs,
    maturingBlockHeights,
    stakeTransactions,
    regularTransactions
  });
};

export const DECODERAWTXS_SUCCESS = "DECODERAWTXS_SUCCESS";
export const DECODERAWTXS_FAILED = "DECODERAWTXS_FAILED";

// decodeRawTransaction requests decodification of a raw, hex-encoded transaction.
export const decodeRawTransaction = (hexTx, hash) => (dispatch, getState) => {
  const bufferTx = Buffer.from(hexToBytes(hexTx));
  const chainParams = sel.chainParams(getState());
  const decodedTx = wallet.decodeRawTransaction(bufferTx, chainParams);
  dispatch({ decodedTx, hash, type: DECODERAWTXS_SUCCESS });
  return decodedTx;
};

// getNonWalletOutputs decodes a tx and gets outputs which are not from the wallet.
// This is needed to show output addresses at our home and tx history pages.
const getNonWalletOutputs = (walletService, chainParams, tx) =>
  new Promise((resolve, reject) => {
    try {
      const decodedTx = wallet.decodeRawTransaction(
        Buffer.from(tx.getTransaction()),
        chainParams
      );
      const updatedOutputs = decodedTx.outputs.map(async (o) => {
        const address = o.decodedScript.address;
        // Validate address so we can check if it is our own.
        // If that is the case it is a change output.
        const addrValidResp = await wallet.validateAddress(
          walletService,
          address
        );
        return {
          address,
          value: o.value,
          isChange: addrValidResp.getIsMine()
        };
      });
      resolve(Promise.all(updatedOutputs));
    } catch (e) {
      reject(e);
    }
  });

export const GETTRANSACTIONS_ATTEMPT = "GETTRANSACTIONS_ATTEMPT";
export const GETTRANSACTIONS_FAILED = "GETTRANSACTIONS_FAILED";
export const GETTRANSACTIONS_COMPLETE = "GETTRANSACTIONS_COMPLETE";
export const GETTRANSACTIONS_CANCELED = "GETTRANSACTIONS_CANCELED";

// normalizeTx is used to normalize txs after fetched from dcrwallet.
// this is needed because we do not have all information right after
// fetching it. So we need to manually fill them.
const normalizeTx = async (walletService, chainParams, tx) => {
  if (tx.isStake) {
    // For stake txs, fetch the missing stake info.
    return {
      ...tx,
      ...(await getMissingStakeTxData(walletService, chainParams, tx))
    };
  }

  // For regular tx we get the nonWalletoutputs so we can show them at
  // the overview.
  const outputs = await getNonWalletOutputs(walletService, chainParams, tx.tx);

  return { ...tx, outputs };
};

const normalizeBatchTx = async (walletService, chainParams, txs) =>
  await Promise.all(
    txs.map((tx) =>
      (async () => await normalizeTx(walletService, chainParams, tx))()
    )
  );

// getTransactions loads a list of transactions from the wallet, given the
// current grpc state.
//
// Every call to getTransactions() tries to get BATCH_TX_COUNT
// transactions from the wallet, given the current filter for transactions.
// Note that more than that amount of transactions may be obtained, as the
// iteration of transactions on the wallet is done by block height.
//
// When no more transactions are available given the current filter,
// `grpc.noMoreTransactions` is set to true.
export const getTransactions = (isStake) => async (dispatch, getState) => {
  const {
    currentBlockHeight,
    getTransactionsRequestAttempt,
    transactionsFilter,
    ticketsFilter,
    walletService,
    getTransactionsCancel
  } = getState().grpc;
  const chainParams = sel.chainParams(getState());
  let {
    getRegularTxsAux,
    getStakeTxsAux,
    stakeTransactions,
    regularTransactions
  } = getState().grpc;
  let { noMoreTransactions, lastTransaction } = isStake
    ? getStakeTxsAux
    : getRegularTxsAux;
  const listDirection = isStake
    ? ticketsFilter.listDirection
    : transactionsFilter.listDirection;
  const transactions = [];

  if (getTransactionsRequestAttempt || noMoreTransactions) return;
  if (getTransactionsCancel) {
    dispatch({ type: GETTRANSACTIONS_CANCELED });
  }

  if (!currentBlockHeight) {
    // Wait a little then re-dispatch this call since we have no starting height yet
    setTimeout(() => {
      dispatch(getTransactions());
    }, 1000);
    return;
  }
  dispatch({ type: GETTRANSACTIONS_ATTEMPT });

  // first, request unmined transactions. They always come first in decrediton.
  let { unmined } = await wallet.getTransactions(walletService, -1, -1, 0);
  unmined = await normalizeBatchTx(walletService, chainParams, unmined);
  transactions.push(...unmined);

  const reachedGenesis = false;

  let startRequestHeight, endRequestHeight;
  while (!noMoreTransactions && !reachedGenesis) {
    const transactionsLength = transactions.length;
    if (transactionsLength >= BATCH_TX_COUNT) break;

    if (listDirection === DESC) {
      endRequestHeight = 1;
      startRequestHeight = lastTransaction
        ? lastTransaction.height - 1
        : currentBlockHeight;
      // Reached genesis.
      if (startRequestHeight < 1) {
        noMoreTransactions = true;
        break;
      }
    } else {
      startRequestHeight = lastTransaction ? lastTransaction.height + 1 : 1;
      endRequestHeight = currentBlockHeight;
    }

    try {
      let { mined } = await wallet.getTransactions(
        walletService,
        startRequestHeight,
        endRequestHeight,
        BATCH_TX_COUNT
      );
      // no more transactions
      if (mined.length === 0) {
        noMoreTransactions = true;
        break;
      }
      lastTransaction = mined[mined.length - 1];

      mined = await normalizeBatchTx(walletService, chainParams, mined);

      // concat txs
      transactions.push(...mined);
    } catch (error) {
      dispatch({ type: GETTRANSACTIONS_FAILED, error });
      return;
    }
  }

  isStake
    ? (getStakeTxsAux = { noMoreTransactions, lastTransaction })
    : (getRegularTxsAux = { noMoreTransactions, lastTransaction });

  // divide stake transactions and regular transactions map. This way we can
  // have different filter behaviors without one interfering the other.
  const newTxs = divideTransactions(transactions);
  if (isStake) {
    stakeTransactions = { ...stakeTransactions, ...newTxs.stakeTransactions };
  } else {
    regularTransactions = {
      ...regularTransactions,
      ...newTxs.regularTransactions
    };
  }

  return dispatch({
    type: GETTRANSACTIONS_COMPLETE,
    getRegularTxsAux,
    getStakeTxsAux,
    stakeTransactions,
    regularTransactions,
    startRequestHeight
  });
};

const getMissingStakeTxData = async (
  walletService,
  chainParams,
  transaction
) => {
  let ticketTx, spenderTx, status;
  const { txHash, txType, rawTx, tx } = transaction;
  if (txType === TICKET) {
    // This is currently a somewhat slow call in RPC mode due to having to check
    // in dcrd whether the ticket is live or not.
    const ticket = await wallet.getTicket(walletService, strHashToRaw(txHash));
    status = ticket.status;
    const spenderHash = ticket.spender.getHash();
    if (spenderHash) {
      try {
        const spender = await wallet.getTransaction(walletService, spenderHash);
        spenderTx = spender.tx;
      } catch (error) {
        if (String(error).indexOf("NOT_FOUND") === -1) {
          // A NOT_FOUND error means the wallet hasn't recorded the spender of
          // this ticket (possibly it was purchased with a reward address from
          // a different wallet). So just return the available information in
          // that case and error out in actual failures.
          throw error;
        }
      }
    }
    ticketTx = tx;
  } else {
    // vote/revoke
    const decodedSpender = wallet.decodeRawTransaction(
      Buffer.from(rawTx, "hex"),
      chainParams
    );

    // Find the ticket hash of the vote/revoke.
    const spenderInputs = decodedSpender.inputs;
    const outpIdx = spenderInputs.length === 1 ? 0 : 1;
    const ticketTxHash = spenderInputs[outpIdx].prevTxId;
    status = txType === VOTE ? VOTED : REVOKED;

    // given that the ticket may be much older than the transactions currently
    // in the `transactions` state var, we need to manually fetch the ticket
    // transaction
    try {
      const ticket = await wallet.getTransaction(walletService, ticketTxHash);
      ticketTx = ticket.tx;
    } catch (error) {
      if (String(error).indexOf("NOT_FOUND") > -1) {
        // NOT_FOUND error means we have a vote/revocation tx recorded but not
        // the originating ticket. This might happen in pool fee wallets or
        // wallets receiving the rewards from a different funding wallet.
        // In that case, we return with the original tx since there's nothing
        // else to do.
      } else {
        throw error;
      }
    }
    spenderTx = tx;
  }
  return { ticket: ticketTx, spender: spenderTx, status };
};

// Given a list of transactions, returns the maturing heights of all
// stake txs in the list.
function transactionsMaturingHeights(txs, chainParams) {
  const res = {};
  const addToRes = (height, found) => {
    const accounts = res[height] || [];
    found.forEach((a) =>
      accounts.indexOf(a) === -1 ? accounts.push(a) : null
    );
    res[height] = accounts;
  };

  txs.forEach((tx) => {
    const accountsToUpdate = [];
    switch (tx.type) {
      case TransactionDetails.TransactionType.TICKET_PURCHASE:
        checkAccountsToUpdate([tx], accountsToUpdate);
        addToRes(tx.height + chainParams.TicketExpiry, accountsToUpdate);
        addToRes(tx.height + chainParams.SStxChangeMaturity, accountsToUpdate);
        addToRes(tx.height + chainParams.TicketMaturity, accountsToUpdate); // FIXME: remove as it doesn't change balances
        break;

      case TransactionDetails.TransactionType.VOTE:
      case TransactionDetails.TransactionType.REVOCATION:
        checkAccountsToUpdate([tx], accountsToUpdate);
        addToRes(tx.height + chainParams.CoinbaseMaturity, accountsToUpdate);
        break;
    }
  });

  return res;
}

// getAmountFromTxInputs receives a decoded tx and adds the amount of
// each input from the previous transaction. We need this because when decoding
// a tx, the amount of the input is not deoded with it.
export const getAmountFromTxInputs = (decodedTx) => async (
  dispatch,
  getState
) => {
  const { walletService } = getState().grpc;
  const chainParams = sel.chainParams(getState());
  try {
    const inputWithAmount = decodedTx.inputs.map(
      async ({ prevTxId, outputIndex }, i) => {
        const oldTx = await wallet.getTransaction(walletService, prevTxId);
        if (!oldTx) {
          return Promise.reject(new Error(`Transaction ${prevTxId} not found`));
        }
        const rawTxBuffer = Buffer.from(hexToBytes(oldTx.rawTx));
        const decodedOldTx = wallet.decodeRawTransaction(
          rawTxBuffer,
          chainParams
        );
        const oldOutput = decodedOldTx.outputs[outputIndex];
        if (!oldOutput) {
          return Promise.reject(
            new Error(`Unknown outpoint ${prevTxId}:${outputIndex} not found`)
          );
        }
        decodedTx.inputs[i].amountIn = decodedOldTx.outputs[outputIndex].value;
        // we also save the outpoint address to perform sanity checkes on trezor txs.
        decodedTx.inputs[i].outpointAddress =
          decodedOldTx.outputs[outputIndex].decodedScript.address;
        decodedTx.inputs[i].outpoint = `${prevTxId}:${outputIndex}`;
        return decodedTx.inputs[i];
      }
    );

    decodedTx.inputs = await Promise.all(inputWithAmount);

    return decodedTx;
  } catch (e) {
    return Promise.reject(e);
  }
};

// getTxFromInputs receives a decoded unsignedTx as parameter and gets the txs
// which participate in the input.
export const getTxFromInputs = (unsignedTx) => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    const { walletService } = getState().grpc;
    const chainParams = sel.chainParams(getState());
    // aux map to know if we already has gotten a tx.
    const txsMap = {};
    const txs = unsignedTx.inputs.reduce(async (txs, inp) => {
      const { prevTxId } = inp;
      if (txsMap[prevTxId]) return;

      txsMap[prevTxId] = true;
      const oldTx = await wallet.getTransaction(walletService, prevTxId);
      if (!oldTx) {
        return reject(new Error(`Transaction ${prevTxId} not found`));
      }

      const rawTxBuffer = Buffer.from(hexToBytes(oldTx.rawTx));
      const decodedOldTx = wallet.decodeRawTransaction(
        rawTxBuffer,
        chainParams
      );

      txs.push(decodedOldTx);

      return txs;
    }, []);

    resolve(txs);
  });
