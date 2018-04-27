// @flow
import * as wallet from "wallet";
import * as sel from "selectors";
import eq from "lodash/fp/eq";
import { getNextAddressAttempt, loadActiveDataFiltersAttempt, rescanAttempt,
  stopAutoBuyerAttempt, getTicketBuyerConfigAttempt } from "./ControlActions";
import { transactionNtfnsStart, accountNtfnsStart } from "./NotificationActions";
import { updateStakepoolPurchaseInformation, setStakePoolVoteChoices } from "./StakePoolActions";
import { getDecodeMessageServiceAttempt } from "./DecodeMessageActions";
import { showSidebarMenu, showSidebar } from "./SidebarActions";
import { push as pushHistory, goBack } from "react-router-redux";
import { getWalletCfg } from "config";
import { onAppReloadRequested } from "wallet";
import { getTransactions as walletGetTransactions } from "wallet/service";
import { TransactionDetails } from "middleware/walletrpc/api_pb";
import { clipboard } from "electron";
import { getStartupStats } from "./StatisticsActions";

export const goToTransactionHistory = () => (dispatch) => {
  dispatch(pushHistory("/transactions/history"));
};

export const goToMyTickets = () => (dispatch) => {
  dispatch(pushHistory("/tickets/mytickets"));
};

export const GETWALLETSERVICE_ATTEMPT = "GETWALLETSERVICE_ATTEMPT";
export const GETWALLETSERVICE_FAILED = "GETWALLETSERVICE_FAILED";
export const GETWALLETSERVICE_SUCCESS = "GETWALLETSERVICE_SUCCESS";

function getWalletServiceSuccess(walletService) {
  return (dispatch, getState) => {
    dispatch({ walletService, type: GETWALLETSERVICE_SUCCESS });
    setTimeout(() => { dispatch(loadActiveDataFiltersAttempt()); }, 1000);
    setTimeout(() => { dispatch(getNextAddressAttempt(0)); }, 1000);
    setTimeout(() => { dispatch(getTicketPriceAttempt()); }, 1000);
    setTimeout(() => { dispatch(getPingAttempt()); }, 1000);
    setTimeout(() => { dispatch(getNetworkAttempt()); }, 1000);
    setTimeout(() => { dispatch(transactionNtfnsStart()); }, 1000);
    setTimeout(() => { dispatch(accountNtfnsStart()); }, 1000);
    setTimeout(() => { dispatch(updateStakepoolPurchaseInformation()); }, 1000);
    setTimeout(() => { dispatch(getDecodeMessageServiceAttempt()); }, 1000);

    var goHomeCb = () => {
      setTimeout(() => { dispatch(pushHistory("/home")); }, 1000);
      setTimeout(() => { dispatch(showSidebar()); }, 1000);
      setTimeout(() => { dispatch(showSidebarMenu()); }, 1000);
    };

    // Check here to see if wallet was just created from an existing
    // seed.  If it was created from a newly generated seed there is no
    // expectation of address use so rescan can be skipped.
    const { walletCreateExisting, walletCreateResponse } = getState().walletLoader;
    const { fetchHeadersResponse } = getState().walletLoader;
    if (walletCreateExisting) {
      setTimeout(() => { dispatch(rescanAttempt(0)).then(goHomeCb); }, 1000);
    } else if (walletCreateResponse == null && fetchHeadersResponse != null && fetchHeadersResponse.getFirstNewBlockHeight() !== 0) {
      setTimeout(() => { dispatch(rescanAttempt(fetchHeadersResponse.getFirstNewBlockHeight())).then(goHomeCb); }, 1000);
    } else {
      dispatch(getStartupWalletInfo()).then(goHomeCb);
    }
  };
}

export const GETSTARTUPWALLETINFO_ATTEMPT = "GETSTARTUPWALLETINFO_ATTEMPT";
export const GETSTARTUPWALLETINFO_SUCCESS = "GETSTARTUPWALLETINFO_SUCCESS";
export const GETSTARTUPWALLETINFO_FAILED = "GETSTARTUPWALLETINFO_FAILED";

export const getStartupWalletInfo = () => (dispatch) => {
  dispatch({ type: GETSTARTUPWALLETINFO_ATTEMPT });
  setTimeout( () => { dispatch(getStakeInfoAttempt()); }, 1000);
  setTimeout( () => { dispatch(getTicketsInfoAttempt()); }, 1000);
  return new Promise((resolve, reject) => {
    setTimeout( async () => {
      try {
        await dispatch(getAccountsAttempt(true));
        await dispatch(getMostRecentRegularTransactions());
        await dispatch(getMostRecentStakeTransactions());
        await dispatch(getMostRecentTransactions());
        await dispatch(getStartupStats());
        dispatch(findImmatureTransactions());
        dispatch({ type: GETSTARTUPWALLETINFO_SUCCESS });
        resolve();
      } catch (error) {
        dispatch({ error, type: GETSTARTUPWALLETINFO_FAILED });
        reject(error);
      }
    }, 1000);
  });
};

export const MATURINGHEIGHTS_CHANGED = "MATURINGHEIGHTS_CHANGED";
export const MATURINGHEIGHTS_ADDED = "MATURINGHEIGHTS_ADDED";

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

export const findImmatureTransactions = () => async (dispatch, getState) => {
  const { currentBlockHeight, walletService } = getState().grpc;
  const chainParams = sel.chainParams(getState());

  const pageSize = 30;
  const checkHeightDeltas = [
    chainParams.TicketExpiry,
    chainParams.TicketMaturity,
    chainParams.CoinbaseMaturity,
    chainParams.SStxChangeMaturity
  ];
  const immatureHeight = currentBlockHeight - Math.max(...checkHeightDeltas);

  let txs = await walletGetTransactions(walletService, immatureHeight,
    currentBlockHeight, pageSize);

  let checkHeights = {};
  // const mergeCheckHeights = (h) => (h > currentBlockHeight && checkHeights.indexOf(h) === -1)
  //   ? checkHeights.push(h) : null;
  const mergeCheckHeights = (hs) => Object.keys(hs).forEach(h => {
    if (h < currentBlockHeight) return;
    const accounts = checkHeights[h] || [];
    hs[h].forEach(a => accounts.indexOf(a) === -1 ? accounts.push(a) : null);
    checkHeights[h] = accounts;
  });

  while (txs.mined.length > 0) {
    let lastTx = txs.mined[txs.mined.length-1];
    mergeCheckHeights(transactionsMaturingHeights(txs.mined, chainParams));
    txs = await walletGetTransactions(walletService, lastTx.height+1,
      currentBlockHeight+1, pageSize);
  }

  dispatch({ maturingBlockHeights: checkHeights, type: MATURINGHEIGHTS_CHANGED });
};

export const getWalletServiceAttempt = () => (dispatch, getState) => {
  const { grpc: { address, port } } = getState();
  const { daemon: { walletName } } = getState();
  dispatch({ type: GETWALLETSERVICE_ATTEMPT });
  wallet.getWalletService(sel.isTestNet(getState()), walletName, address, port)
    .then(walletService => dispatch(getWalletServiceSuccess(walletService)))
    .catch(error => dispatch({ error, type: GETWALLETSERVICE_FAILED }));
};

export const GETTICKETBUYERSERVICE_ATTEMPT = "GETTICKETBUYERSERVICE_ATTEMPT";
export const GETTICKETBUYERSERVICE_FAILED = "GETTICKETBUYERSERVICE_FAILED";
export const GETTICKETBUYERSERVICE_SUCCESS = "GETTICKETBUYERSERVICE_SUCCESS";

export const getTicketBuyerServiceAttempt = () => (dispatch, getState) => {
  const { grpc: { address, port } } = getState();
  const { daemon: { walletName } } = getState();
  dispatch({ type: GETTICKETBUYERSERVICE_ATTEMPT });
  wallet.getTicketBuyerService(sel.isTestNet(getState()), walletName, address, port)
    .then(ticketBuyerService => {
      dispatch({ ticketBuyerService, type: GETTICKETBUYERSERVICE_SUCCESS });
      setTimeout(() => { dispatch(getTicketBuyerConfigAttempt()); }, 10);
      setTimeout(() => { dispatch(stopAutoBuyerAttempt()); }, 10);
    })
    .catch(error => dispatch({ error, type: GETTICKETBUYERSERVICE_FAILED }));
};

export const getAccountNumbersBalances = (accountNumbers) => (dispatch) => {
  accountNumbers.forEach(a => dispatch(getBalanceUpdateAttempt(a, 0)));
};

const getAccountsBalances = (accounts) => (dispatch, getState) => {
  var balances = new Array();
  const { daemon: { hiddenAccounts } } = getState();

  accounts.forEach(account => {
    let hidden = false;
    let HDPath = "";
    if (hiddenAccounts.find(eq(account.getAccountNumber()))) hidden = true;
    if (sel.isMainNet(getState())) {
      HDPath = "m / 44' / 20' / " + account.getAccountNumber() + "'";
    } else if (sel.isTestNet(getState())) {
      HDPath = "m / 44' / 11' / " + account.getAccountNumber() + "'";
    }
    wallet.getBalance(sel.walletService(getState()), account.getAccountNumber(), 0)
      .then(resp => {
        const accountEntry = {
          accountNumber: account.getAccountNumber(),
          accountName: account.getAccountName(),
          externalKeys: account.getExternalKeyCount(),
          internalKeys: account.getInternalKeyCount(),
          importedKeys: account.getImportedKeyCount(),
          hidden,
          HDPath,
          total: resp.getTotal(),
          spendable: resp.getSpendable(),
          immatureReward: resp.getImmatureReward(),
          immatureStakeGeneration: resp.getImmatureStakeGeneration(),
          lockedByTickets: resp.getLockedByTickets(),
          votingAuthority: resp.getVotingAuthority(),
        };
        balances.push(accountEntry);
      })
      .catch(error => {
        dispatch({ error, type: GETBALANCE_FAILED });
        return;
      });
  });
  dispatch({ balances, type: GETBALANCE_SUCCESS });
};

export const GETBALANCE_ATTEMPT = "GETBALANCE_ATTEMPT";
export const GETBALANCE_FAILED = "GETBALANCE_FAILED";
export const GETBALANCE_SUCCESS = "GETBALANCE_SUCCESS";

const getBalanceUpdateSuccess = (accountNumber, getBalanceResponse) => (dispatch) => {
  let updatedBalance = {
    accountNumber,
    total: getBalanceResponse.getTotal(),
    spendable: getBalanceResponse.getSpendable(),
    immatureReward: getBalanceResponse.getImmatureReward(),
    immatureStakeGeneration: getBalanceResponse.getImmatureStakeGeneration(),
    lockedByTickets: getBalanceResponse.getLockedByTickets(),
    votingAuthority: getBalanceResponse.getVotingAuthority(),
  };

  dispatch(updateAccount(updatedBalance));
};

export const getBalanceUpdateAttempt = (accountNumber, requiredConfs) => (dispatch, getState) =>
  wallet.getBalance(sel.walletService(getState()), accountNumber, requiredConfs)
    .then(resp => dispatch(getBalanceUpdateSuccess(accountNumber, resp)))
    .catch(error => dispatch({ error, type: GETBALANCE_FAILED }));

export const GETACCOUNTNUMBER_ATTEMPT = "GETACCOUNTNUMBER_ATTEMPT";
export const GETACCOUNTNUMBER_FAILED = "GETACCOUNTNUMBER_FAILED";
export const GETACCOUNTNUMBER_SUCCESS = "GETACCOUNTNUMBER_SUCCESS";

export const getAccountNumberAttempt = (accountName) => (dispatch, getState) => {
  dispatch({ type: GETACCOUNTNUMBER_ATTEMPT });
  wallet.getAccountNumber(sel.walletService(getState()), accountName)
    .then(resp => dispatch({ getAccountNumberResponse: resp, type: GETACCOUNTNUMBER_SUCCESS }))
    .catch(error => dispatch({ error, type: GETACCOUNTNUMBER_FAILED }));
};

export const GETNETWORK_ATTEMPT = "GETNETWORK_ATTEMPT";
export const GETNETWORK_FAILED = "GETNETWORK_FAILED";
export const GETNETWORK_SUCCESS = "GETNETWORK_SUCCESS";

function getNetworkSuccess(getNetworkResponse) {
  return (dispatch, getState) => {
    const { testnet, mainnet } = getState().grpc;
    const { network } = getState().daemon;
    var currentNetwork = getNetworkResponse.getActiveNetwork();
    // XXX remove network magic numbers here
    var networkStr = "";
    if ((currentNetwork == testnet && network == "testnet") ||
      (currentNetwork == mainnet && network == "mainnet")) {
      networkStr = network;
      getNetworkResponse.networkStr = networkStr;
      dispatch({ getNetworkResponse: getNetworkResponse, type: GETNETWORK_SUCCESS });
    } else {
      dispatch({ error: "Invalid network detected", type: GETNETWORK_FAILED });
      setTimeout(() => { dispatch(pushHistory("/walletError")); }, 1000);
    }
  };
}

export const getNetworkAttempt = () => (dispatch, getState) => {
  dispatch({ type: GETNETWORK_ATTEMPT });
  wallet.getNetwork(sel.walletService(getState()))
    .then(resp => dispatch(getNetworkSuccess(resp)))
    .catch(error => {
      dispatch({ error, type: GETNETWORK_FAILED });
      setTimeout(() => { dispatch(pushHistory("/walletError")); }, 1000);
    });
};

export const GETPING_ATTEMPT = "GETPING_ATTEMPT";
export const GETPING_FAILED = "GETPING_FAILED";
export const GETPING_SUCCESS = "GETPING_SUCCESS";

export const getPingAttempt = () => (dispatch, getState) =>
  wallet.doPing(sel.walletService(getState()))
    .then(() => setTimeout(() => dispatch(getPingAttempt()), 10000))
    .catch(error => {
      const { daemon: { shutdownRequested } } = getState();
      dispatch({ error, type: GETPING_FAILED });
      if (!shutdownRequested) setTimeout(() => { dispatch(pushHistory("/walletError")); }, 1000);
    });

export const GETSTAKEINFO_ATTEMPT = "GETSTAKEINFO_ATTEMPT";
export const GETSTAKEINFO_FAILED = "GETSTAKEINFO_FAILED";
export const GETSTAKEINFO_SUCCESS = "GETSTAKEINFO_SUCCESS";

export const getStakeInfoAttempt = () => (dispatch, getState) => {
  dispatch({ type: GETSTAKEINFO_ATTEMPT });
  wallet.getStakeInfo(sel.walletService(getState()))
    .then(resp => {
      let { getStakeInfoResponse } = getState().grpc;
      dispatch({ getStakeInfoResponse: resp, type: GETSTAKEINFO_SUCCESS });

      const checkedFields = [ "getExpired", "getLive", "getMissed", "getOwnMempoolTix",
        "getRevoked", "getVoted" ];
      const reloadTickets = getStakeInfoResponse
        ? checkedFields.reduce((a, v) => a||getStakeInfoResponse[v]() !== resp[v](), false)
        : false;

      if (reloadTickets) {
        // TODO: once we switch to fully streamed getTickets(), just invalidate
        // the current ticket list.
        setTimeout( () => {dispatch(getTicketsInfoAttempt());}, 1000);
      }
    })
    .catch(error => dispatch({ error, type: GETSTAKEINFO_FAILED }));
};

export const GETTICKETPRICE_ATTEMPT = "GETTICKETPRICE_ATTEMPT";
export const GETTICKETPRICE_FAILED = "GETTICKETPRICE_FAILED";
export const GETTICKETPRICE_SUCCESS = "GETTICKETPRICE_SUCCESS";

export const getTicketPriceAttempt = () => (dispatch, getState) => {
  dispatch({ type: GETTICKETPRICE_ATTEMPT });
  wallet.getTicketPrice(sel.walletService(getState()))
    .then(res => dispatch({ getTicketPriceResponse: res, type: GETTICKETPRICE_SUCCESS }))
    .catch(error => dispatch({ error, type: GETTICKETPRICE_FAILED }));
};

export const GETACCOUNTS_ATTEMPT = "GETACCOUNTS_ATTEMPT";
export const GETACCOUNTS_FAILED = "GETACCOUNTS_FAILED";
export const GETACCOUNTS_SUCCESS = "GETACCOUNTS_SUCCESS";

export const getAccountsAttempt = (startup) => async (dispatch, getState) => {
  dispatch({ type: GETACCOUNTS_ATTEMPT });
  try {
    const response = await wallet.getAccounts(sel.walletService(getState()));
    if (startup) dispatch(getAccountsBalances(response.getAccountsList()));
    dispatch({ accounts: response.getAccountsList(), response, type: GETACCOUNTS_SUCCESS });
  } catch (error) {
    dispatch({ error, type: GETACCOUNTS_FAILED });
  }
};

export const UPDATEHIDDENACCOUNTS = "UPDATEHIDDENACCOUNTS";
export const UPDATEACCOUNT_SUCCESS = "UPDATEACCOUNT_SUCCESS";

export function updateAccount(account) {
  return (dispatch, getState) => {
    const { grpc: { balances } } = getState();
    const existingAccount = balances.find(a => a.accountNumber === account.accountNumber);
    const updatedAccount = { ...existingAccount, ...account };
    const updatedBalances = balances.map(a =>
      (a.accountNumber === account.accountNumber) ? updatedAccount : a);
    if (!existingAccount) {
      updatedBalances.push(updatedAccount);
    }

    dispatch({ balances: updatedBalances, type: GETBALANCE_SUCCESS });
  };
}

export function hideAccount(accountNumber) {
  return (dispatch, getState) => {
    const { daemon: { walletName, hiddenAccounts } } = getState();
    var updatedHiddenAccounts = [ ...hiddenAccounts ];
    if (updatedHiddenAccounts.indexOf(accountNumber) === -1) {
      updatedHiddenAccounts.push(accountNumber);
    }
    var cfg = getWalletCfg(sel.isTestNet(getState()), walletName);
    cfg.set("hiddenaccounts", updatedHiddenAccounts);
    dispatch({ hiddenAccounts: updatedHiddenAccounts, type: UPDATEHIDDENACCOUNTS });
    dispatch(updateAccount({ accountNumber, hidden: true }));
  };
}

export function showAccount(accountNumber) {
  return (dispatch, getState) => {
    const { daemon: { walletName, hiddenAccounts } } = getState();
    var updatedHiddenAccounts = Array();
    for (var i = 0; i < hiddenAccounts.length; i++) {
      if (hiddenAccounts[i] !== accountNumber) {
        updatedHiddenAccounts.push(hiddenAccounts[i]);
      }
    }
    var cfg = getWalletCfg(sel.isTestNet(getState()), walletName);
    cfg.set("hiddenaccounts", updatedHiddenAccounts);
    dispatch({ hiddenAccounts: updatedHiddenAccounts, type: UPDATEHIDDENACCOUNTS });
    dispatch(updateAccount({ accountNumber, hidden: false }));
  };
}

export const GETTICKETS_ATTEMPT = "GETTICKETS_ATTEMPT";
export const GETTICKETS_FAILED = "GETTICKETS_FAILED";
export const GETTICKETS_COMPLETE = "GETTICKETS_COMPLETE";

export const getTicketsInfoAttempt = () => (dispatch, getState) => {
  const { grpc: { getTicketsRequestAttempt } } = getState();
  if (getTicketsRequestAttempt) return;

  // using 0..-1 requests all+unmined tickets
  let startRequestHeight = 0;
  let endRequestHeight = -1;

  dispatch({ type: GETTICKETS_ATTEMPT });
  wallet.getTickets(sel.walletService(getState()), startRequestHeight, endRequestHeight)
    .then(tickets => setTimeout(() => dispatch({ tickets, type: GETTICKETS_COMPLETE }), 1000))
    .catch(error => console.error(error + " Please try again"));
};

export const GETTRANSACTIONS_ATTEMPT = "GETTRANSACTIONS_ATTEMPT";
export const GETTRANSACTIONS_FAILED = "GETTRANSACTIONS_FAILED";
export const GETTRANSACTIONS_COMPLETE = "GETTRANSACTIONS_COMPLETE";

// filterTransactions filters a list of transactions given a filtering object.
//
// Currently supported filters in the filter object:
// - type (array): Array of types a transaction must belong to, to be accepted.
// - direction (string): A string of one of the allowed directions for regular
//   transactions (sent/received/transfered)
//
// If empty, all transactions are accepted.
function filterTransactions(transactions, filter) {
  return transactions
    .filter(v => filter.types.length ? filter.types.indexOf(v.type) > -1 : true)
    .filter(v => filter.direction ? filter.direction === v.direction : true)
    .filter(v => filter.search ? v.creditAddresses.find(address => address.length > 1 && address.toLowerCase().indexOf(filter.search.toLowerCase()) !== -1) != undefined : true);
}

// getTransactions loads a list of transactions from the wallet, given the
// current grpc state.
//
// Every call to getTransactions() tries to get `grpc.maximumTransactionCount`
// transactions from the wallet, given the current filter for transactions.
// Note that more than that amount of transactions may be obtained, as the
// iteration of transactions on the wallet is done by block height.
//
// When no more transactions are available given the current filter,
// `grpc.noMoreTransactions` is set to true.
export const getTransactions = () => async (dispatch, getState) => {
  const { currentBlockHeight, getTransactionsRequestAttempt,
    transactionsFilter, walletService, maximumTransactionCount, recentTransactionCount } = getState().grpc;
  let { noMoreTransactions, lastTransaction, minedTransactions, recentRegularTransactions, recentStakeTransactions } = getState().grpc;
  if (getTransactionsRequestAttempt || noMoreTransactions) return;

  if (!currentBlockHeight) {
    // Wait a little then re-dispatch this call since we have no starting height yet
    setTimeout(() => { dispatch(getTransactions()); }, 1000);
    return;
  }
  dispatch({ type: GETTRANSACTIONS_ATTEMPT });

  // Amount of transactions to obtain at each walletService.getTransactions request (a "page")
  const pageCount = maximumTransactionCount;

  // List of transactions found after filtering
  let filtered = [];

  // first, request unmined transactions. They always come first in decrediton.
  let { unmined } = await walletGetTransactions(walletService, -1, -1, 0);
  let unminedTransactions = filterTransactions(unmined, transactionsFilter);

  // now, request a batch of mined transactions until `maximumTransactionCount`
  // transactions have been obtained (after filtering)
  while (!noMoreTransactions && (filtered.length < maximumTransactionCount)) {
    let startRequestHeight, endRequestHeight;

    if ( transactionsFilter.listDirection === "desc" ) {
      startRequestHeight = lastTransaction ? lastTransaction.height -1 : currentBlockHeight;
      endRequestHeight = 1;
    } else {
      startRequestHeight = lastTransaction ? lastTransaction.height +1 : 1;
      endRequestHeight = currentBlockHeight;
    }

    try {
      let { mined } = await walletGetTransactions(walletService,
        startRequestHeight, endRequestHeight, pageCount);
      noMoreTransactions = mined.length === 0;
      lastTransaction = mined.length ? mined[mined.length -1] : lastTransaction;
      filterTransactions(mined, transactionsFilter)
        .forEach(v => filtered.push(v));
    } catch (error) {
      dispatch({ type: GETTRANSACTIONS_FAILED, error });
      return;
    }
  }

  minedTransactions = [ ...minedTransactions, ...filtered ];

  if (transactionsFilter.types.indexOf(TransactionDetails.TransactionType.REGULAR) > -1) {
    recentRegularTransactions = [ ...unminedTransactions, ...minedTransactions ];
    recentRegularTransactions = recentRegularTransactions.slice(0, recentTransactionCount);
  } else if (transactionsFilter.types.indexOf(TransactionDetails.TransactionType.VOTE) > -1) {
    recentStakeTransactions = [ ...unminedTransactions, ...minedTransactions ];
    recentStakeTransactions = recentStakeTransactions.slice(0, recentTransactionCount);
  }

  const stateChange = { unminedTransactions, minedTransactions,
    noMoreTransactions, lastTransaction, recentRegularTransactions, recentStakeTransactions, type: GETTRANSACTIONS_COMPLETE };
  dispatch(stateChange);
  return stateChange;
};

export const NEW_TRANSACTIONS_RECEIVED = "NEW_TRANSACTIONS_RECEIVED";

function checkAccountsToUpdate(txs, accountsToUpdate) {
  txs.forEach(tx => {
    tx.tx.getCreditsList().forEach(credit => {if (accountsToUpdate.find(eq(credit.getAccount())) === undefined) accountsToUpdate.push(credit.getAccount());});
    tx.tx.getDebitsList().forEach(debit => {if (accountsToUpdate.find(eq(debit.getPreviousAccount())) === undefined) accountsToUpdate.push(debit.getPreviousAccount());});
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
// newTransactionsReceived should be called when a new set of transactions has
// been received from the wallet (through a notification).
export const newTransactionsReceived = (newlyMinedTransactions, newlyUnminedTransactions) => (dispatch, getState) => {
  if (!newlyMinedTransactions.length && !newlyUnminedTransactions.length) return;

  let { unminedTransactions, minedTransactions, recentRegularTransactions, recentStakeTransactions } = getState().grpc;
  const { transactionsFilter, recentTransactionCount } = getState().grpc;
  const chainParams = sel.chainParams(getState());

  // aux maps of [txhash] => tx (used to ensure no duplicate txs)
  const newlyMinedMap = newlyMinedTransactions.reduce((m, v) => {m[v.hash] = v; return m;}, {});
  const newlyUnminedMap = newlyUnminedTransactions.reduce((m, v) => {m[v.hash] = v; return m;}, {});

  const minedMap = minedTransactions.reduce((m, v) => {m[v.hash] = v; return m;}, {});
  const unminedMap = unminedTransactions.reduce((m, v) => {m[v.hash] = v; return m;}, {});

  const unminedDupeCheck =  newlyUnminedTransactions.filter(tx => !minedMap[tx.hash] && !unminedMap[tx.hash]);

  var accountsToUpdate = new Array();
  accountsToUpdate = checkAccountsToUpdate(unminedDupeCheck, accountsToUpdate);
  accountsToUpdate = checkAccountsToUpdate(newlyMinedTransactions, accountsToUpdate);
  accountsToUpdate = Array.from(new Set(accountsToUpdate));
  accountsToUpdate.forEach(v => dispatch(getBalanceUpdateAttempt(v, 0)));

  if (checkForStakeTransactions(unminedDupeCheck) || checkForStakeTransactions(newlyMinedTransactions)) dispatch(getStakeInfoAttempt());

  unminedTransactions = filterTransactions([
    ...newlyUnminedTransactions,
    ...unminedTransactions.filter(tx => !newlyMinedMap[tx.hash] && !newlyUnminedMap[tx.hash])
  ], transactionsFilter);

  const regularTransactionFilter = {
    listDirection: "desc",
    types: [ TransactionDetails.TransactionType.REGULAR ],
    direction: null,
  };

  recentRegularTransactions = filterTransactions([
    ...newlyUnminedTransactions,
    ...newlyMinedTransactions,
    ...recentRegularTransactions.filter(tx => !newlyMinedMap[tx.hash] && !newlyUnminedMap[tx.hash])
  ], regularTransactionFilter).slice(0, recentTransactionCount);

  const stakeTransactionFilter = {
    listDirection: "desc",
    types: [ TransactionDetails.TransactionType.TICKET_PURCHASE, TransactionDetails.TransactionType.VOTE, TransactionDetails.TransactionType.REVOCATION ],
    direction: null,
  };

  recentStakeTransactions = filterTransactions([
    ...newlyUnminedTransactions,
    ...newlyMinedTransactions,
    ...recentStakeTransactions.filter(tx => !newlyMinedMap[tx.hash] && !newlyUnminedMap[tx.hash])
  ], stakeTransactionFilter).slice(0, recentTransactionCount);

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

  dispatch({ unminedTransactions, minedTransactions, newlyUnminedTransactions,
    newlyMinedTransactions, recentRegularTransactions, recentStakeTransactions, type: NEW_TRANSACTIONS_RECEIVED });

  if (newlyMinedTransactions.length > 0) {
    dispatch(getStartupStats());
  }
};

// getMostRecentRegularTransactions clears the transaction filter and refetches
// the first page of transactions. This is used to get and store the initial
// list of recent transactions.
export const getMostRecentRegularTransactions = () => dispatch => {
  const defaultFilter = {
    listDirection: "desc",
    types: [ TransactionDetails.TransactionType.REGULAR ],
    direction: null,
  };
  return dispatch(changeTransactionsFilter(defaultFilter));
};

export const getMostRecentStakeTransactions = () => dispatch => {
  const defaultFilter = {
    listDirection: "desc",
    types: [ TransactionDetails.TransactionType.TICKET_PURCHASE, TransactionDetails.TransactionType.VOTE, TransactionDetails.TransactionType.REVOCATION ],
    direction: null,
  };
  return dispatch(changeTransactionsFilter(defaultFilter));
};

export const getMostRecentTransactions = () => dispatch => {
  const defaultFilter = {
    search: null,
    listDirection: "desc",
    types: [],
    direction: null,
  };
  return dispatch(changeTransactionsFilter(defaultFilter));
};

export const CHANGE_TRANSACTIONS_FILTER = "CHANGE_TRANSACTIONS_FILTER";
export function changeTransactionsFilter(newFilter) {
  return (dispatch) => {
    dispatch({ transactionsFilter: newFilter, type: CHANGE_TRANSACTIONS_FILTER });
    return dispatch(getTransactions());
  };
}

export const UPDATETIMESINCEBLOCK = "UPDATETIMESINCEBLOCK";
export function updateBlockTimeSince() {
  return (dispatch, getState) => {
    const { transactionNtfnsResponse } = getState().notifications;
    const { recentBlockTimestamp } = getState().grpc;
    if (transactionNtfnsResponse !== null && transactionNtfnsResponse.getAttachedBlocksList().length > 0) {
      const attachedBlocks = transactionNtfnsResponse.getAttachedBlocksList();
      var lastBlockTimestamp = attachedBlocks[0].getTimestamp();
      if (recentBlockTimestamp != lastBlockTimestamp) {
        dispatch({
          recentBlockTimestamp: lastBlockTimestamp,
          type: UPDATETIMESINCEBLOCK });
      }
    }
  };
}

export const GETAGENDASERVICE_ATTEMPT = "GETAGENDASERVICE_ATTEMPT";
export const GETAGENDASERVICE_FAILED = "GETAGENDASERVICE_FAILED";
export const GETAGENDASERVICE_SUCCESS = "GETAGENDASERVICE_SUCCESS";

export const getAgendaServiceAttempt = () => (dispatch, getState) => {
  const { grpc: { address, port } } = getState();
  const { daemon: { walletName } } = getState();
  dispatch({ type: GETAGENDASERVICE_ATTEMPT });
  wallet.getAgendaService(sel.isTestNet(getState()), walletName, address, port)
    .then(agendaService => {
      dispatch({ agendaService, type: GETAGENDASERVICE_SUCCESS });
      setTimeout(() => { dispatch(getAgendasAttempt()); }, 10);
    })
    .catch(error => dispatch({ error, type: GETAGENDASERVICE_FAILED }));
};

export const GETVOTINGSERVICE_ATTEMPT = "GETVOTINGSERVICE_ATTEMPT";
export const GETVOTINGSERVICE_FAILED = "GETVOTINGSERVICE_FAILED";
export const GETVOTINGSERVICE_SUCCESS = "GETVOTINGSERVICE_SUCCESS";

export const getVotingServiceAttempt = () => (dispatch, getState) => {
  const { grpc: { address, port } } = getState();
  const { daemon: { walletName } } = getState();
  dispatch({ type: GETVOTINGSERVICE_ATTEMPT });
  wallet.getVotingService(sel.isTestNet(getState()), walletName, address, port)
    .then(votingService => dispatch({ votingService, type: GETVOTINGSERVICE_SUCCESS }))
    .catch(error => dispatch({ error, type: GETVOTINGSERVICE_FAILED }));
};

export const GETAGENDAS_ATTEMPT = "GETAGENDAS_ATTEMPT";
export const GETAGENDAS_FAILED = "GETAGENDAS_FAILED";
export const GETAGENDAS_SUCCESS = "GETAGENDAS_SUCCESS";

export const getAgendasAttempt = () => (dispatch, getState) => {
  dispatch({ type: GETAGENDAS_ATTEMPT });
  wallet.getAgendas(sel.agendaService(getState()))
    .then(agendas => dispatch({ agendas, type: GETAGENDAS_SUCCESS }))
    .catch(error => dispatch({ error, type: GETAGENDAS_FAILED }));
};

export const GETVOTECHOICES_ATTEMPT = "GETVOTECHOICES_ATTEMPT";
export const GETVOTECHOICES_FAILED = "GETVOTECHOICES_FAILED";
export const GETVOTECHOICES_SUCCESS = "GETVOTECHOICES_SUCCESS";

export const getVoteChoicesAttempt = (stakePool) => (dispatch, getState) => {
  dispatch({ type: GETVOTECHOICES_ATTEMPT });
  wallet.getVoteChoices(sel.votingService(getState()))
    .then(voteChoices => {
      dispatch({ voteChoices, type: GETVOTECHOICES_SUCCESS });
      dispatch(setStakePoolVoteChoices(stakePool, voteChoices));
    })
    .catch(error => dispatch({ error, type: GETVOTECHOICES_FAILED }));
};

export const SETVOTECHOICES_ATTEMPT = "SETVOTECHOICES_ATTEMPT";
export const SETVOTECHOICES_FAILED = "SETVOTECHOICES_FAILED";
export const SETVOTECHOICES_SUCCESS = "SETVOTECHOICES_SUCCESS";

export const setVoteChoicesAttempt = (stakePool, agendaId, choiceId) => (dispatch, getState) => {
  dispatch({ payload: { agendaId, choiceId }, type: SETVOTECHOICES_ATTEMPT });
  wallet.setAgendaVote(sel.votingService(getState()), agendaId, choiceId)
    .then(response => {
      dispatch({ response, type: SETVOTECHOICES_SUCCESS });
      dispatch(getVoteChoicesAttempt(stakePool));
    })
    .catch(error => dispatch({ error, type: SETVOTECHOICES_FAILED }));
};

export const GETMESSAGEVERIFICATIONSERVICE_ATTEMPT = "GETMESSAGEVERIFICATIONSERVICE_ATTEMPT";
export const GETMESSAGEVERIFICATIONSERVICE_FAILED = "GETMESSAGEVERIFICATIONSERVICE_FAILED";
export const GETMESSAGEVERIFICATIONSERVICE_SUCCESS = "GETMESSAGEVERIFICATIONSERVICE_SUCCESS";

export const getMessageVerificationServiceAttempt = () => (dispatch, getState) => {
  const { grpc: { address, port } } = getState();
  const { daemon: { walletName } } = getState();
  dispatch({ type: GETMESSAGEVERIFICATIONSERVICE_ATTEMPT });
  wallet.getMessageVerificationService(sel.isTestNet(getState()), walletName, address, port)
    .then(messageVerificationService =>
      dispatch({ messageVerificationService, type: GETMESSAGEVERIFICATIONSERVICE_SUCCESS }))
    .catch(error => dispatch({ error, type: GETMESSAGEVERIFICATIONSERVICE_FAILED }));
};

export const listenForAppReloadRequest = cb => () => onAppReloadRequested(cb);

export const showTicketList = status => dispatch =>
  dispatch(pushHistory("/tickets/mytickets/" + status));

export const goBackHistory = () => dispatch => dispatch(goBack());

export const SEEDCOPIEDTOCLIPBOARD = "SEEDCOPIEDTOCLIPBOARD";
export const copySeedToClipboard = (mnemonic) => (dispatch) => {
  clipboard.clear();
  clipboard.writeText(mnemonic);
  dispatch({ type: SEEDCOPIEDTOCLIPBOARD });
};
