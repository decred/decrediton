import {
  GETWALLETSERVICE_ATTEMPT,
  GETWALLETSERVICE_FAILED,
  GETWALLETSERVICE_SUCCESS,
  GETTICKETBUYERSERVICE_ATTEMPT,
  GETTICKETBUYERSERVICE_FAILED,
  GETTICKETBUYERSERVICE_SUCCESS,
  GETBALANCE_ATTEMPT,
  GETBALANCE_FAILED,
  GETBALANCE_SUCCESS,
  GETACCOUNTNUMBER_ATTEMPT,
  GETACCOUNTNUMBER_FAILED,
  GETACCOUNTNUMBER_SUCCESS,
  GETNETWORK_ATTEMPT,
  GETNETWORK_FAILED,
  GETNETWORK_SUCCESS,
  GETPING_ATTEMPT,
  GETPING_FAILED,
  GETPING_SUCCESS,
  GETPING_CANCELED,
  GETSTAKEINFO_ATTEMPT,
  GETSTAKEINFO_FAILED,
  GETSTAKEINFO_SUCCESS,
  GETTICKETPRICE_ATTEMPT,
  GETTICKETPRICE_FAILED,
  GETTICKETPRICE_SUCCESS,
  GETACCOUNTS_ATTEMPT,
  GETACCOUNTS_FAILED,
  GETACCOUNTS_SUCCESS,
  GETTRANSACTIONS_ATTEMPT,
  GETTRANSACTIONS_FAILED,
  GETTRANSACTIONS_COMPLETE,
  NEW_TRANSACTIONS_RECEIVED,
  CHANGE_TRANSACTIONS_FILTER,
  UPDATETIMESINCEBLOCK,
  GETTICKETS_ATTEMPT,
  GETTICKETS_FAILED,
  GETTICKETS_COMPLETE,
  CLEAR_TICKETS,
  GETTICKETS_PROGRESS,
  GETTICKETS_CANCEL,
  GETAGENDASERVICE_ATTEMPT,
  GETAGENDASERVICE_FAILED,
  GETAGENDASERVICE_SUCCESS,
  RAWTICKETTRANSACTIONS_DECODED,
  CHANGE_TICKETS_FILTER,
  GETMESSAGEVERIFICATIONSERVICE_ATTEMPT,
  GETMESSAGEVERIFICATIONSERVICE_FAILED,
  GETMESSAGEVERIFICATIONSERVICE_SUCCESS,
  GETVOTINGSERVICE_ATTEMPT,
  GETVOTINGSERVICE_FAILED,
  GETVOTINGSERVICE_SUCCESS,
  GETAGENDAS_ATTEMPT,
  GETAGENDAS_FAILED,
  GETAGENDAS_SUCCESS,
  GETVOTECHOICES_ATTEMPT,
  GETVOTECHOICES_FAILED,
  GETVOTECHOICES_SUCCESS,
  SETVOTECHOICES_ATTEMPT,
  SETVOTECHOICES_FAILED,
  SETVOTECHOICES_SUCCESS,
  MATURINGHEIGHTS_CHANGED,
  GETBESTBLOCK_ATTEMPT,
  GETBESTBLOCK_FAILED,
  GETBESTBLOCK_SUCCESS,
  STARTWALLETSERVICE_ATTEMPT,
  STARTWALLETSERVICE_FAILED,
  STARTWALLETSERVICE_SUCCESS,
  GETTREASURY_BALANCE_SUCCESS,
  RESET_TREASURY_BALANCE,
  FETCHMISSINGSTAKETXDATA_ATTEMPT,
  FETCHMISSINGSTAKETXDATA_SUCCESS,
  FETCHMISSINGSTAKETXDATA_FAILED,
  GETSTARTUPTRANSACTIONS_SUCCESS,
  GETALLAGENDAS_SUCCESS,
  GETALLAGENDAS_FAILED,
  ABANDONTRANSACTION_ATTEMPT,
  ABANDONTRANSACTION_SUCCESS,
  ABANDONTRANSACTION_FAILED
} from "../actions/ClientActions";
import { DAEMONSYNCED, WALLETREADY } from "../actions/DaemonActions";
import { NEWBLOCKCONNECTED } from "../actions/NotificationActions";
import {
  GETDECODEMESSAGESERVICE_ATTEMPT,
  GETDECODEMESSAGESERVICE_FAILED,
  GETDECODEMESSAGESERVICE_SUCCESS,
  DECODERAWTXS_SUCCESS
} from "../actions/DecodeMessageActions";
import {
  SIGNMESSAGE_ATTEMPT,
  SIGNMESSAGE_SUCCESS,
  SIGNMESSAGE_FAILED,
  SIGNMESSAGE_CLEANSTORE
} from "../actions/ControlActions";
import {
  VERIFYMESSAGE_ATTEMPT,
  VERIFYMESSAGE_SUCCESS,
  VERIFYMESSAGE_FAILED,
  VERIFYMESSAGE_CLEANSTORE
} from "../actions/ControlActions";
import { CLOSEWALLET_SUCCESS } from "actions/WalletLoaderActions";
import {
  GETACCOUNTMIXERSERVICE_SUCCESS,
  RUNACCOUNTMIXER_SUCCESS,
  STOPMIXER_SUCCESS
} from "actions/AccountMixerActions";

export default function grpc(state = {}, action) {
  let idxOldTicket;
  let newTickets;
  let transactions;
  let newMaturingBlockHeights;
  switch (action.type) {
    case GETACCOUNTMIXERSERVICE_SUCCESS:
      return {
        ...state,
        accountMixerService: action.accountMixerService
      };
    case RUNACCOUNTMIXER_SUCCESS:
      return {
        ...state,
        accountMixerRunning: true,
        mixerStreamer: action.mixerStreamer
      };
    case STOPMIXER_SUCCESS:
      return {
        ...state,
        accountMixerRunning: false,
        mixerStreamer: null
      };
    case GETTREASURY_BALANCE_SUCCESS:
      return {
        ...state,
        treasuryBalance: action.treasuryBalance
      };
    case RESET_TREASURY_BALANCE:
      return {
        ...state,
        treasuryBalance: null
      };
    case GETWALLETSERVICE_ATTEMPT:
      return {
        ...state,
        getWalletServiceError: null,
        getWalletServiceRequestAttempt: true
      };
    case GETWALLETSERVICE_FAILED:
      return {
        ...state,
        getWalletServiceError: String(action.error),
        getWalletServiceRequestAttempt: false
      };
    case GETWALLETSERVICE_SUCCESS:
      return {
        ...state,
        getWalletServiceError: null,
        getWalletServiceRequestAttempt: false,
        walletService: action.walletService
      };
    case GETMESSAGEVERIFICATIONSERVICE_ATTEMPT:
      return {
        ...state,
        getMessageVerificationServiceError: null,
        getMessageVerificationServiceRequestAttempt: true
      };
    case GETMESSAGEVERIFICATIONSERVICE_FAILED:
      return {
        ...state,
        getMessageVerificationServiceError: String(action.error),
        getMessageVerificationServiceRequestAttempt: false
      };
    case GETMESSAGEVERIFICATIONSERVICE_SUCCESS:
      return {
        ...state,
        getMessageVerificationServiceError: null,
        getMessageVerificationServiceRequestAttempt: false,
        messageVerificationService: action.messageVerificationService
      };
    case GETTICKETBUYERSERVICE_ATTEMPT:
      return {
        ...state,
        getTicketBuyerServiceError: null,
        getTicketBuyerServiceRequestAttempt: true
      };
    case GETTICKETBUYERSERVICE_FAILED:
      return {
        ...state,
        getTicketBuyerServiceError: String(action.error),
        getTicketBuyerServiceRequestAttempt: false
      };
    case GETTICKETBUYERSERVICE_SUCCESS:
      return {
        ...state,
        getTicketBuyerError: null,
        getTicketBuyerServiceRequestAttempt: false,
        ticketBuyerService: action.ticketBuyerService
      };
    case GETBALANCE_ATTEMPT:
      return {
        ...state,
        getBalanceError: null,
        getBalanceRequestAttempt: true
      };
    case GETBALANCE_FAILED:
      return {
        ...state,
        getBalanceError: String(action.error),
        getBalanceRequestAttempt: false
      };
    case GETBALANCE_SUCCESS:
      return {
        ...state,
        getBalanceError: "",
        getBalanceRequestAttempt: false,
        balances: action.balances
      };
    case GETACCOUNTNUMBER_ATTEMPT:
      return {
        ...state,
        getAccountNumberError: "",
        getAccountNumberRequestAttempt: true
      };
    case GETACCOUNTNUMBER_FAILED:
      return {
        ...state,
        getAccountNumberError: String(action.error),
        getAccountNumberRequestAttempt: false
      };
    case GETACCOUNTNUMBER_SUCCESS:
      return {
        ...state,
        getAccountNumberError: "",
        getAccountNumberRequestAttempt: false,
        getAccountNumberResponse: action.getAccountNumberResponse
      };
    case GETBESTBLOCK_ATTEMPT:
      return {
        ...state,
        getBestBlockHeightRequest: true,
        getAccountNumberError: null
      };
    case GETBESTBLOCK_FAILED:
      return {
        ...state,
        getBestBlockHeightRequest: false,
        getAccountNumberError: action.error
      };
    case GETBESTBLOCK_SUCCESS:
      return {
        ...state,
        getBestBlockHeightRequest: false,
        getAccountNumberError: null,
        currentBlockHeight: action.height
      };
    case GETNETWORK_ATTEMPT:
      return {
        ...state,
        getNetworkError: null,
        getNetworkRequestAttempt: true
      };
    case GETNETWORK_FAILED:
      return {
        ...state,
        getNetworkError: String(action.error),
        getNetworkRequestAttempt: false
      };
    case GETNETWORK_SUCCESS:
      return {
        ...state,
        getNetworkError: null,
        getNetworkRequestAttempt: false,
        getNetworkResponse: action.getNetworkResponse
      };
    case GETPING_ATTEMPT:
      return {
        ...state,
        getPingError: "",
        getPingRequestAttempt: true,
        pingTimer: null
      };
    case GETPING_FAILED:
      return {
        ...state,
        getPingError: String(action.error),
        getPingRequestAttempt: false,
        pingTimer: null
      };
    case GETPING_SUCCESS:
      return {
        ...state,
        getPingError: "",
        getPingRequestAttempt: false,
        getPingResponse: action.getPingResponse,
        pingTimer: action.pingTimer
      };
    case GETPING_CANCELED:
      return {
        ...state,
        getPingError: "",
        getPingRequestAttempt: false,
        getPingResponse: null,
        pingTimer: null
      };
    case GETSTAKEINFO_ATTEMPT:
      return {
        ...state,
        getStakeInfoError: "",
        getStakeInfoRequestAttempt: true
      };
    case GETSTAKEINFO_FAILED:
      return {
        ...state,
        getStakeInfoError: String(action.error),
        getStakeInfoRequestAttempt: false
      };
    case GETSTAKEINFO_SUCCESS:
      return {
        ...state,
        getStakeInfoError: "",
        getStakeInfoRequestAttempt: false,
        getStakeInfoResponse: action.getStakeInfoResponse
      };
    case GETTICKETPRICE_ATTEMPT:
      return {
        ...state,
        getTicketPriceError: "",
        getTicketPriceRequestAttempt: true
      };
    case GETTICKETPRICE_FAILED:
      return {
        ...state,
        getTicketPriceError: String(action.error),
        getTicketPriceRequestAttempt: false
      };
    case GETTICKETPRICE_SUCCESS:
      return {
        ...state,
        getTicketPriceError: "",
        getTicketPriceRequestAttempt: false,
        getTicketPriceResponse: action.getTicketPriceResponse
      };
    case GETACCOUNTS_ATTEMPT:
      return {
        ...state,
        getAccountsError: "",
        getAccountsRequestAttempt: true
      };
    case GETACCOUNTS_FAILED:
      return {
        ...state,
        getAccountsError: String(action.error),
        getAccountsRequestAttempt: false
      };
    case GETACCOUNTS_SUCCESS:
      return {
        ...state,
        getAccountsError: "",
        getAccountsRequestAttempt: false,
        getAccountsResponse: action.response
      };
    case GETTICKETS_ATTEMPT:
      return {
        ...state,
        getTicketsRequestAttempt: true,
        getTicketsCancel: false
      };
    case GETTICKETS_FAILED:
      return {
        ...state,
        getTicketsRequestError: String(action.error),
        getTicketsRequestAttempt: false,
        getTicketsCancel: false,
        getTicketsProgressStartRequestHeight: null
      };
    case GETTICKETS_COMPLETE:
      return {
        ...state,
        tickets: [...action.unminedTickets, ...action.minedTickets],
        unminedTickets: action.unminedTickets,
        minedTickets: action.minedTickets,
        noMoreTickets: action.noMoreTickets,
        getTicketsRequestError: "",
        getTicketsRequestAttempt: false,
        getTicketsStartRequestHeight: action.getTicketsStartRequestHeight,
        getTicketsCancel: false,
        getTicketsProgressStartRequestHeight: null
      };
    case GETTICKETS_PROGRESS:
      return {
        ...state,
        getTicketsProgressStartRequestHeight: action.startRequestHeight
      };
    case GETTICKETS_CANCEL:
      return {
        ...state,
        getTicketsCancel: true
      };
    case CLEAR_TICKETS:
      return {
        ...state,
        tickets: [],
        unminedTickets: [],
        minedTickets: [],
        noMoreTickets: false,
        lastTicket: null,
        getTicketsStartRequestHeight: null
      };
    case RAWTICKETTRANSACTIONS_DECODED:
      idxOldTicket = state.tickets.indexOf(action.ticket);
      if (idxOldTicket < 0) {
        console.log("decoded did not find", idxOldTicket);
        return state;
      }
      newTickets = state.tickets.slice();
      newTickets.splice(idxOldTicket, 1, action.newTicket);
      return {
        ...state,
        tickets: newTickets
      };
    case CHANGE_TICKETS_FILTER:
      return {
        ...state,
        ticketsFilter: action.ticketsFilter,
        tickets: [],
        unminedTickets: [],
        minedTickets: [],
        noMoreTickets: false,
        lastTicket: null,
        getTicketsRequestError: "",
        getTicketsRequestAttempt: false,
        getTicketsStartRequestHeight: null
      };
    case GETTRANSACTIONS_ATTEMPT:
      return {
        ...state,
        getTransactionsRequestAttempt: true
      };
    case GETTRANSACTIONS_FAILED:
      return {
        ...state,
        getTransactionsRequestError: String(action.error),
        getTransactionsRequestAttempt: false
      };
    case GETTRANSACTIONS_COMPLETE:
      transactions = [
        ...action.unminedTransactions,
        ...action.minedTransactions
      ];
      return {
        ...state,
        minedTransactions: action.minedTransactions,
        unminedTransactions: action.unminedTransactions,
        transactions: transactions,
        noMoreTransactions: action.noMoreTransactions,
        lastTransaction: action.lastTransaction,
        getTransactionsRequestError: "",
        getTransactionsRequestAttempt: false
      };
    case ABANDONTRANSACTION_ATTEMPT:
      return { ...state, abandonTransactionRequestAttempt: true };
    case ABANDONTRANSACTION_FAILED:
      return { ...state, abandonTransactionRequestAttempt: false };
    case ABANDONTRANSACTION_SUCCESS:
      return { ...state, abandonTransactionRequestAttempt: false };
    case NEW_TRANSACTIONS_RECEIVED:
      return {
        ...state,
        minedTransactions: action.minedTransactions,
        unminedTransactions: action.unminedTransactions,
        transactions: [
          ...action.unminedTransactions,
          ...action.minedTransactions
        ],
        recentRegularTransactions: action.recentRegularTransactions,
        recentStakeTransactions: action.recentStakeTransactions
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
    case FETCHMISSINGSTAKETXDATA_ATTEMPT:
      return {
        ...state,
        fetchMissingStakeTxDataAttempt: {
          ...state.fetchMissingStakeTxDataAttempt,
          [action.txHash]: true
        }
      };
    case FETCHMISSINGSTAKETXDATA_SUCCESS:
      return {
        ...state,
        transactions: action.transactions || state.transactions,
        recentStakeTransactions:
          action.recentStakeTransactions || state.recentStakeTransactions,
        fetchMissingStakeTxDataAttempt: {
          ...state.fetchMissingStakeTxDataAttempt,
          [action.txHash]: false
        }
      };
    case FETCHMISSINGSTAKETXDATA_FAILED:
      return {
        ...state,
        fetchMissingStakeTxDataAttempt: {
          ...state.fetchMissingStakeTxDataAttempt,
          [action.txHash]: false
        }
      };
    case UPDATETIMESINCEBLOCK:
      return {
        ...state,
        recentBlockTimestamp: action.recentBlockTimestamp
      };
    case DAEMONSYNCED:
      return {
        ...state,
        currentBlockHeight: action.currentBlockHeight
      };
    case NEWBLOCKCONNECTED:
      newMaturingBlockHeights = Object.keys(state.maturingBlockHeights).reduce(
        (o, h) => {
          h > action.currentBlockHeight
            ? (o[h] = state.maturingBlockHeights[h])
            : null;
          return o;
        },
        {}
      );
      return {
        ...state,
        recentBlockTimestamp: action.currentBlockTimestamp,
        currentBlockHeight: action.currentBlockHeight,
        maturingBlockHeights: newMaturingBlockHeights
      };
    case GETAGENDASERVICE_ATTEMPT:
      return {
        ...state,
        getAgendaServiceError: null,
        getAgendaServiceRequestAttempt: true
      };
    case GETAGENDASERVICE_FAILED:
      return {
        ...state,
        getAgendaServiceError: String(action.error),
        getAgendaServiceRequestAttempt: false
      };
    case GETAGENDASERVICE_SUCCESS:
      return {
        ...state,
        getAgendaServiceRequestAttempt: false,
        agendaService: action.agendaService
      };
    case GETVOTINGSERVICE_ATTEMPT:
      return {
        ...state,
        getVotingServiceError: null,
        getVotingServiceRequestAttempt: true
      };
    case GETVOTINGSERVICE_FAILED:
      return {
        ...state,
        getVotingServiceError: String(action.error),
        getVotingServiceRequestAttempt: false
      };
    case GETVOTINGSERVICE_SUCCESS:
      return {
        ...state,
        getVotingServiceRequestAttempt: false,
        votingService: action.votingService
      };
    case SIGNMESSAGE_ATTEMPT:
      return {
        ...state,
        getSignMessageRequestAttempt: true
      };
    case SIGNMESSAGE_FAILED:
      return {
        ...state,
        getSignMessageSignature: null,
        getSignMessageError: String(action.error),
        getSignMessageRequestAttempt: false
      };
    case SIGNMESSAGE_SUCCESS:
      return {
        ...state,
        getSignMessageError: null,
        getSignMessageSignature: action.getSignMessageSignature,
        getSignMessageRequestAttempt: false
      };
    case SIGNMESSAGE_CLEANSTORE:
      return {
        ...state,
        getSignMessageError: null,
        getSignMessageSignature: null,
        getSignMessageRequestAttempt: false
      };
    case VERIFYMESSAGE_ATTEMPT:
      return {
        ...state,
        getVerifyMessageRequestAttempt: true
      };
    case VERIFYMESSAGE_FAILED:
      return {
        ...state,
        getVerifyMessageSuccess: null,
        getVerifyMessageError: String(action.error),
        getVerifyMessageRequestAttempt: false
      };
    case VERIFYMESSAGE_SUCCESS:
      return {
        ...state,
        getVerifyMessageError: null,
        getVerifyMessageResponse: action.getVerifyMessageResponse,
        getVerifyMessageRequestAttempt: false
      };
    case VERIFYMESSAGE_CLEANSTORE:
      return {
        ...state,
        getVerifyMessageError: null,
        getVerifyMessageResponse: null,
        getVerifyMessageRequestAttempt: false
      };
    case GETAGENDAS_ATTEMPT:
      return {
        ...state,
        getAgendasError: null,
        getAgendasRequestAttempt: true
      };
    case GETAGENDAS_FAILED:
      return {
        ...state,
        getAgendasError: String(action.error),
        getAgendasRequestAttempt: false
      };
    case GETAGENDAS_SUCCESS:
      return {
        ...state,
        getAgendasRequestAttempt: false,
        getAgendasResponse: action.agendas
      };
    case GETVOTECHOICES_ATTEMPT:
      return {
        ...state,
        getVoteChoicesError: null,
        getVoteChoicesRequestAttempt: true
      };
    case GETVOTECHOICES_FAILED:
      return {
        ...state,
        getVoteChoicesError: String(action.error),
        getVoteChoicesRequestAttempt: false
      };
    case GETVOTECHOICES_SUCCESS:
      return {
        ...state,
        getVoteChoicesRequestAttempt: false,
        getVoteChoicesResponse: action.voteChoices
      };
    case SETVOTECHOICES_ATTEMPT:
      return {
        ...state,
        setVoteChoicesError: null,
        setVoteChoicesRequestAttempt: true
      };
    case SETVOTECHOICES_FAILED:
      return {
        ...state,
        setVoteChoicesError: String(action.error),
        setVoteChoicesRequestAttempt: false
      };
    case SETVOTECHOICES_SUCCESS:
      return {
        ...state,
        setVoteChoicesRequestAttempt: false,
        setVoteChoicesResponse: action.voteChoices
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
        decodeMessageService: action.decodeMessageService
      };
    case DECODERAWTXS_SUCCESS:
      return {
        ...state,
        decodedTransactions: {
          ...state.decodedTransactions,
          ...action.transactions
        }
      };
    case GETSTARTUPTRANSACTIONS_SUCCESS:
      return {
        ...state,
        maturingBlockHeights: action.maturingBlockHeights,
        recentRegularTransactions: action.recentRegularTxs,
        recentStakeTransactions: action.recentStakeTxs
      };
    case MATURINGHEIGHTS_CHANGED:
      return {
        ...state,
        maturingBlockHeights: action.maturingBlockHeights
      };
    case WALLETREADY:
      return {
        ...state,
        port: action.port
      };
    case CLOSEWALLET_SUCCESS:
      return {
        ...state,
        port: "9121",
        agendaService: null,
        balances: [],
        decodeMessageService: null,
        decodedTransactions: {},
        getAccountsResponse: null,
        getAgendasResponse: null,
        getNetworkResponse: null,
        getStakeInfoResponse: null,
        getTicketPriceResponse: null,
        lastTransaction: null,
        maturingBlockHeights: {},
        minedTransactions: Array(),
        unminedTransactions: Array(),
        tickets: Array(),
        transactions: Array(),
        noMoreTransactions: false,
        transactionsFilter: {
          search: null,
          listDirection: "desc",
          types: [],
          direction: null
        },
        recentRegularTransactions: Array(),
        recentStakeTransactions: Array(),
        ticketBuyerService: null,
        transactionsSinceLastOpened: null,
        votingService: null,
        walletService: null
      };
    case STARTWALLETSERVICE_ATTEMPT:
      return {
        ...state,
        startWalletServiceAttempt: true,
        startWalletServiceSuccess: null,
        startWalletServiceFailed: null
      };
    case STARTWALLETSERVICE_FAILED:
      return {
        ...state,
        startWalletServiceAttempt: false,
        startWalletServiceFailed: action.error,
        startWalletServiceSuccess: null
      };
    case STARTWALLETSERVICE_SUCCESS:
      return {
        ...state,
        startWalletServiceAttempt: false,
        startWalletServiceFailed: null,
        startWalletServiceSuccess: action.success
      };
    case GETALLAGENDAS_SUCCESS:
      return { ...state, allAgendas: action.allAgendas };
    case GETALLAGENDAS_FAILED:
      return { ...state, getAllAgendasError: String(action.error) };
    default:
      return state;
  }
}
