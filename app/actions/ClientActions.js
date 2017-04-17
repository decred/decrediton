import { getWalletService, getTicketBuyerService, getVotingService, getAgendaService } from '../middleware/grpc/client';
import { getNextAddressAttempt, loadActiveDataFiltersAttempt, rescanAttempt } from './ControlActions';
import { transactionNtfnsStart } from './NotificationActions';
import { updateStakepoolPurchaseInformation } from './StakePoolActions';
import { hashHistory } from 'react-router';
import { timeSince } from '../helpers/dateFormat.js';
import {
  PingRequest, NetworkRequest, AccountNumberRequest, AccountsRequest,
  BalanceRequest, GetTransactionsRequest, TicketPriceRequest, StakeInfoRequest,
  AgendasRequest, VoteChoicesRequest, SetVoteChoicesRequest,
} from '../middleware/walletrpc/api_pb';
import {
  TransactionDetails
}  from '../middleware/walletrpc/api_pb';

export const GETWALLETSERVICE_ATTEMPT = 'GETWALLETSERVICE_ATTEMPT';
export const GETWALLETSERVICE_FAILED = 'GETWALLETSERVICE_FAILED';
export const GETWALLETSERVICE_SUCCESS = 'GETWALLETSERVICE_SUCCESS';

function getWalletServiceError(error) {
  return { error, type: GETWALLETSERVICE_FAILED };
}

function getWalletServiceSuccess(walletService) {
  return (dispatch, getState) => {
    dispatch({ walletService, type: GETWALLETSERVICE_SUCCESS });
    setTimeout(() => { dispatch(getAccountsAttempt()); }, 10);
    setTimeout(() => { dispatch(getTransactionInfoAttempt()); }, 20);
    setTimeout(() => { dispatch(loadActiveDataFiltersAttempt()); }, 1000);
    setTimeout(() => { dispatch(getNextAddressAttempt()); }, 1000);
    setTimeout(() => { dispatch(getBalanceAttempt()); }, 1000);
    setTimeout(() => { dispatch(getStakeInfoAttempt()); }, 1000);
    setTimeout(() => { dispatch(getTicketPriceAttempt()); }, 1000);
    setTimeout(() => { dispatch(getPingAttempt()); }, 1000);
    setTimeout(() => { dispatch(getNetworkAttempt()); }, 1000);
    setTimeout(() => { dispatch(transactionNtfnsStart()); }, 1000);
    setTimeout(() => { dispatch(updateStakepoolPurchaseInformation()); }, 1000);
    // Check here to see if wallet was just created from an existing
    // seed.  If it was created from a newly generated seed there is no
    // expectation of address use so rescan can be skipped.
    const { walletCreateExisting } = getState().walletLoader;
    if (walletCreateExisting) {
      setTimeout(() => { dispatch(rescanAttempt(0)); }, 1000);
    }
    setTimeout(() => { hashHistory.push('/home'); }, 1000);
  };
}

export function getWalletServiceAttempt() {
  return (dispatch) => {
    dispatch({ type: GETWALLETSERVICE_ATTEMPT });
    dispatch(getWalletServiceAction());
  };
}

function getWalletServiceAction() {
  return (dispatch, getState) => {
    const { address, port } = getState().grpc;
    getWalletService(address, port, function (walletService, err) {
      if (err) {
        dispatch(getWalletServiceError(err + ' Please try again'));
      } else {
        dispatch(getWalletServiceSuccess(walletService));
      }
    });
  };
}

export const GETTICKETBUYERSERVICE_ATTEMPT = 'GETTICKETBUYERSERVICE_ATTEMPT';
export const GETTICKETBUYERSERVICE_FAILED = 'GETTICKETBUYERSERVICE_FAILED';
export const GETTICKETBUYERSERVICE_SUCCESS = 'GETTICKETBUYERSERVICE_SUCCESS';

function getTicketBuyerServiceError(error) {
  return { error, type: GETTICKETBUYERSERVICE_FAILED };
}

function getTicketBuyerServiceSuccess(ticketBuyerService) {
  return (dispatch) => {
    dispatch({ ticketBuyerService, type: GETTICKETBUYERSERVICE_SUCCESS });
  };
}

export function getTicketBuyerServiceAttempt() {
  return (dispatch) => {
    dispatch({ type: GETTICKETBUYERSERVICE_ATTEMPT });
    dispatch(getTicketBuyerServiceAction());
  };
}

function getTicketBuyerServiceAction() {
  return (dispatch, getState) => {
    const { address, port } = getState().grpc;
    getTicketBuyerService(address, port, function (ticketBuyerService, err) {
      if (err) {
        dispatch(getTicketBuyerServiceError(err + ' Please try again'));
      } else {
        dispatch(getTicketBuyerServiceSuccess(ticketBuyerService));
      }
    });
  };
}

export const GETBALANCE_ATTEMPT = 'GETBALANCE_ATTEMPT';
export const GETBALANCE_FAILED = 'GETBALANCE_FAILED';
export const GETBALANCE_SUCCESS = 'GETBALANCE_SUCCESS';

function getBalanceError(error) {
  return { error, type: GETBALANCE_FAILED };
}

function getBalanceSuccess(getBalanceResponse) {
  return { getBalanceResponse: getBalanceResponse, type: GETBALANCE_SUCCESS };
}

export function getBalanceAttempt(accountNumber, requiredConfs) {
  var request = new BalanceRequest();
  request.setAccountNumber(accountNumber);
  request.setRequiredConfirmations(requiredConfs);
  return (dispatch) => {
    dispatch({
      request: request,
      type: GETBALANCE_ATTEMPT
    });
    dispatch(getBalanceAction());
  };
}

function getBalanceAction() {
  return (dispatch, getState) => {
    const { walletService, getBalanceRequest } = getState().grpc;
    walletService.balance(getBalanceRequest,
      function (err, getBalanceResponse) {
        if (err) {
          dispatch(getBalanceError(err + ' please try again'));
        } else {
          dispatch(getBalanceSuccess(getBalanceResponse));
        }
      });
  };
}

export const GETACCOUNTNUMBER_ATTEMPT = 'GETACCOUNTNUMBER_ATTEMPT';
export const GETACCOUNTNUMBER_FAILED = 'GETACCOUNTNUMBER_FAILED';
export const GETACCOUNTNUMBER_SUCCESS = 'GETACCOUNTNUMBER_SUCCESS';

function getAccountNumberError(error) {
  return { error, type: GETACCOUNTNUMBER_FAILED };
}

function getAccountNumberSuccess(getAccountNumberResponse) {
  return { getAccountNumberResponse: getAccountNumberResponse, type: GETACCOUNTNUMBER_SUCCESS };
}

export function getAccountNumberAttempt(accountName) {
  var request = new AccountNumberRequest();
  request.setAccountName(accountName);
  return (dispatch) => {
    dispatch({
      request: request,
      type: GETACCOUNTNUMBER_ATTEMPT
    });
    dispatch(accountNumber());
  };
}

function accountNumber() {
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    const { getAccountNumberRequest } = getState().grpc;
    walletService.accountNumber(getAccountNumberRequest,
      function (err, getAccountNumberResponse) {
        if (err) {
          dispatch(getAccountNumberError(err + ' Please try again'));
        } else {
          dispatch(getAccountNumberSuccess(getAccountNumberResponse));
        }
      });
  };
}

export const GETNETWORK_ATTEMPT = 'GETNETWORK_ATTEMPT';
export const GETNETWORK_FAILED = 'GETNETWORK_FAILED';
export const GETNETWORK_SUCCESS = 'GETNETWORK_SUCCESS';

function getNetworkError(error) {
  return (dispatch) => {
    dispatch({ error, type: GETNETWORK_FAILED });
    setTimeout(() => { hashHistory.push('/walletError'); }, 1000);
  };
}

function getNetworkSuccess(getNetworkResponse) {
  return (dispatch, getState) => {
    const { testnet, mainnet, network } = getState().grpc;
    var currentNetwork = getNetworkResponse.getActiveNetwork();
    // XXX remove network magic numbers here
    var networkStr = '';
    if ((currentNetwork == testnet && network == 'testnet') ||
      (currentNetwork == mainnet && network == 'mainnet')) {
      networkStr = network;
      getNetworkResponse.networkStr = networkStr;
      dispatch({ getNetworkResponse: getNetworkResponse, type: GETNETWORK_SUCCESS });
    } else {
      dispatch(getNetworkError('Invalid network detected'));
    }
  };
}

export function getNetworkAttempt() {
  var request = new NetworkRequest();
  return (dispatch) => {
    dispatch({
      request: request,
      type: GETNETWORK_ATTEMPT
    });
    dispatch(network());
  };
}

function network() {
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    const { getNetworkRequest } = getState().grpc;
    walletService.network(getNetworkRequest,
      function (err, getNetworkResponse) {
        if (err) {
          dispatch(getNetworkError(err + ' Please try again'));
        } else {
          dispatch(getNetworkSuccess(getNetworkResponse));
        }
      });
  };
}

export const GETPING_ATTEMPT = 'GETPING_ATTEMPT';
export const GETPING_FAILED = 'GETPING_FAILED';
export const GETPING_SUCCESS = 'GETPING_SUCCESS';

function getPingError(error) {
  return (dispatch) => {
    dispatch({ error, type: GETPING_FAILED });
    setTimeout(() => { hashHistory.push('/walletError'); }, 1000);
  };
}

function getPingSuccess() {
  return (dispatch) => {
    setTimeout(() => { dispatch(getPingAttempt()); }, 10000);
  };
}

export function getPingAttempt() {
  return (dispatch) => {
    dispatch(ping());
  };
}

function ping() {
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    walletService.ping(new PingRequest(),
      function (err, getPingResponse) {
        if (err) {
          dispatch(getPingError(err + ' Please try again'));
        } else {
          dispatch(getPingSuccess(getPingResponse));
        }
      });
  };
}

export const GETSTAKEINFO_ATTEMPT = 'GETSTAKEINFO_ATTEMPT';
export const GETSTAKEINFO_FAILED = 'GETSTAKEINFO_FAILED';
export const GETSTAKEINFO_SUCCESS = 'GETSTAKEINFO_SUCCESS';

function getStakeInfoError(error) {
  return { error, type: GETSTAKEINFO_FAILED };
}

function getStakeInfoSuccess(getStakeInfoResponse) {
  return { getStakeInfoResponse: getStakeInfoResponse, type: GETSTAKEINFO_SUCCESS };
}

export function getStakeInfoAttempt() {
  var request = new StakeInfoRequest();
  return (dispatch) => {
    dispatch({
      request: request,
      type: GETSTAKEINFO_ATTEMPT
    });
    dispatch(stakeInfo());
  };
}

function stakeInfo() {
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    const { getStakeInfoRequest } = getState().grpc;
    walletService.stakeInfo(getStakeInfoRequest,
      function (err, getStakeInfoResponse) {
        if (err) {
          dispatch(getStakeInfoError(err + ' Please try again'));
        } else {
          dispatch(getStakeInfoSuccess(getStakeInfoResponse));
        }
      });
  };
}

export const GETTICKETPRICE_ATTEMPT = 'GETTICKETPRICE_ATTEMPT';
export const GETTICKETPRICE_FAILED = 'GETTICKETPRICE_FAILED';
export const GETTICKETPRICE_SUCCESS = 'GETTICKETPRICE_SUCCESS';

function getTicketPriceError(error) {
  return { error, type: GETTICKETPRICE_FAILED };
}

function getTicketPriceSuccess(getTicketPriceResponse) {
  return { getTicketPriceResponse: getTicketPriceResponse, type: GETTICKETPRICE_SUCCESS };
}

export function getTicketPriceAttempt() {
  var request = new TicketPriceRequest();
  return (dispatch) => {
    dispatch({
      request: request,
      type: GETTICKETPRICE_ATTEMPT
    });
    dispatch(ticketPrice());
  };
}

function ticketPrice() {
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    const { getTicketPriceRequest } = getState().grpc;
    walletService.ticketPrice(getTicketPriceRequest,
      function (err, getTicketPriceResponse) {
        if (err) {
          dispatch(getTicketPriceError(err + ' Please try again'));
        } else {
          dispatch(getTicketPriceSuccess(getTicketPriceResponse));
        }
      });
  };
}

export const GETACCOUNTS_ATTEMPT = 'GETACCOUNTS_ATTEMPT';
export const GETACCOUNTS_FAILED = 'GETACCOUNTS_FAILED';
export const GETACCOUNTS_SUCCESS = 'GETACCOUNTS_SUCCESS';

function getAccountsError(error) {
  return { error, type: GETACCOUNTS_FAILED };
}

function getAccountsSuccess(getAccountsResponse) {
  return { response: getAccountsResponse, type: GETACCOUNTS_SUCCESS };
}

export function getAccountsAttempt() {
  var request = new AccountsRequest();
  return (dispatch) => {
    dispatch({
      request: request,
      type: GETACCOUNTS_ATTEMPT
    });
    dispatch(accounts());
  };
}

function accounts() {
  var request = new AccountsRequest();
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    walletService.accounts(request,
      function (err, getAccountsResponse) {
        if (err) {
          dispatch(getAccountsError(err + ' Please try again'));
        } else {
          dispatch(getAccountsSuccess(getAccountsResponse));
        }
      });
  };
}

export const GETTRANSACTIONS_ATTEMPT = 'GETTRANSACTIONS_ATTEMPT';
export const GETTRANSACTIONS_FAILED = 'GETTRANSACTIONS_FAILED';
export const GETTRANSACTIONS_PROGRESS_REGULAR = 'GETTRANSACTIONS_PROGRESS_REGULAR';
export const GETTRANSACTIONS_PROGRESS_TICKET = 'GETTRANSACTIONS_PROGRESS_TICKET';
export const GETTRANSACTIONS_PROGRESS_VOTE = 'GETTRANSACTIONS_PROGRESS_VOTE';
export const GETTRANSACTIONS_PROGRESS_REVOKE = 'GETTRANSACTIONS_PROGRESS_REVOKE';
export const GETTRANSACTIONS_UNMINED_PROGRESS = 'GETTRANSACTIONS_UNMINED_PROGRESS';
export const GETTRANSACTIONS_COMPLETE = 'GETTRANSACTIONS_COMPLETE';

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
    dispatch(getTransactionsInfo(request));
  };
}

function getTransactionsInfo(request) {
  return (dispatch, getState) => {
    const { walletService } = getState().grpc;
    var getTx = walletService.getTransactions(request);
    getTx.on('data', function (response) {
      dispatch(getTransactionsInfoProgress(response));
    });
    getTx.on('end', function () {
      dispatch(getTransactionsInfoEnd());
    });
    getTx.on('status', function (status) {
      console.log('GetTx status:', status);
    });
    getTx.on('error', function (err) {
      console.error(err + ' Please try again');
    });
  };
}

function getTransactionsInfoProgress(response) {
  return (dispatch, getState) => {
    const { regularTransactionsInfo } = getState().grpc;
    const { ticketTransactionsInfo } = getState().grpc;
    const { voteTransactionsInfo } = getState().grpc;
    const { revokeTransactionsInfo } = getState().grpc;
    var updatedRegular = regularTransactionsInfo;
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
      } else if (tx.type == TransactionDetails.TransactionType.TICKET_PURCHASE) {
        updatedTicket.unshift(tx);
      } else if (tx.type == TransactionDetails.TransactionType.VOTE) {
        updatedVote.unshift(tx);
      } else if (tx.type == TransactionDetails.TransactionType.REVOKE) {
        updatedRevoke.unshift(tx);
      }
    }
    if (updatedRegular.length !== regularTransactionsInfo) {
      dispatch({ regularTransactionsInfo: updatedRegular, type: GETTRANSACTIONS_PROGRESS_REGULAR });
    }
    if (updatedTicket.length !== ticketTransactionsInfo) {
      dispatch({ ticketTransactionsInfo: updatedTicket, type: GETTRANSACTIONS_PROGRESS_TICKET });
    }
    if (updatedVote.length !== voteTransactionsInfo) {
      dispatch({ voteTransactionsInfo: updatedVote, type: GETTRANSACTIONS_PROGRESS_VOTE });
    }
    if (updatedRevoke.length !== revokeTransactionsInfo) {
      dispatch({ revokeTransactionsInfo: updatedRevoke, type: GETTRANSACTIONS_PROGRESS_REVOKE });
    }
    if (response.getUnminedTransactionsList().length > 0) {
      console.log('unmined!', response.getUnminedTransactionsList());
      dispatch({unmined: response.getUnminedTransactionsList(), type: GETTRANSACTIONS_UNMINED_PROGRESS});
    }
    response = null;
  };
}
function getTransactionsInfoEnd() {
  return (dispatch) => {
    setTimeout(() => { dispatch({ type: GETTRANSACTIONS_COMPLETE });}, 1000);
  };
}

export const UPDATETIMESINCEBLOCK = 'UPDATETIMESINCEBLOCK';
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


export const GETAGENDASERVICE_ATTEMPT = 'GETAGENDASERVICE_ATTEMPT';
export const GETAGENDASERVICE_FAILED = 'GETAGENDASERVICE_FAILED';
export const GETAGENDASERVICE_SUCCESS = 'GETAGENDASERVICE_SUCCESS';

function getAgendaServiceError(error) {
  return { error, type: GETAGENDASERVICE_FAILED };
}

function getAgendaServiceSuccess(agendaService) {
  return (dispatch) => {
    dispatch({ agendaService, type: GETAGENDASERVICE_SUCCESS });
    setTimeout(() => { dispatch(getAgendasAttempt()); }, 10);
  };
}

export function getAgendaServiceAttempt() {
  return (dispatch) => {
    dispatch({ type: GETAGENDASERVICE_ATTEMPT });
    dispatch(getAgendaServiceAction());
  };
}

function getAgendaServiceAction() {
  return (dispatch, getState) => {
    const { address, port } = getState().grpc;
    getAgendaService(address, port, function (agendaService, err) {
      if (err) {
        dispatch(getAgendaServiceError(err + ' Please try again'));
      } else {
        dispatch(getAgendaServiceSuccess(agendaService));
      }
    });
  };
}

export const GETVOTINGSERVICE_ATTEMPT = 'GETVOTINGSERVICE_ATTEMPT';
export const GETVOTINGSERVICE_FAILED = 'GETVOTINGSERVICE_FAILED';
export const GETVOTINGSERVICE_SUCCESS = 'GETVOTINGSERVICE_SUCCESS';

function getVotingServiceError(error) {
  return { error, type: GETVOTINGSERVICE_FAILED };
}

function getVotingServiceSuccess(votingService) {
  return (dispatch) => {
    dispatch({ votingService, type: GETVOTINGSERVICE_SUCCESS });
    setTimeout(() => { dispatch(getVoteChoicesAttempt()); }, 10);
  };
}

export function getVotingServiceAttempt() {
  return (dispatch) => {
    dispatch({ type: GETVOTINGSERVICE_ATTEMPT });
    dispatch(getVotingServiceAction());
  };
}

function getVotingServiceAction() {
  return (dispatch, getState) => {
    const { address, port } = getState().grpc;
    getVotingService(address, port, function (votingService, err) {
      if (err) {
        dispatch(getVotingServiceError(err + ' Please try again'));
      } else {
        dispatch(getVotingServiceSuccess(votingService));
      }
    });
  };
}

export const GETAGENDAS_ATTEMPT = 'GETAGENDAS_ATTEMPT';
export const GETAGENDAS_FAILED = 'GETAGENDAS_FAILED';
export const GETAGENDAS_SUCCESS = 'GETAGENDAS_SUCCESS';

function getAgendasError(error) {
  return { error, type: GETAGENDAS_FAILED };
}

function getAgendasSuccess(agendas) {
  return (dispatch) => {
    dispatch({ agendas, type: GETAGENDAS_SUCCESS });
    setTimeout(() => { dispatch(getVoteChoicesAttempt()); }, 10);
  };
}

export function getAgendasAttempt() {
  return (dispatch) => {
    dispatch({ type: GETAGENDAS_ATTEMPT });
    dispatch(getAgendasAction());
  };
}

function getAgendasAction() {
  var request = new AgendasRequest();
  return (dispatch, getState) => {
    const { agendaService } = getState().grpc;
    agendaService.agendas(request, function (err, agendas) {
      if (err) {
        dispatch(getAgendasError(err + ' Please try again'));
      } else {
        dispatch(getAgendasSuccess(agendas));
      }
    });
  };
}

export const GETVOTECHOICES_ATTEMPT = 'GETVOTECHOICES_ATTEMPT';
export const GETVOTECHOICES_FAILED = 'GETVOTECHOICES_FAILED';
export const GETVOTECHOICES_SUCCESS = 'GETVOTECHOICES_SUCCESS';

function getVoteChoicesError(error) {
  return { error, type: GETVOTECHOICES_FAILED };
}

function getVoteChoicesSuccess(voteChoices) {
  return (dispatch) => {
    dispatch({ voteChoices, type: GETVOTECHOICES_SUCCESS });
  };
}

export function getVoteChoicesAttempt() {
  return (dispatch) => {
    dispatch({ type: GETVOTECHOICES_ATTEMPT });
    dispatch(getVoteChoicesAction());
  };
}

function getVoteChoicesAction() {
  var request = new VoteChoicesRequest();
  return (dispatch, getState) => {
    const { votingService } = getState().grpc;
    votingService.voteChoices(request, function (err, voteChoices) {

      if (err) {
        dispatch(getVoteChoicesError(err + ' Please try again'));
      } else {
        dispatch(getVoteChoicesSuccess(voteChoices));
      }
    });
  };
}

export const SETVOTECHOICES_ATTEMPT = 'SETVOTECHOICES_ATTEMPT';
export const SETVOTECHOICES_FAILED = 'SETVOTECHOICES_FAILED';
export const SETVOTECHOICES_SUCCESS = 'SETVOTECHOICES_SUCCESS';

function setVoteChoicesError(error) {
  return { error, type: SETVOTECHOICES_FAILED };
}

function setVoteChoicesSuccess(response) {
  return (dispatch) => {
    dispatch({ response, type: SETVOTECHOICES_SUCCESS });
    dispatch(getVoteChoicesAttempt());
  };
}

export function setVoteChoicesAttempt(agendaId, choiceId) {
  return (dispatch) => {
    var request = new SetVoteChoicesRequest();
    var choice = new SetVoteChoicesRequest.Choice();
    choice.setChoiceId(choiceId);
    choice.setAgendaId(agendaId);
    request.addChoices(choice);
    dispatch({ setVoteChoicesRequest: request, type: SETVOTECHOICES_ATTEMPT });
    dispatch(setVoteChoicesAction());
  };
}

function setVoteChoicesAction() {

  return (dispatch, getState) => {
    const { votingService } = getState().grpc;
    const { setVoteChoicesRequest } = getState().grpc;
    votingService.setVoteChoices(setVoteChoicesRequest, function (err, response) {
      if (err) {
        dispatch(setVoteChoicesError(err + ' Please try again'));
      } else {
        dispatch(setVoteChoicesSuccess(response));
      }
    });
  };
}

