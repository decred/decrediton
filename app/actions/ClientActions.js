// @flow
import * as wallet from "wallet";
import * as sel from "selectors";
import eq from "lodash/fp/eq";
import { getNextAddressAttempt, publishUnminedTransactionsAttempt } from "./ControlActions";
import { transactionNtfnsStart, accountNtfnsStart } from "./NotificationActions";
import { refreshStakepoolPurchaseInformation, setStakePoolVoteChoices, getStakepoolStats } from "./StakePoolActions";
import { getDecodeMessageServiceAttempt, decodeRawTransactions } from "./DecodeMessageActions";
import { push as pushHistory, goBack } from "react-router-redux";
import { getWalletCfg, getGlobalCfg } from "../config";
import { onAppReloadRequested } from "wallet";
import { getTransactions as walletGetTransactions } from "wallet/service";
import { TransactionDetails } from "middleware/walletrpc/api_pb";
import { clipboard } from "electron";
import { getStartupStats } from "./StatisticsActions";
import { getVettedProposals } from "./GovernanceActions";
import { rawHashToHex } from "../helpers/byteActions";
import * as da from "../middleware/dcrdataapi";
import { EXTERNALREQUEST_DCRDATA, EXTERNALREQUEST_POLITEIA } from "main_dev/externalRequests";

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
  return (dispatch) => {
    dispatch({ walletService, type: GETWALLETSERVICE_SUCCESS });
  };
}

export const STARTWALLETSERVICE_ATTEMPT = "STARTWALLETSERVICE_ATTEMPT";
export const STARTWALLETSERVICE_FAILED = "STARTWALLETSERVICE_FAILED";
export const STARTWALLETSERVICE_SUCCESS = "STARTWALLETSERVICE_SUCCESS";

const startWalletServicesTrigger = () => (dispatch, getState) => new Promise((resolve,reject) => {
  try {
    setTimeout( async () => {
      const { spvSynced } = getState().walletLoader;
      if (!spvSynced) {
        dispatch(getTicketBuyerServiceAttempt());
      }

      await dispatch(getNextAddressAttempt(0));
      await dispatch(getTicketPriceAttempt());
      await dispatch(getPingAttempt());
      await dispatch(getNetworkAttempt());
      await dispatch(refreshStakepoolPurchaseInformation());
      await dispatch(getDecodeMessageServiceAttempt());
      await dispatch(getVotingServiceAttempt());
      await dispatch(getAgendaServiceAttempt());
      await dispatch(getStakepoolStats());
      await dispatch(getStartupWalletInfo());
      await dispatch(transactionNtfnsStart());
      await dispatch(accountNtfnsStart());

      await dispatch(pushHistory("/home"));
      resolve();
    }, 1000);
  } catch (err) {
    reject (err);
  }
});

export const startWalletServices = () => (dispatch, getState) => {
  const { startWalletServiceAttempt } = getState().grpc;
  if( startWalletServiceAttempt ) {
    return;
  }
  dispatch({ type: STARTWALLETSERVICE_ATTEMPT });
  dispatch(startWalletServicesTrigger()).then(() => {
    dispatch({ type: STARTWALLETSERVICE_SUCCESS });
  }).catch(error => {
    dispatch({ type: STARTWALLETSERVICE_FAILED, error });
  });
};

export const GETSTARTUPWALLETINFO_ATTEMPT = "GETSTARTUPWALLETINFO_ATTEMPT";
export const GETSTARTUPWALLETINFO_SUCCESS = "GETSTARTUPWALLETINFO_SUCCESS";
export const GETSTARTUPWALLETINFO_FAILED = "GETSTARTUPWALLETINFO_FAILED";

export const getStartupWalletInfo = () => (dispatch) => {
  dispatch({ type: GETSTARTUPWALLETINFO_ATTEMPT });
  const config = getGlobalCfg();
  const dcrdataEnabled = config.get("allowed_external_requests").indexOf(EXTERNALREQUEST_DCRDATA) > -1;
  const politeiaEnabled = config.get("allowed_external_requests").indexOf(EXTERNALREQUEST_POLITEIA) > -1;

  return new Promise((resolve, reject) => {
    setTimeout( async () => {
      try {
        await dispatch(getStakeInfoAttempt());
        await dispatch(reloadTickets());
        await dispatch(getMostRecentRegularTransactions());
        await dispatch(getTransactionsSinceLastOppened());
        await dispatch(getMostRecentStakeTransactions());
        await dispatch(getMostRecentTransactions());
        await dispatch(publishUnminedTransactionsAttempt());
        await dispatch(findImmatureTransactions());
        await dispatch(getAccountsAttempt(true));
        await dispatch(getStartupStats());
        if (dcrdataEnabled) {
          dispatch(getTreasuryBalance());
        }
        if (politeiaEnabled) {
          dispatch(getVettedProposals());
        }
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
    chainParams.TicketMaturity,
    chainParams.CoinbaseMaturity,
    chainParams.SStxChangeMaturity
  ];
  const immatureHeight = currentBlockHeight - Math.max(...checkHeightDeltas);

  let checkHeights = {};
  const mergeCheckHeights = (hs) => Object.keys(hs).forEach(h => {
    if (h < currentBlockHeight) return;
    const accounts = checkHeights[h] || [];
    hs[h].forEach(a => accounts.indexOf(a) === -1 ? accounts.push(a) : null);
    checkHeights[h] = accounts;
  });

  dispatch({ immatureHeight, type: "FINDIMMATURETRANSACTIONS_START" });

  let txs = await walletGetTransactions(walletService, immatureHeight,
    currentBlockHeight, pageSize);

  while (txs.mined.length > 0) {
    let lastTx = txs.mined[txs.mined.length-1];
    mergeCheckHeights(transactionsMaturingHeights(txs.mined, chainParams));

    if (lastTx && lastTx.height >= currentBlockHeight) {
      // this may happen on wallets that take a long time to start up (eg: large
      // wallet left closed for a long time performing a rescan). If a new
      // block comes in with wallet transactions then the height of the new
      // transaction will exceed the currentBlockHeight (which is fetched at
      // the beginning of the startup procedure).
      break;
    }

    txs = await walletGetTransactions(walletService, lastTx.height+1,
      currentBlockHeight+1, pageSize);
  }

  dispatch({ type: "FINDIMMATURETRANSACTIONS_FINISHED" });

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

export const GETTRANSACTIONSSINCELASTOPPENED_ATTEMPT = "GETTRANSACTIONSSINCELASTOPPENED_ATTEMPT";
export const GETTRANSACTIONSSINCELASTOPPENED_FAILED = "GETTRANSACTIONSSINCELASTOPPENED_FAILED";
export const GETTRANSACTIONSSINCELASTOPPENED_SUCCESS = "GETTRANSACTIONSSINCELASTOPPENED_SUCCESS";

export const getTransactionsSinceLastOppened = () => async (dispatch, getState) => {
  dispatch({ type: GETTRANSACTIONSSINCELASTOPPENED_ATTEMPT });
  const transactionsSinceLastOpenedInfo = {
    transactionsReceived: [],
    ticketsVoted:         [],
    ticketsRevoked:       [],
    totalReward:           0,
    totalDCR:              0,
  };
  const config = getGlobalCfg();
  const lastBlockHeightSeen = config.get("last_height");
  const { currentBlockHeight, walletService, recentTxSinceLastOpenedCount } = getState().grpc;

  try {
    const { mined, unmined } =
      await walletGetTransactions(walletService, lastBlockHeightSeen, currentBlockHeight, recentTxSinceLastOpenedCount);
    const transactions = [ ...mined, ...unmined ];

    transactions.forEach( tx => {
      switch (tx.type) {
      case TransactionDetails.TransactionType.REGULAR:
        transactionsSinceLastOpenedInfo.totalDCR += tx.amount;
        transactionsSinceLastOpenedInfo.transactionsReceived.push(tx);
        break;
      case TransactionDetails.TransactionType.VOTE:
        transactionsSinceLastOpenedInfo.totalReward += tx.amount;
        transactionsSinceLastOpenedInfo.ticketsVoted.push(tx);
        break;
      case TransactionDetails.TransactionType.REVOCATION:
        transactionsSinceLastOpenedInfo.ticketsRevoked.push(tx);
        break;
      }
    });
    dispatch({ transactionsSinceLastOpened: transactionsSinceLastOpenedInfo, type: GETTRANSACTIONSSINCELASTOPPENED_SUCCESS });
  } catch (error) {
    dispatch({ error, type: GETTRANSACTIONSSINCELASTOPPENED_FAILED });
  }
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
    })
    .catch(error => dispatch({ error, type: GETTICKETBUYERSERVICE_FAILED }));
};

export const getAccountNumbersBalances = (accountNumbers) => (dispatch) => {
  accountNumbers.forEach(a => dispatch(getBalanceUpdateAttempt(a, 0)));
};

const getAccountsBalances = (accounts) => (dispatch, getState) => {
  const walletService = sel.walletService(getState());
  const chainParams = sel.chainParams(getState());
  const hiddenAccounts = sel.hiddenAccounts(getState());

  const promises = accounts.map(async (account) => {
    const resp = await wallet.getBalance(walletService, account.getAccountNumber(), 0);
    return {
      accountNumber: account.getAccountNumber(),
      accountName: account.getAccountName(),
      externalKeys: account.getExternalKeyCount(),
      internalKeys: account.getInternalKeyCount(),
      importedKeys: account.getImportedKeyCount(),
      hidden: !!hiddenAccounts.find(eq(account.getAccountNumber())),
      HDPath: "m / 44' / " + chainParams.HDCoinType + "' / " + account.getAccountNumber() + "'",
      total: resp.getTotal(),
      spendable: resp.getSpendable(),
      immatureReward: resp.getImmatureReward(),
      immatureStakeGeneration: resp.getImmatureStakeGeneration(),
      lockedByTickets: resp.getLockedByTickets(),
      votingAuthority: resp.getVotingAuthority(),
    };
  });

  return Promise.all(promises)
    .then(balances => dispatch({ balances, type: GETBALANCE_SUCCESS }))
    .catch(error => dispatch({ error, type: GETBALANCE_FAILED }));
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

export const GETBESTBLOCK_ATTEMPT = "GETBESTBLOCK_ATTEMPT";
export const GETBESTBLOCK_FAILED = "GETBESTBLOCK_FAILED";
export const GETBESTBLOCK_SUCCESS = "GETBESTBLOCK_SUCCESS";

export const getBestBlockHeightAttempt = (cb) => (dispatch, getState) => {
  const { getBestBlockHeightRequest } = getState().grpc;
  if (getBestBlockHeightRequest) {
    return;
  }
  if (sel.walletService(getState()) == null) {
    setTimeout(() => dispatch(getBestBlockHeightAttempt(cb)), 100);
    return;
  }
  dispatch({ type: GETBESTBLOCK_ATTEMPT });
  wallet.bestBlock(sel.walletService(getState()))
    .then(resp => {
      dispatch({ height: resp.getHeight(), type: GETBESTBLOCK_SUCCESS });
      if (cb) {
        dispatch(cb());
      }
    })
    .catch(error => {
      dispatch({ error, type: GETBESTBLOCK_FAILED });
    });
};

export const GETNETWORK_ATTEMPT = "GETNETWORK_ATTEMPT";
export const GETNETWORK_FAILED = "GETNETWORK_FAILED";
export const GETNETWORK_SUCCESS = "GETNETWORK_SUCCESS";

function getNetworkSuccess(getNetworkResponse) {
  return (dispatch, getState) => {
    const { testnet, mainnet } = getState().grpc;
    const { currentSettings } = getState().settings;
    const network = currentSettings.network;
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
export const GETPING_CANCELED = "GETPING_CANCELED";

export const getPingAttempt = () => (dispatch, getState) =>
  wallet.doPing(sel.walletService(getState()))
    .then(() => {
      const pingTimer = setTimeout(() => dispatch(getPingAttempt()), 10000);
      dispatch({ pingTimer, type: GETPING_SUCCESS });
    })
    .catch(error => {
      const { daemon: { shutdownRequested } } = getState();
      dispatch({ error, type: GETPING_FAILED });
      if (!shutdownRequested) setTimeout(() => { dispatch(pushHistory("/walletError")); }, 1000);
    });

export const cancelPingAttempt = () => (dispatch, getState) => {
  const { pingTimer } = getState().grpc;
  if (pingTimer) {
    clearTimeout(pingTimer);
    dispatch({ type: GETPING_CANCELED });
  }
};

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
      const doReloadTickets = getStakeInfoResponse
        ? checkedFields.reduce((a, v) => a||getStakeInfoResponse[v]() !== resp[v](), false)
        : false;

      if (doReloadTickets) {
        setTimeout( () => { dispatch(reloadTickets()); }, 1000);
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
    if (startup) await dispatch(getAccountsBalances(response.getAccountsList()));
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
    let updatedBalances;
    if (!existingAccount) {
      const chainParams = sel.chainParams(getState());
      const newAccount = {
        immatureReward: 0,
        immatureStakeGeneration: 0,
        lockedByTickets: 0,
        spendable: 0,
        total: 0,
        votingAuthority: 0,
        HDPath: "m / 44' / " + chainParams.HDCoinType + "' / " + account.accountNumber + "'",
        ...account
      };
      updatedBalances = [ ...balances, newAccount ];
    } else {
      const updatedAccount = { ...existingAccount, ...account };
      updatedBalances = balances.map(a =>
        (a.accountNumber === account.accountNumber) ? updatedAccount : a);
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

function filterTickets(tickets, filter) {
  return tickets
    .filter(v => filter.status.length ? filter.status.indexOf(v.status) > -1 : true );
}

export const getTickets = () => async (dispatch, getState) => {
  const { getTicketsRequestAttempt } = getState().grpc;
  if (getTicketsRequestAttempt) return;

  dispatch({ type: GETTICKETS_ATTEMPT });

  const { ticketsFilter, maximumTransactionCount, walletService,
    currentBlockHeight } = getState().grpc;
  let { noMoreTickets, lastTicket, minedTickets } = getState().grpc;
  const pageCount = maximumTransactionCount;

  // List of transactions found after filtering
  let filtered = [];
  let tickets;

  // always request unmined tickets as new ones may be available or some may
  // have been mined
  tickets = await wallet.getTickets(walletService, -1, -1, 0);
  const unminedFiltered = filterTickets(tickets, ticketsFilter);
  const unminedTickets = sel.ticketsNormalizer(getState())(unminedFiltered);

  // now, request a batch of mined transactions until `maximumTransactionCount`
  // transactions have been obtained (after filtering)
  while (!noMoreTickets && (filtered.length < maximumTransactionCount)) {
    let startRequestHeight, endRequestHeight;

    if ( ticketsFilter.listDirection === "desc" ) {
      startRequestHeight = lastTicket ? lastTicket.block.getHeight() -1 : currentBlockHeight;
      endRequestHeight = 1;
    } else {
      startRequestHeight = lastTicket ? lastTicket.block.getHeight() +1 : 1;
      endRequestHeight = currentBlockHeight;
    }

    try {
      tickets = await wallet.getTickets(walletService,
        startRequestHeight, endRequestHeight, pageCount);
      noMoreTickets = tickets.length === 0;
      lastTicket = tickets.length ? tickets[tickets.length -1] : lastTicket;
      filterTickets(tickets, ticketsFilter)
        .forEach(v => filtered.push(v));
    } catch (error) {
      dispatch({ error, type: GETTICKETS_FAILED });
      return;
    }
  }

  const normalized = sel.ticketsNormalizer(getState())(filtered);

  minedTickets = [ ...minedTickets, ...normalized ];

  dispatch({ unminedTickets, minedTickets,
    noMoreTickets, lastTicket, type: GETTICKETS_COMPLETE });
};

export const RAWTICKETTRANSACTIONS_DECODED = "RAWTICKETTRANSACTIONS_DECODED";
export const decodeRawTicketTransactions = (ticket) => async (dispatch, getState) => {
  const toDecode = [];
  if (!ticket.decodedTicketTx) {
    toDecode.push(ticket.ticketRawTx);
    if (ticket.spenderHash) {
      toDecode.push(ticket.spenderRawTx);
    }
  }
  if (!toDecode.length) return;

  try {
    await dispatch(decodeRawTransactions(toDecode));
    const newTicket = sel.ticketNormalizer(getState())(ticket.originalTicket);
    dispatch({ ticket, newTicket, type: RAWTICKETTRANSACTIONS_DECODED });
  } catch (error) {
    console.log("xxxxx error in decodeRawTicketTransactions", error);
  }
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

export const GETTRANSACTIONS_ATTEMPT = "GETTRANSACTIONS_ATTEMPT";
export const GETTRANSACTIONS_FAILED = "GETTRANSACTIONS_FAILED";
export const GETTRANSACTIONS_COMPLETE = "GETTRANSACTIONS_COMPLETE";

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
  let reachedGenesis = false;
  while (!noMoreTransactions && (filtered.length < maximumTransactionCount) && !reachedGenesis) {
    let startRequestHeight, endRequestHeight;

    if ( transactionsFilter.listDirection === "desc" ) {
      startRequestHeight = lastTransaction ? lastTransaction.height -1 : currentBlockHeight;
      if (startRequestHeight < 1) break;
      endRequestHeight = 1;
    } else {
      startRequestHeight = lastTransaction ? lastTransaction.height +1 : 1;
      endRequestHeight = currentBlockHeight;
    }

    try {
      let { mined } = await walletGetTransactions(walletService,
        startRequestHeight, endRequestHeight, pageCount);
      lastTransaction = mined.length ? mined[mined.length -1] : lastTransaction;
      reachedGenesis = (transactionsFilter.listDirection === "desc") &&
        lastTransaction && (lastTransaction.height === 1);
      noMoreTransactions = mined.length === 0 || reachedGenesis;
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
    const { startupStatsEndCalcTime, startupStatsCalcSeconds } = getState().statistics;
    const secFromLastStats = (new Date() - startupStatsEndCalcTime) / 1000;
    if (secFromLastStats > 5*startupStatsCalcSeconds) {
      dispatch(getStartupStats());
    }
  }
};

// getMostRecentRegularTransactions clears the transaction filter and refetches
// the first page of transactions. This is used to get and store the initial
// list of recent transactions.
export const getMostRecentRegularTransactions = () => dispatch => {
  const defaultFilter = {
    search: null,
    listDirection: "desc",
    types: [ TransactionDetails.TransactionType.REGULAR ],
    direction: null,
    maxAmount: null,
    minAmount: null,
  };
  return dispatch(changeTransactionsFilter(defaultFilter));
};

export const getMostRecentStakeTransactions = () => dispatch => {
  const defaultFilter = {
    search: null,
    listDirection: "desc",
    types: [ TransactionDetails.TransactionType.TICKET_PURCHASE, TransactionDetails.TransactionType.VOTE, TransactionDetails.TransactionType.REVOCATION ],
    direction: null,
    maxAmount: null,
    minAmount: null,
  };
  return dispatch(changeTransactionsFilter(defaultFilter));
};

export const getMostRecentTransactions = () => dispatch => {
  const defaultFilter = {
    search: null,
    listDirection: "desc",
    types: [],
    direction: null,
    maxAmount: null,
    minAmount: null,
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

export const setVoteChoicesAttempt = (agendaId, choiceId) => (dispatch, getState) => {
  dispatch({ payload: { agendaId, choiceId }, type: SETVOTECHOICES_ATTEMPT });
  const stakePools = sel.configuredStakePools(getState());
  wallet.setAgendaVote(sel.votingService(getState()), agendaId, choiceId)
    .then(response => {
      dispatch({ response, type: SETVOTECHOICES_SUCCESS });
      for( var i = 0; i < stakePools.length; i++) {
        dispatch(getVoteChoicesAttempt(stakePools[i]));
      }
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

export const showPurchaseTicketsPage = () => dispatch =>
  dispatch(pushHistory("/tickets/purchase"));

export const goBackHistory = () => dispatch => dispatch(goBack());

export const SEEDCOPIEDTOCLIPBOARD = "SEEDCOPIEDTOCLIPBOARD";
export const copySeedToClipboard = (mnemonic) => (dispatch) => {
  clipboard.clear();
  clipboard.writeText(mnemonic);
  dispatch({ type: SEEDCOPIEDTOCLIPBOARD });
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

  let newTx;

  if (tx.txType == "Ticket") {
    // TODO: the wallet doesn't have a specific call to get ticket details
    // (including spender tx) from an arbitrary transaction hash, so for the
    // moment we can only get the ticket price and purchase date (enterTimestamp).
    // If this ever changes, we can probably merge this code path with the one
    // in the else clause below, so that voted/revoked tickets will show
    // all the relevant information.

    // Use the raw decoded transaction vs credit[0] due to situations where the
    // ticket submission output is not from this wallet (solo voting tickets and
    // split tickets)
    let decodedTx = sel.decodedTransactions(getState())[tx.txHash];
    if (!decodedTx) {
      decodedTx = (await dispatch(decodeRawTransactions([ tx.rawTx ])))[tx.txHash];
    }

    newTx = {
      ...tx.originalTx,
      enterTimestamp: tx.txTimestamp,
      ticketPrice: decodedTx.transaction.getOutputsList()[0].getValue(),
    };
  } else { // vote/revoke
    let decodedSpender = sel.decodedTransactions(getState())[tx.txHash];
    if (!decodedSpender) {
      // don't have the spender decoded. Request it.
      decodedSpender = (await dispatch(decodeRawTransactions([ tx.rawTx ])))[tx.txHash];
    }

    // Find the ticket hash of the vote/revoke. Determining whether it's a vote
    // or revocation by looking at the number of inputs is not great, but works
    // for now given the current consensus rules.
    const spenderInputs = decodedSpender.transaction.getInputsList();
    const outpIdx = spenderInputs.length === 1 ? 0 : 1;
    const ticketTxHash = rawHashToHex(spenderInputs[outpIdx].getPreviousTransactionHash());

    // given that the ticket may be much older than the transactions currently
    // in the `transactions` state var, we need to manually fetch the ticket
    // transaction
    const ticketTx = await wallet.getTransaction(sel.walletService(getState()),
      ticketTxHash);

    let decodedTicket = sel.decodedTransactions(getState())[ticketTxHash];
    if (!decodedTicket) {
      // don't have the ticket decoded. Request it.
      const rawTicketTx = Buffer.from(ticketTx.tx.getTransaction()).toString("hex");
      await dispatch(decodeRawTransactions([ rawTicketTx ]));
    }

    // normalize ticket+spender as if it was a result item from a wallet.getTickets call
    const ticket = {
      ticket: ticketTx.tx,
      spender: tx.originalTx.tx,
      status: tx.txType === "Vote" ? "voted" : "revoked",
    };
    const ticketNormal = sel.ticketNormalizer(getState())(ticket);

    newTx = {
      ...tx.originalTx,
      enterTimestamp: ticketNormal.enterTimestamp,
      leaveTimestamp: ticketNormal.leaveTimestamp,
      ticketPrice: ticketNormal.ticketPrice,
      ticketReward: ticketNormal.ticketReward,
      // add more stuff from the result of sel.ticketNormalizer if ever needed
    };
  }

  const oldTxs = getState().grpc.transactions;
  const txIdx = oldTxs.findIndex(t => t.txHash === tx.txHash);
  if (txIdx > -1) {
    const newTxs = [ ...oldTxs ];
    newTxs.splice(txIdx, 1, newTx);
    dispatch({ transactions: newTxs, txHash: tx.txHash, type: FETCHMISSINGSTAKETXDATA_SUCCESS });
  } else {
    // not supposed to happen in normal usage; this function  should only be
    // entered from a transaction already in the transaction list
    // (sel.transactions).
    dispatch({ txHash: tx.txHash, type: FETCHMISSINGSTAKETXDATA_FAILED });
  }
};

export const GETTREASURY_BALANCE_SUCCESS = "GETTREASURY_BALANCE_SUCCESS";
export const getTreasuryBalance = () => (dispatch, getState) => {
  const treasuryAddress = sel.chainParams(getState()).TreasuryAddress;
  const dURL = sel.dcrdataURL(getState());
  da.getTreasuryInfo(dURL, treasuryAddress)
    .then(treasuryInfo => {
      // Manually convert DCR to atom amounts to avoid floating point multiplication errors (eg. 589926.57667882*1e8 => 58992657667881.99)
      const treasuryBalance = parseInt(treasuryInfo["data"]["dcr_unspent"].toString().replace(".",""));
      dispatch({ treasuryBalance, type: GETTREASURY_BALANCE_SUCCESS });
    });
};

export const RESET_TREASURY_BALANCE = "RESET_TREASURY_BALANCE";
export const resetTreasuryBalance = () => (dispatch) => {
  dispatch({ type: RESET_TREASURY_BALANCE });
};
