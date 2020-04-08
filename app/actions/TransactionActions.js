import * as wallet from "wallet";
import * as sel from "selectors";
import eq from "lodash/fp/eq";
import { getStakeInfoAttempt, getBalanceUpdateAttempt } from "./ClientActions";
import { getNonWalletOutputs } from "./DecodeMessageActions";
import { TransactionDetails } from "middleware/walletrpc/api_pb";
import { getStartupStats } from "./StatisticsActions";
import { rawHashToHex, reverseRawHash, strHashToRaw } from "helpers";
import { RECENT_TX_COUNT, BATCH_TX_COUNT } from "constants";

function filterTickets(tickets, filter) {
  return tickets
    .filter(v => filter.status.length ? filter.status.indexOf(v.status) > -1 : true);
}

// getTicketsFromTransactions issues multiple wallet.getTransactions call, as
// many as needed to fetch maxCount stake transactions from the wallet, which
// are then converted to tickets via individual wallet.getTicket calls.
//
// The purpose of this function is to allow iteration over the tickets in the
// order of last relevant transaction, as oposed to the native GetTickets call
// from the wallet, which always iterates in ticket purchase order.
//
// This is not suitable to be called when attempting to fetch very large lists
// of tickets, given that the individual getTicket calls are somewhat expensive
// to make.
const getTicketsFromTransactions = async (walletService, startIdx, endIdx, maxCount,
  currentBlockHeight) => {

  let tickets = [];
  const pageSize = maxCount * 4;
  const stakeTypes = [ TransactionDetails.TransactionType.VOTE,
    TransactionDetails.TransactionType.REVOCATION,
    TransactionDetails.TransactionType.TICKET_PURCHASE ];
  const desc = endIdx < startIdx;

  // filter the list of transactions, returning the ticket information for stake
  // transactions of the list.
  const txsToTickets = async txs => {
    const hashes = [];
    const txByTicketHash = {}; // needed to determine when to ignore duplicate elements

    for (let i = 0; i < txs.length; i++) {
      if (stakeTypes.indexOf(txs[i].type) === -1) continue; // not a stake tx

      let txHash = txs[i].txHash;
      if (txs[i].type !== TransactionDetails.TransactionType.TICKET_PURCHASE) {
        // for votes/revocations, we need to grab the prevOutpoint to figure
        // out the ticket hash
        const decodedSpender = wallet.decodeRawTransaction(Buffer.from(txs[i].tx.getTransaction()));
        const spenderInputs = decodedSpender.inputs;
        txHash = reverseRawHash(spenderInputs[spenderInputs.length - 1].prevTxId);
      }
      if (txByTicketHash[txHash]) continue; // only add first occurrence in resulting list

      hashes.push(txHash);
      txByTicketHash[txHash] = txs[i];
    }

    // got hashes of all tickets. Now fetch their info
    const res = await Promise.all(hashes.map(h => (async () => {
      try {
        const ticket = await wallet.getTicket(walletService, strHashToRaw(h));
        const tx = txByTicketHash[h];
        const txIsTicket = tx.type === TransactionDetails.TransactionType.TICKET_PURCHASE;
        const ticketWasSpent = [ "voted", "revoked" ].indexOf(ticket.status) > -1;

        if (!txIsTicket && !ticketWasSpent) {
          // This is a limitation in wallet.getTicket() when the wallet does not
          // have the voting rights (output 0) for the ticket. The status of the
          // original ticket is obviously bogus, given that it doesn't return
          // the ticket's status as voted/revoked, even though we have found its
          // corresponding vote/revocation tx. For the moment, we hack around
          // the returned data to simulate as if the ticket's spend status was
          // actually returned correctly, but we need to be careful to filter
          // for duplicate occurrences of the ticket later on the code flow.
          const statusByTxType = {
            [TransactionDetails.TransactionType.VOTE]: "voted",
            [TransactionDetails.TransactionType.REVOCATION]: "revoked"
          };
          ticket.status = statusByTxType[tx.type];
          ticket.spender = tx.tx;
          return ticket;
        }

        if (desc && txIsTicket && ticketWasSpent) {
          // fetching backwards, we ignore data from voted/revoked tickets given
          // that we should have seen the spender tx already, so this ticket has
          // already been added to the list.
          return null;
        }

        if (!desc && !txIsTicket && ticketWasSpent) {
          // fetching forwards, we ignore data from voted/revoked tickets given
          // that we should have seen the ticket tx already, so this ticket has
          // already been added to the list.
          return null;
        }

        return ticket;
      } catch (error) {
        if (error.code === 5) { // 5 === grpc/codes.NotFound
          // might happen if we didn't participate in the ticket (eg: pool fee wallets)
          return null;
        }
        throw error;
      }
    })()));

    return res.filter(t => t);
  };

  if (endIdx === -1) {
    // grabbing unmined list. Perform a single call and return
    const { unmined } = await wallet.getTransactions(walletService, -1, -1);
    const infos = await txsToTickets(unmined);
    tickets.push(...infos);
  }

  // iterate mined until enough mined transactions were fetched
  while (tickets.length < maxCount) {
    const { mined } = await wallet.getTransactions(walletService, startIdx, endIdx, pageSize);

    if (mined.length === 0) break; // no more transactions in the wallet
    if (desc && startIdx <= 1) break; // reached genesis
    if (!desc && mined[0].height > currentBlockHeight) break; // transactions exceded limit

    const infos = await txsToTickets(mined);
    tickets.push(...infos);

    const lastTx = mined[mined.length - 1];
    startIdx = desc ? lastTx.height - 1 : lastTx.height + 1;
  }

  return { tickets, startIdx };
};

export const GETTICKETS_ATTEMPT = "GETTICKETS_ATTEMPT";
export const GETTICKETS_FAILED = "GETTICKETS_FAILED";
export const GETTICKETS_COMPLETE = "GETTICKETS_COMPLETE";
export const GETTICKETS_PROGRESS = "GETTICKETS_PROGRESS";

export const getTickets = () => async (dispatch, getState) => {
  const { getTicketsRequestAttempt } = getState().grpc;
  if (getTicketsRequestAttempt) return;

  dispatch({ type: GETTICKETS_ATTEMPT });

  const { ticketsFilter, walletService, currentBlockHeight } = getState().grpc;
  let { noMoreTickets, getTicketsStartRequestHeight, minedTickets } = getState().grpc;
  const ticketsNormalizer = sel.ticketsNormalizer(getState());

  // List of transactions found after filtering
  let filtered = [];

  // always request unmined tickets as new ones may be available or some may
  // have been mined
  let { tickets } = await getTicketsFromTransactions(walletService, -1, -1, 0, currentBlockHeight);
  const unminedFiltered = filterTickets(tickets, ticketsFilter);
  const unminedTickets = ticketsNormalizer(unminedFiltered);

  let startRequestHeight, endRequestHeight, desc;
  if (ticketsFilter.listDirection === "desc") {
    startRequestHeight = getTicketsStartRequestHeight ? getTicketsStartRequestHeight : currentBlockHeight;
    endRequestHeight = 1;
    desc = true;
  } else {
    startRequestHeight = getTicketsStartRequestHeight ? getTicketsStartRequestHeight : 1;
    endRequestHeight = currentBlockHeight;
    desc = false;
  }

  let lastReportedHeight = startRequestHeight;

  // now, request a batch of mined transactions until BATCH_TX_COUNT
  // transactions have been obtained (after filtering)
  while (!noMoreTickets && (filtered.length < BATCH_TX_COUNT)) {
    try {
      let { tickets, startIdx } = await getTicketsFromTransactions(walletService,
        startRequestHeight, endRequestHeight, BATCH_TX_COUNT, currentBlockHeight);

      noMoreTickets =
        (tickets.length === 0) ||
        (desc && startIdx <= 1) ||
        (desc && startIdx >= currentBlockHeight);

      startRequestHeight = startIdx;

      if (Math.abs(lastReportedHeight - startRequestHeight) > 1000) {
        dispatch({ startRequestHeight, type: GETTICKETS_PROGRESS });
        lastReportedHeight = startRequestHeight;
      }

      const thisFiltered = filterTickets(tickets, ticketsFilter);
      const normalized = ticketsNormalizer(thisFiltered);
      filtered.push(...normalized);

      if (getState().grpc.getTicketsCancel) {
        noMoreTickets = true;
      }
    } catch (error) {
      dispatch({ error, type: GETTICKETS_FAILED });
      return;
    }
  }

  // This next bit is required due to wallet.getTicket() not correctly showing
  // the status of tickets when the wallet doesn't have the voting rights for
  // it. Without this duplicate filtering, we'd see two transactions (the ticket
  // and a vote/revocation) shown as the same expired or missed status.
  const newMinedTickets = [];

  if (desc) {
    // When iterating in desc mode, we add the first found (most recent) ticket
    // tx (which should have the correct status) and ignore the next one (the
    // purchase, which would show as missed/expired)
    newMinedTickets.push(...minedTickets);
    const ticketsMap = minedTickets.reduce((m, t) => { m[t.txHash] = t; return m; }, {});
    newMinedTickets.push(...filtered.filter(t => !ticketsMap[t.txHash]));
  } else {
    // When iterating in asc mode, we unshift the newly found (most recent)
    // tickets first, then ignore the previous (older) one, as the most recent
    // one will have the correct status.
    // This provokes a small UI issue in that the older ticket disappears from
    // the list, causing a "jump" and if the user backtracks it won't be
    // there anymore.
    newMinedTickets.push(...filtered);
    const ticketsMap = filtered.reduce((m, t) => { m[t.txHash] = t; return m; }, {});
    newMinedTickets.unshift(...minedTickets.filter(t => !ticketsMap[t.txHash]));
  }

  dispatch({
    unminedTickets, minedTickets: newMinedTickets, noMoreTickets,
    getTicketsStartRequestHeight: startRequestHeight,
    type: GETTICKETS_COMPLETE
  });
};

export const CLEAR_TICKETS = "CLEAR_TICKETS";

export const reloadTickets = () => dispatch => {
  dispatch({ type: CLEAR_TICKETS });
  dispatch(getTickets());
};

export const CHANGE_TICKETS_FILTER = "CHANGE_TICKETS_FILTER";

export function changeTicketsFilter(newFilter) {
  return (dispatch) => {
    dispatch({ ticketsFilter: newFilter, type: CHANGE_TICKETS_FILTER });
    dispatch(getTickets());
  };
}

export const GETTICKETS_CANCEL = "GETTICKETS_CANCEL";

export const cancelGetTickets = () => dispatch => dispatch({ type: GETTICKETS_CANCEL });

// filterTransactions filters a list of transactions given a filtering object.
//
// Currently supported filters in the filter object:
// - type (array): Array of types a transaction must belong to, to be accepted.
// - direction (string): A string of one of the allowed directions for regular
//   transactions (sent/received/transferred)
//
// If empty, all transactions are accepted.
function filterTransactions(transactions, filter) {
  return transactions
    .filter(v => filter.types.length ? filter.types.indexOf(v.type) > -1 : true)
    .filter(v => filter.direction ? filter.direction === v.direction : true)
    .filter(v => filter.search ? v.creditAddresses.find(address => address.length > 1 && address.toLowerCase().indexOf(filter.search.toLowerCase()) !== -1) != undefined : true)
    .filter(v => filter.minAmount ? Math.abs(v.amount) >= filter.minAmount : true)
    .filter(v => filter.maxAmount ? Math.abs(v.amount) <= filter.maxAmount : true);
}

function checkAccountsToUpdate(txs, accountsToUpdate) {
  txs.forEach(tx => {
    tx.tx.getCreditsList().forEach(credit => { if (accountsToUpdate.find(eq(credit.getAccount())) === undefined) accountsToUpdate.push(credit.getAccount()); });
    tx.tx.getDebitsList().forEach(debit => { if (accountsToUpdate.find(eq(debit.getPreviousAccount())) === undefined) accountsToUpdate.push(debit.getPreviousAccount()); });
  });
  return accountsToUpdate;
}

function checkForStakeTransactions(txs) {
  var stakeTxsFound = false;
  txs.forEach(tx => {
    if (tx.type == TransactionDetails.TransactionType.VOTE ||
      tx.type == TransactionDetails.TransactionType.TICKET_PURCHASE ||
      tx.type == TransactionDetails.TransactionType.REVOCATION) {
      stakeTxsFound = true;
    }
  });
  return stakeTxsFound;
}

export const NEW_TRANSACTIONS_RECEIVED = "NEW_TRANSACTIONS_RECEIVED";
export const MATURINGHEIGHTS_CHANGED = "MATURINGHEIGHTS_CHANGED";

// newTransactionsReceived should be called when a new set of transactions has
// been received from the wallet (through a notification).
export const newTransactionsReceived = (newlyMinedTransactions, newlyUnminedTransactions) => async (dispatch, getState) => {
  if (!newlyMinedTransactions.length && !newlyUnminedTransactions.length) return;

  let { unminedTransactions, minedTransactions, recentRegularTransactions, recentStakeTransactions } = getState().grpc;
  const { transactionsFilter, decodeMessageService, walletService } = getState().grpc;
  const chainParams = sel.chainParams(getState());

  // aux maps of [txhash] => tx (used to ensure no duplicate txs)
  const newlyMinedMap = newlyMinedTransactions.reduce((m, v) => { m[v.hash] = v; return m; }, {});
  const newlyUnminedMap = newlyUnminedTransactions.reduce((m, v) => { m[v.hash] = v; return m; }, {});

  const minedMap = minedTransactions.reduce((m, v) => { m[v.hash] = v; return m; }, {});
  const unminedMap = unminedTransactions.reduce((m, v) => { m[v.hash] = v; return m; }, {});

  const unminedDupeCheck = newlyUnminedTransactions.filter(tx => !minedMap[tx.hash] && !unminedMap[tx.hash]);

  var accountsToUpdate = new Array();
  accountsToUpdate = checkAccountsToUpdate(unminedDupeCheck, accountsToUpdate);
  accountsToUpdate = checkAccountsToUpdate(newlyMinedTransactions, accountsToUpdate);
  accountsToUpdate = Array.from(new Set(accountsToUpdate));
  accountsToUpdate.forEach(v => dispatch(getBalanceUpdateAttempt(v, 0)));

  const hasStakeTxs = checkForStakeTransactions(unminedDupeCheck) || checkForStakeTransactions(newlyMinedTransactions);
  if (hasStakeTxs) {
    dispatch(getStakeInfoAttempt());
    dispatch(reloadTickets());
  }

  unminedTransactions = filterTransactions([
    ...newlyUnminedTransactions,
    ...unminedTransactions.filter(tx => !newlyMinedMap[tx.hash] && !newlyUnminedMap[tx.hash])
  ], transactionsFilter);

  const regularTransactionFilter = {
    listDirection: "desc",
    types: [ TransactionDetails.TransactionType.REGULAR ],
    direction: null
  };

  recentRegularTransactions = filterTransactions([
    ...newlyUnminedTransactions,
    ...newlyMinedTransactions,
    ...recentRegularTransactions.filter(tx => !newlyMinedMap[tx.hash] && !newlyUnminedMap[tx.hash])
  ], regularTransactionFilter).slice(0, RECENT_TX_COUNT).map(async tx => {
    const outputs = await getNonWalletOutputs(decodeMessageService, walletService, tx);
    return { ...tx, outputs };
  });
  // add inputs and outputs to recentRegularTransactions after receveing new tx.
  await Promise.all(recentRegularTransactions).then(r => recentRegularTransactions = r);

  const stakeTransactionFilter = {
    listDirection: "desc",
    types: [ TransactionDetails.TransactionType.TICKET_PURCHASE, TransactionDetails.TransactionType.VOTE, TransactionDetails.TransactionType.REVOCATION ],
    direction: null
  };

  recentStakeTransactions = filterTransactions([
    ...newlyUnminedTransactions,
    ...newlyMinedTransactions,
    ...recentStakeTransactions.filter(tx => !newlyMinedMap[tx.hash] && !newlyUnminedMap[tx.hash])
  ], stakeTransactionFilter).slice(0, RECENT_TX_COUNT);

  const { maturingBlockHeights } = getState().grpc;
  const newMaturingHeights = { ...maturingBlockHeights };
  const mergeNewMaturingHeights = (hs) => Object.keys(hs).forEach(h => {
    const accounts = newMaturingHeights[h] || [];
    hs[h].forEach(a => accounts.indexOf(a) === -1 ? accounts.push(a) : null);
    newMaturingHeights[h] = accounts;
  });

  mergeNewMaturingHeights(transactionsMaturingHeights(newlyMinedTransactions, chainParams));
  dispatch({ maturingBlockHeights: newMaturingHeights, type: MATURINGHEIGHTS_CHANGED });

  // TODO: filter newlyMinedTransactions against minedTransactions if this
  // starts generating a duplicated key error

  if (transactionsFilter.listDirection === "desc") {
    minedTransactions = [ ...newlyMinedTransactions, ...minedTransactions ];
  } else {
    minedTransactions = [ ...minedTransactions, ...newlyMinedTransactions ];
  }
  minedTransactions = filterTransactions(minedTransactions, transactionsFilter);

  dispatch({
    unminedTransactions, minedTransactions, newlyUnminedTransactions,
    newlyMinedTransactions, recentRegularTransactions, recentStakeTransactions, type: NEW_TRANSACTIONS_RECEIVED
  });

  if (newlyMinedTransactions.length > 0) {
    const { startupStatsEndCalcTime, startupStatsCalcSeconds } = getState().statistics;
    const secFromLastStats = (new Date() - startupStatsEndCalcTime) / 1000;
    if (secFromLastStats > 5 * startupStatsCalcSeconds) {
      dispatch(getStartupStats());
    }
  }
};

export const CHANGE_TRANSACTIONS_FILTER = "CHANGE_TRANSACTIONS_FILTER";
export function changeTransactionsFilter(newFilter) {
  return (dispatch) => {
    dispatch({ transactionsFilter: newFilter, type: CHANGE_TRANSACTIONS_FILTER });
    return dispatch(getTransactions());
  };
}

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

  const { currentBlockHeight, walletService, decodeMessageService } = getState().grpc;
  const chainParams = sel.chainParams(getState());
  let startRequestHeight = currentBlockHeight;
  const pageSize = 50;
  const voteTypes = [ TransactionDetails.TransactionType.VOTE,
    TransactionDetails.TransactionType.REVOCATION ];
  const checkHeightDeltas = [
    chainParams.TicketMaturity,
    chainParams.CoinbaseMaturity,
    chainParams.SStxChangeMaturity
  ];
  const immatureHeight = currentBlockHeight - Math.max(...checkHeightDeltas);

  let foundNeededTransactions = false;
  let recentRegularTxs = [];
  let recentStakeTxs = [];
  const maturingBlockHeights = {};
  const votedTickets = {}; // aux map of ticket hash => true

  // the mergeXXX functions pick a list of transactions returned from
  // getTransactions and fills the appropriate result variables
  const mergeRegularTxs = txs => {
    return (recentRegularTxs.length < RECENT_TX_COUNT) &&
    (recentRegularTxs.push(...txs.filter(
      tx => tx.type === TransactionDetails.TransactionType.REGULAR)));
  }

  const mergeStakeTxs = txs =>
    (recentStakeTxs.length < RECENT_TX_COUNT) &&
    (recentStakeTxs.push(...txs.filter(
      tx => {
        if (voteTypes.indexOf(tx.type) > -1) {
          // always include vote or revocation and mark ticket as voted so we
          // don't include it in the recent list
          const decodedSpender = wallet.decodeRawTransaction(Buffer.from(tx.tx.getTransaction()));
          const spenderInputs = decodedSpender.inputs;
          const ticketHash = reverseRawHash(spenderInputs[spenderInputs.length - 1].prevTxId);
          votedTickets[ticketHash] = true;
          return true;
        } else if (tx.type === TransactionDetails.TransactionType.TICKET_PURCHASE) {
          // tickets are only added to the recent list if they haven't voted yet
          return !votedTickets[tx.txHash];
        } else {
          return false;
        }
      }
    )));

  const mergeImmatureHeights = txs => {
    if (startRequestHeight < immatureHeight) return;
    const txHeights = transactionsMaturingHeights(txs, chainParams);
    Object.keys(txHeights).forEach(h => {
      if (h < currentBlockHeight) return;
      const accounts = maturingBlockHeights[h] || [];
      txHeights[h].forEach(a => accounts.indexOf(a) === -1 ? accounts.push(a) : null);
      maturingBlockHeights[h] = accounts;
    });
  };

  // get any unmined transactions
  const { unmined } = await wallet.getTransactions(walletService,
    -1, -1, pageSize);
  mergeRegularTxs(unmined);
  mergeStakeTxs(unmined);
  mergeImmatureHeights(unmined);

  let requestHeight = startRequestHeight;
  while (!foundNeededTransactions) {
    const { mined } = await wallet.getTransactions(walletService,
      requestHeight, 1, pageSize);
    if (mined.length === 0) break; // no more transactions

    mergeRegularTxs(mined);
    mergeStakeTxs(mined);
    mergeImmatureHeights(mined);

    foundNeededTransactions =
      (recentRegularTxs.length >= RECENT_TX_COUNT) &&
      (recentStakeTxs.length >= RECENT_TX_COUNT) &&
      (requestHeight < immatureHeight);

    const lastTransaction = mined[mined.length - 1];
    requestHeight = lastTransaction.height - 1;
    if (requestHeight < 1) break; // reached genesis
  }

  recentRegularTxs = recentRegularTxs.slice(0, RECENT_TX_COUNT);
  recentStakeTxs = recentStakeTxs.slice(0, RECENT_TX_COUNT);

  // get non wallet outputs so we can show at our home page.
  const addNonWalletInfo = recentRegularTxs.map(async tx => {
    const outputs = await getNonWalletOutputs(decodeMessageService, walletService, tx);
    return { ...tx, outputs };
  });
  await Promise.all(addNonWalletInfo).then(r => recentRegularTxs = r);

  const regularTxMap = recentRegularTxs.reduce((m, t) => {
    m[t.txHash] = t;
    return m;
  }, {});
  const stakeTxMap = recentStakeTxs.reduce((m, t) => {
    m[t.txHash] = t;
    return m;
  }, {});
  console.log(regularTxMap)
  const transactions = { ...regularTxMap, ...stakeTxMap };

  dispatch({ type: GETSTARTUPTRANSACTIONS_SUCCESS,
    recentRegularTxs, recentStakeTxs, maturingBlockHeights, transactions
  });
};

export const GETTRANSACTIONS_ATTEMPT = "GETTRANSACTIONS_ATTEMPT";
export const GETTRANSACTIONS_FAILED = "GETTRANSACTIONS_FAILED";
export const GETTRANSACTIONS_COMPLETE = "GETTRANSACTIONS_COMPLETE";

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
export const getTransactions = () => async (dispatch, getState) => {
  const {
    currentBlockHeight, getTransactionsRequestAttempt, transactionsFilter, walletService,
    decodeMessageService
  } = getState().grpc;
  let { noMoreTransactions, lastTransaction } = getState().grpc;
  if (getTransactionsRequestAttempt || noMoreTransactions) return;

  if (!currentBlockHeight) {
    // Wait a little then re-dispatch this call since we have no starting height yet
    setTimeout(() => { dispatch(getTransactions()); }, 1000);
    return;
  }
  dispatch({ type: GETTRANSACTIONS_ATTEMPT });

  // List of transactions found after filtering
  const filtered = [];

  // first, request unmined transactions. They always come first in decrediton.
  const { unmined } = await wallet.getTransactions(walletService, -1, -1, 0);
  let unminedTransactions = filterTransactions(unmined, transactionsFilter).map(async tx => {
    const outputs = await getNonWalletOutputs(decodeMessageService, walletService, tx);
    return { ...tx, outputs };
  });
  // add inputs and outputs to unminedTransactions.
  await Promise.all(unminedTransactions).then(r => unminedTransactions = r);

  const stakeTypes = [ TransactionDetails.TransactionType.VOTE,
    TransactionDetails.TransactionType.REVOCATION,
    TransactionDetails.TransactionType.TICKET_PURCHASE ];
  const txNormalizer = sel.transactionNormalizer(getState());

  // now, request a batch of mined transactions until BATCH_TX_COUNT
  // transactions have been obtained (after filtering)
  let reachedGenesis = false;
  while (!noMoreTransactions && (filtered.length < BATCH_TX_COUNT) && !reachedGenesis) {
    let startRequestHeight, endRequestHeight;

    if (transactionsFilter.listDirection === "desc") {
      endRequestHeight = 1;
      startRequestHeight = lastTransaction ? lastTransaction.height - 1 : currentBlockHeight;
      // Reached genesis.
      if (startRequestHeight < 1) {
        noMoreTransactions = true;
        break
      };
    } else {
      startRequestHeight = lastTransaction ? lastTransaction.height + 1 : 1;
      endRequestHeight = currentBlockHeight;
    }

    try {
      const { mined } = await wallet.getTransactions(
        walletService, startRequestHeight, endRequestHeight, BATCH_TX_COUNT
      );
      // no more transactions
      if (mined.length === 0) {
        noMoreTransactions = true;
        break;
      }
      lastTransaction = mined[mined.length - 1];

      const newFiltered = filterTransactions(mined, transactionsFilter);

      for (let i = 0; i < newFiltered.length; i++) {
        const tx = newFiltered[i];
        if (stakeTypes.indexOf(tx.type) > -1) {
          // For stake txs, fetch the missing stake info.
          const normalizedTx = txNormalizer(tx);
          const stakeTx = await dispatch(getMissingStakeTxData(normalizedTx));
          filtered.push(normalizedTx);
        } else {
          // For regular tx we get the nonWalletoutputs so we can show them at
          // the overview.
          tx.outputs = await getNonWalletOutputs(decodeMessageService, walletService, tx);
          filtered.push(tx);
        }
      }
    } catch (error) {
      dispatch({ type: GETTRANSACTIONS_FAILED, error });
      return;
    }
  }

  // make map of transactions
  let transactions = filtered.reduce((m, t) => {
    console.log(t)
    m[t.txHash] = t;
    return m;
  }, {});

  return dispatch({ type: GETTRANSACTIONS_COMPLETE, noMoreTransactions, lastTransaction, transactions });
};

const getMissingStakeTxData = tx => async (dispatch, getState) => {
  const walletService = sel.walletService(getState());

  let ticketTx, spenderTx, status;

  if (tx.txType === "Ticket") {
    // This is currently a somewhat slow call in RPC mode due to having to check
    // in dcrd whether the ticket is live or not.
    const ticket = await wallet.getTicket(walletService, strHashToRaw(tx.txHash));
    status = ticket.status;
    if (ticket.spender.getHash()) {
      try {
        const spenderHash = rawHashToHex(ticket.spender.getHash());
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
    ticketTx = tx.originalTx.tx;
  } else { // vote/revoke
    const decodedSpender = wallet.decodeRawTransaction(Buffer.from(tx.rawTx, "hex"));

    // Find the ticket hash of the vote/revoke.
    const spenderInputs = decodedSpender.inputs;
    const outpIdx = spenderInputs.length === 1 ? 0 : 1;
    const ticketTxHash = rawHashToHex(spenderInputs[outpIdx].prevTxId);
    status = tx.txType === "Vote" ? "voted" : "revoked";

    // given that the ticket may be much older than the transactions currently
    // in the `transactions` state var, we need to manually fetch the ticket
    // transaction
    try {
      const ticket = await wallet.getTransaction(walletService,
        ticketTxHash);
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

    spenderTx = tx.originalTx.tx;
  }

  // normalize ticket+spender as if it was a result item from a wallet.getTickets call
  const ticket = {
    ticket: ticketTx,
    spender: spenderTx,
    status: status
  };
  const ticketNormal = sel.ticketNormalizer(getState())(ticket);

  return {
    ...tx.originalTx,
    enterTimestamp: ticketNormal.enterTimestamp,
    leaveTimestamp: ticketNormal.leaveTimestamp,
    ticketPrice: ticketNormal.ticketPrice,
    ticketReward: ticketNormal.ticketReward,
    isPending: ticketNormal.isPending,
    accountName: ticketNormal.accountName
    // add more stuff from the result of sel.ticketNormalizer if ever needed
  };
};

export const FETCHMISSINGSTAKETXDATA_ATTEMPT = "FETCHMISSINGSTAKETXDATA_ATTEMPT";
export const FETCHMISSINGSTAKETXDATA_SUCCESS = "FETCHMISSINGSTAKETXDATA_SUCCESS";
export const FETCHMISSINGSTAKETXDATA_FAILED = "FETCHMISSINGSTAKETXDATA_FAILED";

// fetchMissingStakeTxData fetches the missing stake information of a given
// transaction returned from getTransaction. For tickets, it tries to fill the
// ticket purchase amount and for votes it tries to fill the purchase info and
// reward data.
//
// This function is not suitable for calling on a list of transactions, since
// some cases/operations are slow.
export const fetchMissingStakeTxData = tx => async (dispatch, getState) => {

  if (getState().grpc.fetchMissingStakeTxDataAttempt[tx.txHash]) {
    return;
  }
  dispatch({ txHash: tx.txHash, type: FETCHMISSINGSTAKETXDATA_ATTEMPT });

  const newTx = await (dispatch(getMissingStakeTxData(tx)));

  const oldTxs = getState().grpc.transactions;
  const oldStakeTxs = getState().grpc.recentStakeTransactions;
  const txIdx = oldTxs.findIndex(t => t.txHash === tx.txHash);
  const stakeTxIdx = oldStakeTxs.findIndex(t => t.txHash === tx.txHash);

  if ((txIdx > -1) || (stakeTxIdx > -1)) {
    const dispatchState = { txHash: tx.txHash, type: FETCHMISSINGSTAKETXDATA_SUCCESS };
    if (txIdx > -1) {
      const newTxs = [ ...oldTxs ];
      newTxs[txIdx] = newTx;
      dispatchState["transactions"] = newTxs;
    }
    if (stakeTxIdx > -1) {
      const newStakeTxs = [ ...oldStakeTxs ];
      newStakeTxs[stakeTxIdx] = newTx;
      dispatchState["recentStakeTransactions"] = newStakeTxs;
    }
    dispatch(dispatchState);
  } else {
    // not supposed to happen in normal usage; this function  should only be
    // entered from a transaction already in the transaction map
    // (sel.transactionsMap).
    dispatch({ txHash: tx.txHash, type: FETCHMISSINGSTAKETXDATA_FAILED });
  }
};

// Given a list of transactions, returns the maturing heights of all
// stake txs in the list.
function transactionsMaturingHeights(txs, chainParams) {
  let res = {};
  const addToRes = (height, found) => {
    const accounts = res[height] || [];
    found.forEach(a => accounts.indexOf(a) === -1 ? accounts.push(a) : null);
    res[height] = accounts;
  };

  txs.forEach(tx => {
    let accountsToUpdate = [];
    switch (tx.type) {
    case TransactionDetails.TransactionType.TICKET_PURCHASE:
      checkAccountsToUpdate([ tx ], accountsToUpdate);
      addToRes(tx.height + chainParams.TicketExpiry, accountsToUpdate);
      addToRes(tx.height + chainParams.SStxChangeMaturity, accountsToUpdate);
      addToRes(tx.height + chainParams.TicketMaturity, accountsToUpdate); // FIXME: remove as it doesn't change balances
      break;

    case TransactionDetails.TransactionType.VOTE:
    case TransactionDetails.TransactionType.REVOCATION:
      checkAccountsToUpdate([ tx ], accountsToUpdate);
      addToRes(tx.height + chainParams.CoinbaseMaturity, accountsToUpdate);
      break;
    }
  });

  return res;
}
