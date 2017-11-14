// @flow
import * as wallet from "wallet";
import * as sel from "selectors";
import eq from "lodash/fp/eq";
import { getNextAddressAttempt, loadActiveDataFiltersAttempt, rescanAttempt, stopAutoBuyerAttempt } from "./ControlActions";
import { transactionNtfnsStart } from "./NotificationActions";
import { updateStakepoolPurchaseInformation, setStakePoolVoteChoices } from "./StakePoolActions";
import { getDecodeMessageServiceAttempt } from "./DecodeMessageActions";
import { push as pushHistory } from "react-router-redux";
import { GetTransactionsRequest } from "../middleware/walletrpc/api_pb";
import { TransactionDetails }  from "../middleware/walletrpc/api_pb";
import { getCfg } from "../config.js";
import { onAppReloadRequested } from "wallet";

export const GETWALLETSERVICE_ATTEMPT = "GETWALLETSERVICE_ATTEMPT";
export const GETWALLETSERVICE_FAILED = "GETWALLETSERVICE_FAILED";
export const GETWALLETSERVICE_SUCCESS = "GETWALLETSERVICE_SUCCESS";

function getWalletServiceSuccess(walletService) {
  return (dispatch, getState) => {
    dispatch({ walletService, type: GETWALLETSERVICE_SUCCESS });
    setTimeout(() => { dispatch(getAccountsAttempt()); }, 10);
    setTimeout(() => { dispatch(getTransactionInfoAttempt()); }, 20);
    setTimeout(() => { dispatch(getTicketsInfoAttempt()); }, 20);
    setTimeout(() => { dispatch(loadActiveDataFiltersAttempt()); }, 1000);
    setTimeout(() => { dispatch(getNextAddressAttempt(0)); }, 1000);
    setTimeout(() => { dispatch(getStakeInfoAttempt()); }, 1000);
    setTimeout(() => { dispatch(getTicketPriceAttempt()); }, 1000);
    setTimeout(() => { dispatch(getPingAttempt()); }, 1000);
    setTimeout(() => { dispatch(getNetworkAttempt()); }, 1000);
    setTimeout(() => { dispatch(transactionNtfnsStart()); }, 1000);
    setTimeout(() => { dispatch(updateStakepoolPurchaseInformation()); }, 1000);
    setTimeout(() => { dispatch(getDecodeMessageServiceAttempt()); }, 1000);
    // Check here to see if wallet was just created from an existing
    // seed.  If it was created from a newly generated seed there is no
    // expectation of address use so rescan can be skipped.
    const { walletCreateExisting, walletCreateResponse } = getState().walletLoader;
    const { fetchHeadersResponse } = getState().walletLoader;
    if (walletCreateExisting) {
      setTimeout(() => { dispatch(rescanAttempt(0)); }, 1000);
    } else if (walletCreateResponse == null && fetchHeadersResponse != null && fetchHeadersResponse.getFirstNewBlockHeight() !== 0) {

      setTimeout(() => { dispatch(rescanAttempt(fetchHeadersResponse.getFirstNewBlockHeight())); }, 1000);
    }
    setTimeout(() => { dispatch(pushHistory("/home")); }, 1000);
  };
}

export const getWalletServiceAttempt = () => (dispatch, getState) => {
  const { grpc: { address, port } } = getState();
  dispatch({ type: GETWALLETSERVICE_ATTEMPT });
  wallet.getWalletService(address, port)
    .then(walletService => dispatch(getWalletServiceSuccess(walletService)))
    .catch(error => dispatch({ error, type: GETWALLETSERVICE_FAILED }));
};

export const GETTICKETBUYERSERVICE_ATTEMPT = "GETTICKETBUYERSERVICE_ATTEMPT";
export const GETTICKETBUYERSERVICE_FAILED = "GETTICKETBUYERSERVICE_FAILED";
export const GETTICKETBUYERSERVICE_SUCCESS = "GETTICKETBUYERSERVICE_SUCCESS";

export const getTicketBuyerServiceAttempt = () => (dispatch, getState) => {
  const { grpc: { address, port } } = getState();
  dispatch({ type: GETTICKETBUYERSERVICE_ATTEMPT });
  wallet.getTicketBuyerService(address, port)
    .then(ticketBuyerService => {
      dispatch({ ticketBuyerService, type: GETTICKETBUYERSERVICE_SUCCESS });
      setTimeout(() => { dispatch(stopAutoBuyerAttempt()); }, 10);
    })
    .catch(error => dispatch({ error, type: GETTICKETBUYERSERVICE_FAILED }));
};

export const GETBALANCE_ATTEMPT = "GETBALANCE_ATTEMPT";
export const GETBALANCE_FAILED = "GETBALANCE_FAILED";
export const GETBALANCE_SUCCESS = "GETBALANCE_SUCCESS";

const getBalanceSuccess = (account, getBalanceResponse) => (dispatch, getState) => {
  const { grpc: { balances, network, hiddenAccounts } } = getState();
  const accountNumber = account.getAccountNumber();
  let found = false;
  let hidden = false;
  let HDPath = "";

  if (hiddenAccounts.find(eq(accountNumber))) hidden = true;

  if (network == "mainnet") {
    HDPath = "m / 44' / 20' / " + account.getAccountNumber() + "'";
  } else if (network == "testnet") {
    HDPath = "m / 44' / 11' / " + account.getAccountNumber() + "'";
  }

  const updatedBalance = {
    hidden, accountNumber, HDPath,
    accountName: account.getAccountName(),
    total: getBalanceResponse.getTotal(),
    spendable: getBalanceResponse.getSpendable(),
    immatureReward: getBalanceResponse.getImmatureReward(),
    immatureStakeGeneration: getBalanceResponse.getImmatureStakeGeneration(),
    lockedByTickets: getBalanceResponse.getLockedByTickets(),
    votingAuthority: getBalanceResponse.getVotingAuthority(),
    externalKeys: account.getExternalKeyCount(),
    internalKeys: account.getInternalKeyCount(),
    importedKeys: account.getImportedKeyCount()
  };

  const updatedBalances = balances.map(balance =>
    (balance.accountNumber === accountNumber) ? found = true && updatedBalance : balance);

  if (updatedBalances.length == 0 || !found) updatedBalances.push(updatedBalance);
  dispatch({balances: updatedBalances, type: GETBALANCE_SUCCESS });
};

export const getBalanceAttempt = (account, requiredConfs) => (dispatch, getState) =>
  wallet.getBalance(sel.walletService(getState()), account.getAccountNumber(), requiredConfs)
    .then(resp => dispatch(getBalanceSuccess(account, resp)))
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
    const { testnet, mainnet, network } = getState().grpc;
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
    .then(resp => dispatch({ getStakeInfoResponse: resp, type: GETSTAKEINFO_SUCCESS }))
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

export const getAccountsAttempt = () => (dispatch, getState) => {
  dispatch({ type: GETACCOUNTS_ATTEMPT });
  wallet.getAccounts(sel.walletService(getState()))
    .then(response => {
      response.getAccountsList().forEach(account => dispatch(getBalanceAttempt(account, 0)));
      dispatch({ response, type: GETACCOUNTS_SUCCESS });
    })
    .catch(error => dispatch({ error, type: GETACCOUNTS_FAILED }));
};

export const UPDATEHIDDENACCOUNTS = "UPDATEHIDDENACCOUNTS";

export function hideAccount(accountNumber) {
  return (dispatch, getState) => {
    const {hiddenAccounts} = getState().grpc;
    var updatedHiddenAccounts;
    if (hiddenAccounts.length == 0) {
      updatedHiddenAccounts = Array();
    } else {
      updatedHiddenAccounts = hiddenAccounts;
    }
    updatedHiddenAccounts.push(accountNumber);
    var cfg = getCfg();
    cfg.set("hiddenaccounts", updatedHiddenAccounts);
    dispatch({hiddenAccounts: updatedHiddenAccounts, type: UPDATEHIDDENACCOUNTS});
    dispatch(getAccountsAttempt());
  };
}

export function showAccount(accountNumber) {
  return (dispatch, getState) => {
    const {hiddenAccounts} = getState().grpc;
    var updatedHiddenAccounts = Array();
    for (var i = 0; i < hiddenAccounts.length; i++) {
      if (hiddenAccounts[i] !== accountNumber) {
        updatedHiddenAccounts.push(hiddenAccounts[i]);
      }
    }
    var cfg = getCfg();
    cfg.set("hiddenaccounts", updatedHiddenAccounts);
    dispatch({hiddenAccounts: updatedHiddenAccounts, type: UPDATEHIDDENACCOUNTS});
    dispatch(getAccountsAttempt());
  };
}

export const GETTICKETS_ATTEMPT = "GETTICKETS_ATTEMPT";
export const GETTICKETS_FAILED = "GETTICKETS_FAILED";
export const GETTICKETS_COMPLETE = "GETTICKETS_COMPLETE";

export const getTicketsInfoAttempt = () => (dispatch, getState) => {
  const { grpc: { getAccountsResponse, getTicketsRequestAttempt } } = getState();
  let startRequestHeight, endRequestHeight = 0;
  if (getTicketsRequestAttempt) return;
  // Check to make sure getAccountsResponse (which has current block height) is available
  if (getAccountsResponse !== null) {
    endRequestHeight = getAccountsResponse.getCurrentBlockHeight();
    startRequestHeight = 0;
  } else {
    // Wait a little then re-dispatch this call since we have no starting height yet
    setTimeout(() => { dispatch(getTicketsInfoAttempt()); }, 1000);
    return;
  }

  dispatch({ type: GETTICKETS_ATTEMPT });
  wallet.getTickets(sel.walletService(getState()), startRequestHeight, endRequestHeight)
    .then(tickets => setTimeout(() => dispatch({ tickets, type: GETTICKETS_COMPLETE }), 1000))
    .catch(error => console.error(error + " Please try again"));
};

export const GETTRANSACTIONS_ATTEMPT = "GETTRANSACTIONS_ATTEMPT";
export const GETTRANSACTIONS_FAILED = "GETTRANSACTIONS_FAILED";
export const GETTRANSACTIONS_PROGRESS_REGULAR = "GETTRANSACTIONS_PROGRESS_REGULAR";
export const GETTRANSACTIONS_PROGRESS_COINBASE = "GETTRANSACTIONS_PROGRESS_COINBASE";
export const GETTRANSACTIONS_PROGRESS_TICKET = "GETTRANSACTIONS_PROGRESS_TICKET";
export const GETTRANSACTIONS_PROGRESS_VOTE = "GETTRANSACTIONS_PROGRESS_VOTE";
export const GETTRANSACTIONS_PROGRESS_REVOKE = "GETTRANSACTIONS_PROGRESS_REVOKE";
export const GETTRANSACTIONS_UNMINED_PROGRESS = "GETTRANSACTIONS_UNMINED_PROGRESS";
export const GETTRANSACTIONS_COMPLETE = "GETTRANSACTIONS_COMPLETE";

export function getTransactionInfoAttempt() {
  return (dispatch, getState) => {
    const { getAccountsResponse, getTransactionsRequestAttempt } = getState().grpc;
    if (getTransactionsRequestAttempt) return;
    var startRequestHeight, endRequestHeight = 0;
    // Check to make sure getAccountsResponse (which has current block height) is available
    if (getAccountsResponse !== null) {
      endRequestHeight = getAccountsResponse.getCurrentBlockHeight();
      startRequestHeight = 0;
    } else {
      // Wait a little then re-dispatch this call since we have no starting height yet
      setTimeout(() => { dispatch(getTransactionInfoAttempt()); }, 1000);
      return;
    }
    var request = new GetTransactionsRequest();
    request.setStartingBlockHeight(startRequestHeight);
    request.setEndingBlockHeight(endRequestHeight);
    dispatch({ type: GETTRANSACTIONS_ATTEMPT });
    const { walletService } = getState().grpc;
    var getTx = walletService.getTransactions(request);
    var updatedRegular = Array();
    var updatedCoinbase = Array();
    var updatedTicket = Array();
    var updatedVote = Array();
    var updatedRevoke = Array();
    getTx.on("data", function (response) {
      for (var i = 0; i < response.getMinedTransactions().getTransactionsList().length; i++) {
        var newHeight = response.getMinedTransactions().getHeight();
        var tx = {
          timestamp: response.getMinedTransactions().getTimestamp(),
          tx: response.getMinedTransactions().getTransactionsList()[i],
          height: newHeight,
          index: i,
          hash: response.getMinedTransactions().getTransactionsList()[i].getHash(),
          blockHash: response.getMinedTransactions().getHash(),
          type: response.getMinedTransactions().getTransactionsList()[i].getTransactionType(),
        };
        if (tx.type == TransactionDetails.TransactionType.REGULAR) {
          updatedRegular.unshift(tx);
        } else if (tx.type == TransactionDetails.TransactionType.COINBASE) {
          updatedCoinbase.unshift(tx);
        } else if (tx.type == TransactionDetails.TransactionType.TICKET_PURCHASE) {
          updatedTicket.unshift(tx);
        } else if (tx.type == TransactionDetails.TransactionType.VOTE) {
          updatedVote.unshift(tx);
        } else if (tx.type == TransactionDetails.TransactionType.REVOCATION) {
          updatedRevoke.unshift(tx);
        }
      }
      if (response.getUnminedTransactionsList().length > 0) {
        console.log("unmined!", response.getUnminedTransactionsList());
        dispatch({unmined: response.getUnminedTransactionsList(), type: GETTRANSACTIONS_UNMINED_PROGRESS});
      }
      response = null;

    });
    getTx.on("end", function () {
      dispatch({ regularTransactionsInfo: updatedRegular, coinbaseTransactionsInfo: updatedCoinbase,  ticketTransactionsInfo: updatedTicket, voteTransactionsInfo: updatedVote, revokeTransactionsInfo: updatedRevoke, type: GETTRANSACTIONS_COMPLETE });
    });
    /*
    getTx.on('status', function (status) {
      //console.log('GetTx status:', status);
    });
    */
    getTx.on("error", function (error) {
      console.error(error + " Please try again");
    });
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
  dispatch({ type: GETAGENDASERVICE_ATTEMPT });
  wallet.getAgendaService(address, port)
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
  dispatch({ type: GETVOTINGSERVICE_ATTEMPT });
  wallet.getVotingService(address, port)
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
  dispatch({ type: GETMESSAGEVERIFICATIONSERVICE_ATTEMPT });
  wallet.getMessageVerificationService(address, port)
    .then(messageVerificationService =>
      dispatch({ messageVerificationService, type: GETMESSAGEVERIFICATIONSERVICE_SUCCESS }))
    .catch(error => dispatch({ error, type: GETMESSAGEVERIFICATIONSERVICE_FAILED }));
};

export const listenForAppReloadRequest = cb => () => onAppReloadRequested(cb);

export const showTicketList = status => dispatch =>
  dispatch(pushHistory("/tickets/mytickets/" + status));
