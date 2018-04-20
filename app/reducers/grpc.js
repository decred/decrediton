import {
  GETWALLETSERVICE_ATTEMPT, GETWALLETSERVICE_FAILED, GETWALLETSERVICE_SUCCESS,
  GETTICKETBUYERSERVICE_ATTEMPT, GETTICKETBUYERSERVICE_FAILED, GETTICKETBUYERSERVICE_SUCCESS,
  GETBALANCE_ATTEMPT, GETBALANCE_FAILED, GETBALANCE_SUCCESS,
  GETACCOUNTNUMBER_ATTEMPT, GETACCOUNTNUMBER_FAILED, GETACCOUNTNUMBER_SUCCESS,
  GETNETWORK_ATTEMPT, GETNETWORK_FAILED, GETNETWORK_SUCCESS,
  GETPING_ATTEMPT, GETPING_FAILED, GETPING_SUCCESS,
  GETSTAKEINFO_ATTEMPT, GETSTAKEINFO_FAILED, GETSTAKEINFO_SUCCESS,
  GETTICKETPRICE_ATTEMPT, GETTICKETPRICE_FAILED, GETTICKETPRICE_SUCCESS,
  GETACCOUNTS_ATTEMPT, GETACCOUNTS_FAILED, GETACCOUNTS_SUCCESS,
  GETTRANSACTIONS_ATTEMPT, GETTRANSACTIONS_FAILED,  GETTRANSACTIONS_COMPLETE,
  NEW_TRANSACTIONS_RECEIVED, CHANGE_TRANSACTIONS_FILTER,
  UPDATETIMESINCEBLOCK,
  GETTICKETS_ATTEMPT, GETTICKETS_FAILED, GETTICKETS_COMPLETE,
  GETAGENDASERVICE_ATTEMPT, GETAGENDASERVICE_FAILED, GETAGENDASERVICE_SUCCESS,
  GETMESSAGEVERIFICATIONSERVICE_ATTEMPT, GETMESSAGEVERIFICATIONSERVICE_FAILED, GETMESSAGEVERIFICATIONSERVICE_SUCCESS,
  GETVOTINGSERVICE_ATTEMPT, GETVOTINGSERVICE_FAILED, GETVOTINGSERVICE_SUCCESS,
  GETAGENDAS_ATTEMPT, GETAGENDAS_FAILED, GETAGENDAS_SUCCESS,
  GETVOTECHOICES_ATTEMPT, GETVOTECHOICES_FAILED, GETVOTECHOICES_SUCCESS,
  SETVOTECHOICES_ATTEMPT, SETVOTECHOICES_FAILED, SETVOTECHOICES_SUCCESS,
  MATURINGHEIGHTS_CHANGED,
} from "../actions/ClientActions";
import { STARTUPBLOCK, WALLETREADY } from "../actions/DaemonActions";
import { NEWBLOCKCONNECTED } from "../actions/NotificationActions";
import {
  GETDECODEMESSAGESERVICE_ATTEMPT, GETDECODEMESSAGESERVICE_FAILED, GETDECODEMESSAGESERVICE_SUCCESS,
  DECODERAWTXS_SUCCESS
} from "../actions/DecodeMessageActions";
import { SIGNMESSAGE_ATTEMPT, SIGNMESSAGE_SUCCESS, SIGNMESSAGE_FAILED, SIGNMESSAGE_CLEANSTORE } from "../actions/ControlActions";
import { VERIFYMESSAGE_ATTEMPT, VERIFYMESSAGE_SUCCESS, VERIFYMESSAGE_FAILED, VERIFYMESSAGE_CLEANSTORE } from "../actions/ControlActions";

export default function grpc(state = {}, action) {
  switch (action.type) {
  case GETWALLETSERVICE_ATTEMPT:
    return {
      ...state,
      getWalletServiceError: null,
      getWalletServiceRequestAttempt: true,
    };
  case GETWALLETSERVICE_FAILED:
    return {
      ...state,
      getWalletServiceError: String(action.error),
      getWalletServiceRequestAttempt: false,
    };
  case GETWALLETSERVICE_SUCCESS:
    return {
      ...state,
      getWalletServiceError: null,
      getWalletServiceRequestAttempt: false,
      walletService: action.walletService,
    };
  case GETMESSAGEVERIFICATIONSERVICE_ATTEMPT:
    return {
      ...state,
      getMessageVerificationServiceError: null,
      getMessageVerificationServiceRequestAttempt: true,
    };
  case GETMESSAGEVERIFICATIONSERVICE_FAILED:
    return {
      ...state,
      getMessageVerificationServiceError: String(action.error),
      getMessageVerificationServiceRequestAttempt: false,
    };
  case GETMESSAGEVERIFICATIONSERVICE_SUCCESS:
    return {
      ...state,
      getMessageVerificationServiceError: null,
      getMessageVerificationServiceRequestAttempt: false,
      messageVerificationService: action.messageVerificationService,
    };
  case GETTICKETBUYERSERVICE_ATTEMPT:
    return {
      ...state,
      getTicketBuyerServiceError: null,
      getTicketBuyerServiceRequestAttempt: true,
    };
  case GETTICKETBUYERSERVICE_FAILED:
    return {
      ...state,
      getTicketBuyerServiceError: String(action.error),
      getTicketBuyerServiceRequestAttempt: false,
    };
  case GETTICKETBUYERSERVICE_SUCCESS:
    return {
      ...state,
      getTicketBuyerError: null,
      getTicketBuyerServiceRequestAttempt: false,
      ticketBuyerService: action.ticketBuyerService,
    };
  case GETBALANCE_ATTEMPT:
    return {
      ...state,
      getBalanceError: null,
      getBalanceRequestAttempt: true,
    };
  case GETBALANCE_FAILED:
    return {
      ...state,
      getBalanceError: String(action.error),
      getBalanceRequestAttempt: false,
    };
  case GETBALANCE_SUCCESS:
    return {
      ...state,
      getBalanceError: "",
      getBalanceRequestAttempt: false,
      balances: action.balances,
    };
  case GETACCOUNTNUMBER_ATTEMPT:
    return {
      ...state,
      getAccountNumberError: "",
      getAccountNumberRequestAttempt: true,
    };
  case GETACCOUNTNUMBER_FAILED:
    return {
      ...state,
      getAccountNumberError: String(action.error),
      getAccountNumberRequestAttempt: false,
    };
  case GETACCOUNTNUMBER_SUCCESS:
    return {
      ...state,
      getAccountNumberError: "",
      getAccountNumberRequestAttempt: false,
      getAccountNumberResponse: action.getAccountNumberResponse,
    };
  case GETNETWORK_ATTEMPT:
    return {
      ...state,
      getNetworkError: null,
      getNetworkRequestAttempt: true,
    };
  case GETNETWORK_FAILED:
    return {
      ...state,
      getNetworkError: String(action.error),
      getNetworkRequestAttempt: false,
    };
  case GETNETWORK_SUCCESS:
    return {
      ...state,
      getNetworkError: null,
      getNetworkRequestAttempt: false,
      getNetworkResponse: action.getNetworkResponse,
    };
  case GETPING_ATTEMPT:
    return {
      ...state,
      getPingError: "",
      getPingRequestAttempt: true,
    };
  case GETPING_FAILED:
    return {
      ...state,
      getPingError: String(action.error),
      getPingRequestAttempt: false,
    };
  case GETPING_SUCCESS:
    return {
      ...state,
      getPingError: "",
      getPingRequestAttempt: false,
      getPingResponse: action.getPingResponse,
    };
  case GETSTAKEINFO_ATTEMPT:
    return {
      ...state,
      getStakeInfoError: "",
      getStakeInfoRequestAttempt: true,
    };
  case GETSTAKEINFO_FAILED:
    return {
      ...state,
      getStakeInfoError: String(action.error),
      getStakeInfoRequestAttempt: false,
    };
  case GETSTAKEINFO_SUCCESS:
    return {
      ...state,
      getStakeInfoError: "",
      getStakeInfoRequestAttempt: false,
      getStakeInfoResponse: action.getStakeInfoResponse,
    };
  case GETTICKETPRICE_ATTEMPT:
    return {
      ...state,
      getTicketPriceError: "",
      getTicketPriceRequestAttempt: true,
    };
  case GETTICKETPRICE_FAILED:
    return {
      ...state,
      getTicketPriceError: String(action.error),
      getTicketPriceRequestAttempt: false,
    };
  case GETTICKETPRICE_SUCCESS:
    return {
      ...state,
      getTicketPriceError: "",
      getTicketPriceRequestAttempt: false,
      getTicketPriceResponse: action.getTicketPriceResponse,
    };
  case GETACCOUNTS_ATTEMPT:
    return {
      ...state,
      getAccountsError: "",
      getAccountsRequestAttempt: true,
    };
  case GETACCOUNTS_FAILED:
    return {
      ...state,
      getAccountsError: String(action.error),
      getAccountsRequestAttempt: false,
    };
  case GETACCOUNTS_SUCCESS:
    return {
      ...state,
      getAccountsError: "",
      getAccountsRequestAttempt: false,
      getAccountsResponse: action.response,
    };
  case GETTICKETS_ATTEMPT:
    return {
      ...state,
      getTicketsRequestAttempt: true,
    };
  case GETTICKETS_FAILED:
    return {
      ...state,
      getTicketsRequestError: String(action.error),
      getTicketsRequestAttempt: false,
    };
  case GETTICKETS_COMPLETE:
    return {
      ...state,
      tickets: action.tickets,
      getTicketsRequestError: "",
      getTicketsRequestAttempt: false,
    };
  case GETTRANSACTIONS_ATTEMPT:
    return {
      ...state,
      getTransactionsRequestAttempt: true,
    };
  case GETTRANSACTIONS_FAILED:
    return {
      ...state,
      getTransactionsRequestError: String(action.error),
      getTransactionsRequestAttempt: false,
    };
  case GETTRANSACTIONS_COMPLETE:
    var transactions = [ ...action.unminedTransactions, ...action.minedTransactions ];
    return {
      ...state,
      minedTransactions: action.minedTransactions,
      unminedTransactions: action.unminedTransactions,
      transactions: transactions,
      noMoreTransactions: action.noMoreTransactions,
      lastTransaction: action.lastTransaction,
      getTransactionsRequestError: "",
      getTransactionsRequestAttempt: false,
      recentRegularTransactions: action.recentRegularTransactions
        ? action.recentRegularTransactions
        : state.recentRegularTransactions,
      recentStakeTransactions: action.recentStakeTransactions
        ? action.recentStakeTransactions
        : state.recentStakeTransactions
    };
  case NEW_TRANSACTIONS_RECEIVED:
    return {
      ...state,
      minedTransactions: action.minedTransactions,
      unminedTransactions: action.unminedTransactions,
      transactions: [ ...action.unminedTransactions, ...action.minedTransactions ],
      recentRegularTransactions: action.recentRegularTransactions,
      recentStakeTransactions: action.recentStakeTransactions,
    };
  case CHANGE_TRANSACTIONS_FILTER:
    return {
      ...state,
      transactionsFilter: action.transactionsFilter,
      minedTransactions: [],
      unminedTransactions: [],
      transactions: [],
      lastTransaction: null,
      noMoreTransactions: false
    };
  case UPDATETIMESINCEBLOCK:
    return {
      ...state,
      recentBlockTimestamp: action.recentBlockTimestamp,
    };
  case STARTUPBLOCK:
    return {
      ...state,
      currentBlockHeight: action.currentBlockHeight,
    };
  case NEWBLOCKCONNECTED:
    var newMaturingBlockHeights = Object.keys(state.maturingBlockHeights)
      .reduce((o, h) => {
        h > action.currentBlockHeight ? o[h] = state.maturingBlockHeights[h] : null;
        return o;
      }, {});
    return {
      ...state,
      recentBlockTimestamp: action.currentBlockTimestamp,
      currentBlockHeight: action.currentBlockHeight,
      maturingBlockHeights: newMaturingBlockHeights,
    };
  case GETAGENDASERVICE_ATTEMPT:
    return {
      ...state,
      getAgendaServiceError: null,
      getAgendaServiceRequestAttempt: true,
    };
  case GETAGENDASERVICE_FAILED:
    return {
      ...state,
      getAgendaServiceError: String(action.error),
      getAgendaServiceRequestAttempt: false,
    };
  case GETAGENDASERVICE_SUCCESS:
    return {
      ...state,
      getAgendaServiceRequestAttempt: false,
      agendaService: action.agendaService,
    };
  case GETVOTINGSERVICE_ATTEMPT:
    return {
      ...state,
      getVotingServiceError: null,
      getVotingServiceRequestAttempt: true,
    };
  case GETVOTINGSERVICE_FAILED:
    return {
      ...state,
      getVotingServiceError: String(action.error),
      getVotingServiceRequestAttempt: false,
    };
  case GETVOTINGSERVICE_SUCCESS:
    return {
      ...state,
      getVotingServiceRequestAttempt: false,
      votingService: action.votingService,
    };
  case SIGNMESSAGE_ATTEMPT:
    return {
      ...state,
      getSignMessageRequestAttempt: true,
    };
  case SIGNMESSAGE_FAILED:
    return {
      ...state,
      getSignMessageSuccess: null,
      getSignMessageError: String(action.error),
      getSignMessageRequestAttempt: false,
    };
  case SIGNMESSAGE_SUCCESS:
    return {
      ...state,
      getSignMessageError: null,
      getSignMessageResponse: action.getSignMessageResponse,
      getSignMessageRequestAttempt: false,
    };
  case SIGNMESSAGE_CLEANSTORE:
    return {
      ...state,
      getSignMessageError: null,
      getSignMessageResponse: null,
      getSignMessageRequestAttempt: false,
    };
  case VERIFYMESSAGE_ATTEMPT:
    return {
      ...state,
      getVerifyMessageRequestAttempt: true,
    };
  case VERIFYMESSAGE_FAILED:
    return {
      ...state,
      getVerifyMessageSuccess: null,
      getVerifyMessageError: String(action.error),
      getVerifyMessageRequestAttempt: false,
    };
  case VERIFYMESSAGE_SUCCESS:
    return {
      ...state,
      getVerifyMessageError: null,
      getVerifyMessageResponse: action.getVerifyMessageResponse,
      getVerifyMessageRequestAttempt: false,
    };
  case VERIFYMESSAGE_CLEANSTORE:
    return {
      ...state,
      getVerifyMessageError: null,
      getVerifyMessageResponse: null,
      getVerifyMessageRequestAttempt: false,
    };
  case GETAGENDAS_ATTEMPT:
    return {
      ...state,
      getAgendasError: null,
      getAgendasRequestAttempt: true,
    };
  case GETAGENDAS_FAILED:
    return {
      ...state,
      getAgendasError: String(action.error),
      getAgendasRequestAttempt: false,
    };
  case GETAGENDAS_SUCCESS:
    return {
      ...state,
      getAgendasRequestAttempt: false,
      getAgendasResponse: action.agendas,
    };
  case GETVOTECHOICES_ATTEMPT:
    return {
      ...state,
      getVoteChoicesError: null,
      getVoteChoicesRequestAttempt: true,
    };
  case GETVOTECHOICES_FAILED:
    return {
      ...state,
      getVoteChoicesError: String(action.error),
      getVoteChoicesRequestAttempt: false,
    };
  case GETVOTECHOICES_SUCCESS:
    return {
      ...state,
      getVoteChoicesRequestAttempt: false,
      getVoteChoicesResponse: action.voteChoices,
    };
  case SETVOTECHOICES_ATTEMPT:
    return {
      ...state,
      setVoteChoicesError: null,
      setVoteChoicesRequestAttempt: true,
    };
  case SETVOTECHOICES_FAILED:
    return {
      ...state,
      setVoteChoicesError: String(action.error),
      setVoteChoicesRequestAttempt: false,
    };
  case SETVOTECHOICES_SUCCESS:
    return {
      ...state,
      setVoteChoicesRequestAttempt: false,
      setVoteChoicesResponse: action.voteChoices,
    };
  case GETDECODEMESSAGESERVICE_ATTEMPT:
    return {
      ...state,
      getMessageDecodeServiceRequestAttempt: true,
      getMessageDecodeServiceError: null
    };
  case GETDECODEMESSAGESERVICE_FAILED:
    return {
      ...state,
      getMessageDecodeServiceRequestAttempt: false,
      getMessageDecodeServiceError: String(action.error)
    };
  case GETDECODEMESSAGESERVICE_SUCCESS:
    return {
      ...state,
      getMessageDecodeServiceRequestAttempt: false,
      getMessageDecodeServiceError: null,
      decodeMessageService: action.decodeMessageService,
    };
  case DECODERAWTXS_SUCCESS:
    return {
      ...state,
      decodedTransactions: {
        ...state.decodedTransactions,
        ...action.transactions
      }
    };
  case MATURINGHEIGHTS_CHANGED:
    return {
      ...state,
      maturingBlockHeights: action.maturingBlockHeights,
    };
  case WALLETREADY:
    return {
      ...state,
      port: action.port
    };
  default:
    return state;
  }
}
