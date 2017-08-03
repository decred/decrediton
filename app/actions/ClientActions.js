// @flow
import { getWalletService, getTicketBuyerService, getVotingService, getAgendaService } from "../middleware/grpc/client";
import { getNextAddressAttempt, loadActiveDataFiltersAttempt, rescanAttempt, getTicketBuyerConfigAttempt } from "./ControlActions";
import { transactionNtfnsStart } from "./NotificationActions";
import { updateStakepoolPurchaseInformation, setStakePoolVoteChoices } from "./StakePoolActions";
import { hashHistory } from "react-router";
import { timeSince } from "../helpers/dateFormat.js";
import {
  PingRequest, NetworkRequest, AccountNumberRequest, AccountsRequest,
  BalanceRequest, GetTransactionsRequest, TicketPriceRequest, StakeInfoRequest,
  AgendasRequest, VoteChoicesRequest, SetVoteChoicesRequest,
} from "../middleware/walletrpc/api_pb";
import { TransactionDetails }  from "../middleware/walletrpc/api_pb";
import { getCfg } from "../config.js";

export const GETWALLETSERVICE_ATTEMPT = "GETWALLETSERVICE_ATTEMPT";
export const GETWALLETSERVICE_FAILED = "GETWALLETSERVICE_FAILED";
export const GETWALLETSERVICE_SUCCESS = "GETWALLETSERVICE_SUCCESS";

function getWalletServiceSuccess(walletService) {
  return (dispatch, getState) => {
    dispatch({ walletService, type: GETWALLETSERVICE_SUCCESS });
    setTimeout(() => { dispatch(getAccountsAttempt()); }, 10);
    setTimeout(() => { dispatch(getTransactionInfoAttempt()); }, 20);
    setTimeout(() => { dispatch(loadActiveDataFiltersAttempt()); }, 1000);
    setTimeout(() => { dispatch(getNextAddressAttempt(0)); }, 1000);
    setTimeout(() => { dispatch(getStakeInfoAttempt()); }, 1000);
    setTimeout(() => { dispatch(getTicketPriceAttempt()); }, 1000);
    setTimeout(() => { dispatch(getPingAttempt()); }, 1000);
    setTimeout(() => { dispatch(getNetworkAttempt()); }, 1000);
    setTimeout(() => { dispatch(transactionNtfnsStart()); }, 1000);
    setTimeout(() => { dispatch(updateStakepoolPurchaseInformation()); }, 1000);
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
    setTimeout(() => { hashHistory.push("/home"); }, 1000);
  };
}

export function getWalletServiceAttempt() {
  return (dispatch, getState) => {
    dispatch({ type: GETWALLETSERVICE_ATTEMPT });
    const { address, port } = getState().grpc;
    getWalletService(address, port, function (walletService, error) {
      if (error) {
        dispatch({error, type: GETWALLETSERVICE_FAILED });
      } else {
        dispatch(getWalletServiceSuccess(walletService));
      }
    });
  };
}

export const GETTICKETBUYERSERVICE_ATTEMPT = "GETTICKETBUYERSERVICE_ATTEMPT";
export const GETTICKETBUYERSERVICE_FAILED = "GETTICKETBUYERSERVICE_FAILED";
export const GETTICKETBUYERSERVICE_SUCCESS = "GETTICKETBUYERSERVICE_SUCCESS";

export function getTicketBuyerServiceAttempt() {
  return (dispatch, getState) => {
    dispatch({ type: GETTICKETBUYERSERVICE_ATTEMPT });
    const { address, port } = getState().grpc;
    getTicketBuyerService(address, port, function (ticketBuyerService, error) {
      if (error) {
        dispatch({ error, type: GETTICKETBUYERSERVICE_FAILED });
      } else {
        dispatch({ ticketBuyerService, type: GETTICKETBUYERSERVICE_SUCCESS });
        setTimeout(() => { dispatch(getTicketBuyerConfigAttempt()); }, 10);
      }
    });
  };
}

export const GETBALANCE_ATTEMPT = "GETBALANCE_ATTEMPT";
export const GETBALANCE_FAILED = "GETBALANCE_FAILED";
export const GETBALANCE_SUCCESS = "GETBALANCE_SUCCESS";

function getBalanceSuccess(account, getBalanceResponse) {
  return (dispatch, getState) => {
    const { balances, network } = getState().grpc;
    const { hiddenAccounts } = getState().grpc;
    var HDPath = "";
    if (network == "mainnet") {
      HDPath = "m / 44' / 20' / " + account.getAccountNumber() + "'";
    } else if (network == "testnet") {
      HDPath = "m / 44' / 11' / " + account.getAccountNumber() + "'";
    }
    var hidden = false;
    for ( var i = 0; i < hiddenAccounts.length; i++ ) {
      if (hiddenAccounts[i] == account.getAccountNumber()) {
        hidden = true;
        break;
      }
    }
    var updatedBalance = {
      hidden: hidden,
      accountNumber: account.getAccountNumber(),
      accountName: account.getAccountName(),
      total: getBalanceResponse.getTotal(),
      spendable: getBalanceResponse.getSpendable(),
      immatureReward: getBalanceResponse.getImmatureReward(),
      immatureStakeGeneration: getBalanceResponse.getImmatureStakeGeneration(),
      lockedByTickets: getBalanceResponse.getLockedByTickets(),
      votingAuthority: getBalanceResponse.getVotingAuthority(),
      HDPath: HDPath,
      externalKeys: account.getExternalKeyCount(),
      internalKeys: account.getInternalKeyCount(),
      importedKeys: account.getImportedKeyCount(),
    };
    var updatedBalances = balances;
    var found = false;
    for (i = 0; i < balances.length; i++) {
      if (balances[i].accountNumber == account.getAccountNumber()) {
        updatedBalances[i] = updatedBalance;
        found = true;
      }
    }
    if (updatedBalances.length == 0 || !found) {
      updatedBalances.push(updatedBalance);
    }
    dispatch({balances: updatedBalances, type: GETBALANCE_SUCCESS });
  };
}

export function getBalanceAttempt(account, requiredConfs) {
  return (dispatch, getState) => {
    var request = new BalanceRequest();
    request.setAccountNumber(account.getAccountNumber());
    request.setRequiredConfirmations(requiredConfs);
    const { walletService } = getState().grpc;
    walletService.balance(request,
      function (error, getBalanceResponse) {
        if (error) {
          dispatch({ error, type: GETBALANCE_FAILED });
        } else {
          dispatch(getBalanceSuccess(account, getBalanceResponse));
        }
      });
  };
}

export const GETACCOUNTNUMBER_ATTEMPT = "GETACCOUNTNUMBER_ATTEMPT";
export const GETACCOUNTNUMBER_FAILED = "GETACCOUNTNUMBER_FAILED";
export const GETACCOUNTNUMBER_SUCCESS = "GETACCOUNTNUMBER_SUCCESS";

export function getAccountNumberAttempt(accountName) {
  var request = new AccountNumberRequest();
  request.setAccountName(accountName);
  return (dispatch, getState) => {
    dispatch({ type: GETACCOUNTNUMBER_ATTEMPT });
    const { walletService } = getState().grpc;
    walletService.accountNumber(request,
      function (error, getAccountNumberResponse) {
        if (error) {
          dispatch({ error, type: GETACCOUNTNUMBER_FAILED });
        } else {
          dispatch({ getAccountNumberResponse: getAccountNumberResponse, type: GETACCOUNTNUMBER_SUCCESS });
        }
      });
  };
}

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
      setTimeout(() => { hashHistory.push("/walletError"); }, 1000);
    }
  };
}

export function getNetworkAttempt() {
  var request = new NetworkRequest();
  return (dispatch, getState) => {
    dispatch({ type: GETNETWORK_ATTEMPT });
    const { walletService } = getState().grpc;
    walletService.network(request,
      function (error, getNetworkResponse) {
        if (error) {
          dispatch({ error, type: GETNETWORK_FAILED });
          setTimeout(() => { hashHistory.push("/walletError"); }, 1000);
        } else {
          dispatch(getNetworkSuccess(getNetworkResponse));
        }
      });
  };
}

export const GETPING_ATTEMPT = "GETPING_ATTEMPT";
export const GETPING_FAILED = "GETPING_FAILED";
export const GETPING_SUCCESS = "GETPING_SUCCESS";

export function getPingAttempt() {
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    walletService.ping(new PingRequest(),
      function (error) {
        if (error) {
          dispatch({ error, type: GETPING_FAILED });
          setTimeout(() => { hashHistory.push("/walletError"); }, 1000);
        } else {
          setTimeout(() => { dispatch(getPingAttempt()); }, 10000);
        }
      });
  };
}

export const GETSTAKEINFO_ATTEMPT = "GETSTAKEINFO_ATTEMPT";
export const GETSTAKEINFO_FAILED = "GETSTAKEINFO_FAILED";
export const GETSTAKEINFO_SUCCESS = "GETSTAKEINFO_SUCCESS";

export function getStakeInfoAttempt() {
  var request = new StakeInfoRequest();
  return (dispatch, getState) => {
    dispatch({ type: GETSTAKEINFO_ATTEMPT });
    const { walletService } = getState().grpc;
    walletService.stakeInfo(request,
      function (error, getStakeInfoResponse) {
        if (error) {
          dispatch({ error, type: GETSTAKEINFO_FAILED });
        } else {
          dispatch({ getStakeInfoResponse: getStakeInfoResponse, type: GETSTAKEINFO_SUCCESS });
        }
      });
  };
}

export const GETTICKETPRICE_ATTEMPT = "GETTICKETPRICE_ATTEMPT";
export const GETTICKETPRICE_FAILED = "GETTICKETPRICE_FAILED";
export const GETTICKETPRICE_SUCCESS = "GETTICKETPRICE_SUCCESS";

export function getTicketPriceAttempt() {
  var request = new TicketPriceRequest();
  return (dispatch, getState) => {
    dispatch({ type: GETTICKETPRICE_ATTEMPT });
    const { walletService } = getState().grpc;
    walletService.ticketPrice(request,
      function (error, getTicketPriceResponse) {
        if (error) {
          dispatch({ error, type: GETTICKETPRICE_FAILED });
        } else {
          dispatch({ getTicketPriceResponse: getTicketPriceResponse, type: GETTICKETPRICE_SUCCESS });
        }
      });
  };
}

export const GETACCOUNTS_ATTEMPT = "GETACCOUNTS_ATTEMPT";
export const GETACCOUNTS_FAILED = "GETACCOUNTS_FAILED";
export const GETACCOUNTS_SUCCESS = "GETACCOUNTS_SUCCESS";

export function getAccountsAttempt() {
  var request = new AccountsRequest();
  return (dispatch, getState) => {
    dispatch({ type: GETACCOUNTS_ATTEMPT });
    const { walletService } = getState().grpc;
    walletService.accounts(request,
      function (error, getAccountsResponse) {
        if (error) {
          dispatch({ error, type: GETACCOUNTS_FAILED });
        } else {
          for (var i = 0; i < getAccountsResponse.getAccountsList().length; i++) {
            dispatch(getBalanceAttempt(getAccountsResponse.getAccountsList()[i], 0));
          }
          dispatch({response: getAccountsResponse, type: GETACCOUNTS_SUCCESS });
        }
      });
  };
}

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
    const { getAccountsResponse } = getState().grpc;
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
    getTx.on("data", function (response) {
      dispatch(getTransactionsInfoProgress(response));
    });
    getTx.on("end", function () {
      setTimeout(() => { dispatch({ type: GETTRANSACTIONS_COMPLETE });}, 1000);
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

function getTransactionsInfoProgress(response) {
  return (dispatch, getState) => {
    const { regularTransactionsInfo } = getState().grpc;
    const { coinbaseTransactionsInfo } = getState().grpc;
    const { ticketTransactionsInfo } = getState().grpc;
    const { voteTransactionsInfo } = getState().grpc;
    const { revokeTransactionsInfo } = getState().grpc;
    var updatedRegular = regularTransactionsInfo;
    var updatedCoinbase = coinbaseTransactionsInfo;
    var updatedTicket = ticketTransactionsInfo;
    var updatedVote = voteTransactionsInfo;
    var updatedRevoke = revokeTransactionsInfo;
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
    if (updatedRegular.length !== regularTransactionsInfo.length) {
      dispatch({ regularTransactionsInfo: updatedRegular, type: GETTRANSACTIONS_PROGRESS_REGULAR });
    }
    if (updatedCoinbase.length !== coinbaseTransactionsInfo.length) {
      dispatch({ coinbaseTransactionsInfo: updatedCoinbase, type: GETTRANSACTIONS_PROGRESS_COINBASE });
    }
    if (updatedTicket.length !== ticketTransactionsInfo.length) {
      dispatch({ ticketTransactionsInfo: updatedTicket, type: GETTRANSACTIONS_PROGRESS_TICKET });
    }
    if (updatedVote.length !== voteTransactionsInfo.length) {
      dispatch({ voteTransactionsInfo: updatedVote, type: GETTRANSACTIONS_PROGRESS_VOTE });
    }
    if (updatedRevoke.length !== revokeTransactionsInfo.length) {
      dispatch({ revokeTransactionsInfo: updatedRevoke, type: GETTRANSACTIONS_PROGRESS_REVOKE });
    }
    if (response.getUnminedTransactionsList().length > 0) {
      console.log("unmined!", response.getUnminedTransactionsList());
      dispatch({unmined: response.getUnminedTransactionsList(), type: GETTRANSACTIONS_UNMINED_PROGRESS});
    }
    response = null;
  };
}

export const UPDATETIMESINCEBLOCK = "UPDATETIMESINCEBLOCK";
export function updateBlockTimeSince() {
  return (dispatch, getState) => {
    const { transactionNtfnsResponse } = getState().notifications;
    const { timeSinceString } = getState().grpc;
    if (transactionNtfnsResponse !== null && transactionNtfnsResponse.getAttachedBlocksList().length > 0) {
      const attachedBlocks = transactionNtfnsResponse.getAttachedBlocksList();
      var recentBlockTime = new Date(attachedBlocks[0].getTimestamp()*1000);
      var updatedTimeSince = timeSince(recentBlockTime);
      if (timeSinceString != updatedTimeSince) {
        dispatch({timeSinceString: updatedTimeSince, type: UPDATETIMESINCEBLOCK });
      }
    }
  };
}

export const GETAGENDASERVICE_ATTEMPT = "GETAGENDASERVICE_ATTEMPT";
export const GETAGENDASERVICE_FAILED = "GETAGENDASERVICE_FAILED";
export const GETAGENDASERVICE_SUCCESS = "GETAGENDASERVICE_SUCCESS";

export function getAgendaServiceAttempt() {
  return (dispatch, getState) => {
    dispatch({ type: GETAGENDASERVICE_ATTEMPT });
    const { address, port } = getState().grpc;
    getAgendaService(address, port, function (agendaService, error) {
      if (error) {
        dispatch({ error, type: GETAGENDASERVICE_FAILED });
      } else {
        dispatch({ agendaService, type: GETAGENDASERVICE_SUCCESS });
        setTimeout(() => { dispatch(getAgendasAttempt()); }, 10);
      }
    });
  };
}

export const GETVOTINGSERVICE_ATTEMPT = "GETVOTINGSERVICE_ATTEMPT";
export const GETVOTINGSERVICE_FAILED = "GETVOTINGSERVICE_FAILED";
export const GETVOTINGSERVICE_SUCCESS = "GETVOTINGSERVICE_SUCCESS";

export function getVotingServiceAttempt() {
  return (dispatch, getState) => {
    dispatch({ type: GETVOTINGSERVICE_ATTEMPT });
    const { address, port } = getState().grpc;
    getVotingService(address, port, function (votingService, error) {
      if (error) {
        dispatch({ error, type: GETVOTINGSERVICE_FAILED });
      } else {
        dispatch({ votingService, type: GETVOTINGSERVICE_SUCCESS });
      }
    });
  };
}

export const GETAGENDAS_ATTEMPT = "GETAGENDAS_ATTEMPT";
export const GETAGENDAS_FAILED = "GETAGENDAS_FAILED";
export const GETAGENDAS_SUCCESS = "GETAGENDAS_SUCCESS";

export function getAgendasAttempt() {
  return (dispatch, getState) => {
    dispatch({ type: GETAGENDAS_ATTEMPT });
    var request = new AgendasRequest();
    const { agendaService } = getState().grpc;
    agendaService.agendas(request, function (error, agendas) {
      if (error) {
        dispatch({ error, type: GETAGENDAS_FAILED });
      } else {
        dispatch({ agendas, type: GETAGENDAS_SUCCESS });
      }
    });
  };
}

export const GETVOTECHOICES_ATTEMPT = "GETVOTECHOICES_ATTEMPT";
export const GETVOTECHOICES_FAILED = "GETVOTECHOICES_FAILED";
export const GETVOTECHOICES_SUCCESS = "GETVOTECHOICES_SUCCESS";

export function getVoteChoicesAttempt(stakePool) {
  return (dispatch, getState) => {
    dispatch({ type: GETVOTECHOICES_ATTEMPT });
    var request = new VoteChoicesRequest();
    const { votingService } = getState().grpc;
    votingService.voteChoices(request, function (error, voteChoices) {
      if (error) {
        dispatch({ error, type: GETVOTECHOICES_FAILED });
      } else {
        dispatch({ voteChoices, type: GETVOTECHOICES_SUCCESS });
        dispatch(setStakePoolVoteChoices(stakePool, voteChoices));
      }
    });
  };
}

export const SETVOTECHOICES_ATTEMPT = "SETVOTECHOICES_ATTEMPT";
export const SETVOTECHOICES_FAILED = "SETVOTECHOICES_FAILED";
export const SETVOTECHOICES_SUCCESS = "SETVOTECHOICES_SUCCESS";

export function setVoteChoicesAttempt(stakePool, agendaId, choiceId) {
  return (dispatch, getState) => {
    var request = new SetVoteChoicesRequest();
    var choice = new SetVoteChoicesRequest.Choice();
    choice.setChoiceId(choiceId);
    choice.setAgendaId(agendaId);
    request.addChoices(choice);
    dispatch({ setVoteChoicesRequest: request, type: SETVOTECHOICES_ATTEMPT });
    const { votingService } = getState().grpc;
    votingService.setVoteChoices(request, function (error, response) {
      if (error) {
        dispatch({ error, type: SETVOTECHOICES_FAILED });
      } else {
        dispatch({ response, type: SETVOTECHOICES_SUCCESS });
        dispatch(getVoteChoicesAttempt(stakePool));
      }
    });
  };
}

