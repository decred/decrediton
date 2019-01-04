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
import { rawHashToHex, reverseRawHash, strHashToRaw } from "helpers";
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
        await dispatch(getStartupTransactions());
        await dispatch(publishUnminedTransactionsAttempt());
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
      const { daemon: { shutdownRequested, walletError } } = getState();
      dispatch({ error, type: GETPING_FAILED });
      if (!shutdownRequested && !walletError) setTimeout(() => { dispatch(pushHistory("/walletError")); }, 1000);
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
export const GETTICKETS_PROGRESS = "GETTICKETS_PROGRESS";
export const GETTICKETS_CANCEL = "GETTICKETS_CANCEL";

function filterTickets(tickets, filter) {
  return tickets
    .filter(v => filter.status.length ? filter.status.indexOf(v.status) > -1 : true );
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
  const pageSize = maxCount*4;
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
        txHash = reverseRawHash(spenderInputs[spenderInputs.length-1].prevTxId);
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
            [TransactionDetails.TransactionType.REVOCATION]: "revoked",
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

    const lastTx = mined[mined.length-1];
    startIdx = desc ? lastTx.height -1 : lastTx.height + 1;
  }

  return { tickets, startIdx };
};

export const getTickets = () => async (dispatch, getState) => {
  const { getTicketsRequestAttempt } = getState().grpc;
  if (getTicketsRequestAttempt) return;

  dispatch({ type: GETTICKETS_ATTEMPT });

  const { ticketsFilter, maximumTransactionCount, walletService,
    currentBlockHeight } = getState().grpc;
  let { noMoreTickets, getTicketsStartRequestHeight, minedTickets } = getState().grpc;
  const pageCount = maximumTransactionCount;
  const ticketsNormalizer = sel.ticketsNormalizer(getState());

  // List of transactions found after filtering
  let filtered = [];

  // always request unmined tickets as new ones may be available or some may
  // have been mined
  let { tickets } = await getTicketsFromTransactions(walletService, -1, -1, 0, currentBlockHeight);
  const unminedFiltered = filterTickets(tickets, ticketsFilter);
  const unminedTickets = ticketsNormalizer(unminedFiltered);

  let startRequestHeight, endRequestHeight, desc;
  if ( ticketsFilter.listDirection === "desc" ) {
    startRequestHeight = getTicketsStartRequestHeight ? getTicketsStartRequestHeight : currentBlockHeight;
    endRequestHeight = 1;
    desc = true;
  } else {
    startRequestHeight = getTicketsStartRequestHeight ? getTicketsStartRequestHeight : 1;
    endRequestHeight = currentBlockHeight;
    desc = false;
  }

  let lastReportedHeight = startRequestHeight;

  // now, request a batch of mined transactions until `maximumTransactionCount`
  // transactions have been obtained (after filtering)
  while (!noMoreTickets && (filtered.length < maximumTransactionCount)) {
    try {
      let { tickets, startIdx } = await getTicketsFromTransactions(walletService,
        startRequestHeight, endRequestHeight, pageCount, currentBlockHeight);

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
    const ticketsMap = minedTickets.reduce((m, t) => { m[t.hash] = t; return m; }, {});
    newMinedTickets.push(...filtered.filter(t => !ticketsMap[t.hash]));
  } else {
    // When iterating in asc mode, we unshift the newly found (most recent)
    // tickets first, then ignore the previous (older) one, as the most recent
    // one will have the correct status.
    // This provokes a small UI issue in that the older ticket disappears from
    // the list, causing a "jump" and if the user backtracks it won't be
    // there anymore.
    newMinedTickets.push(...filtered);
    const ticketsMap = filtered.reduce((m, t) => { m[t.hash] = t; return m; }, {});
    newMinedTickets.unshift(...minedTickets.filter(t => !ticketsMap[t.hash]));
  }

  dispatch({ unminedTickets, minedTickets: newMinedTickets, noMoreTickets,
    getTicketsStartRequestHeight: startRequestHeight,
    type: GETTICKETS_COMPLETE });
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

export const cancelGetTickets = () => dispatch => dispatch({ type: GETTICKETS_CANCEL });

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

  // return the default transaction filter to zero it.
  const defaultFilter = {
    search: null,
    listDirection: "desc",
    types: [],
    direction: null,
    maxAmount: null,
    minAmount: null,
  };
  await dispatch(changeTransactionsFilter(defaultFilter));

  const { currentBlockHeight, walletService, recentTransactionCount } = getState().grpc;
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

  const mergeRegularTxs = txs =>
    (recentRegularTxs.length < recentTransactionCount) &&
    (recentRegularTxs.push( ...txs.filter(
      tx => tx.type === TransactionDetails.TransactionType.REGULAR )));

  const mergeStakeTxs = txs =>
    (recentStakeTxs.length < recentTransactionCount) &&
    (recentStakeTxs.push( ...txs.filter(
      tx => {
        if (voteTypes.indexOf(tx.type) > -1) {
          // always include vote or revocation and mark ticket as voted so we
          // don't include it in the recent list
          const decodedSpender = wallet.decodeRawTransaction(Buffer.from(tx.tx.getTransaction()));
          const spenderInputs = decodedSpender.inputs;
          const ticketHash = reverseRawHash(spenderInputs[spenderInputs.length-1].prevTxId);
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

  while (!foundNeededTransactions) {
    const { mined } = await wallet.getTransactions(walletService,
      startRequestHeight, 1, pageSize);

    if (mined.length === 0) break; // no more transactions

    mergeRegularTxs(mined);
    mergeStakeTxs(mined);
    mergeImmatureHeights(mined);

    foundNeededTransactions =
      (recentRegularTxs.length >= recentTransactionCount) &&
      (recentStakeTxs.length >= recentTransactionCount) &&
      (startRequestHeight < immatureHeight);

    const lastTransaction = mined[mined.length-1];
    startRequestHeight = lastTransaction.height-1;
    if (startRequestHeight <= 1) break; // reached genesis
  }

  recentRegularTxs = recentRegularTxs.slice(0, recentTransactionCount);
  recentStakeTxs = recentStakeTxs.slice(0, recentTransactionCount);

  dispatch({ recentRegularTxs, recentStakeTxs, maturingBlockHeights,
    type: GETSTARTUPTRANSACTIONS_SUCCESS });

};

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
