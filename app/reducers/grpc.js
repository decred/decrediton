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
  GETSTAKEINFO_ATTEMPT,
  GETSTAKEINFO_FAILED,
  GETSTAKEINFO_SUCCESS,
  GETTICKETPRICE_ATTEMPT,
  GETTICKETPRICE_FAILED,
  GETTICKETPRICE_SUCCESS,
  GETACCOUNTS_ATTEMPT,
  GETACCOUNTS_FAILED,
  GETACCOUNTS_SUCCESS,
  UPDATETIMESINCEBLOCK,
  GETAGENDASERVICE_ATTEMPT,
  GETAGENDASERVICE_FAILED,
  GETAGENDASERVICE_SUCCESS,
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
  GETTREASURY_POLICIES_ATTEMPT,
  GETTREASURY_POLICIES_FAILED,
  GETTREASURY_POLICIES_SUCCESS,
  SETTREASURY_POLICY_ATTEMPT,
  SETTREASURY_POLICY_FAILED,
  SETTREASURY_POLICY_SUCCESS,
  GETBESTBLOCK_ATTEMPT,
  GETBESTBLOCK_FAILED,
  GETBESTBLOCK_SUCCESS,
  STARTWALLETSERVICE_ATTEMPT,
  STARTWALLETSERVICE_FAILED,
  STARTWALLETSERVICE_SUCCESS,
  GETTREASURY_BALANCE_SUCCESS,
  RESET_TREASURY_BALANCE,
  GETALLAGENDAS_SUCCESS,
  GETALLAGENDAS_FAILED,
  ABANDONTRANSACTION_ATTEMPT,
  ABANDONTRANSACTION_SUCCESS,
  ABANDONTRANSACTION_FAILED,
  MIXERACCOUNTS_SPENDABLE_BALANCE,
  GETDECODEMSGSERVICE_ATTEMPT,
  GETDECODEMSGSERVICE_FAILED,
  GETDECODEMSGSERVICE_SUCCESS
} from "../actions/ClientActions";
import { DAEMONSYNCED, WALLETREADY } from "../actions/DaemonActions";
import { NEWBLOCKCONNECTED } from "../actions/NotificationActions";
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
  VERIFYMESSAGE_CLEANSTORE,
  GETPEERINFO_SUCCESS,
  GETPEERINFO_FAILED
} from "../actions/ControlActions";
import { CLOSEWALLET_SUCCESS } from "actions/WalletLoaderActions";
import {
  GETACCOUNTMIXERSERVICE_SUCCESS,
  RUNACCOUNTMIXER_ATTEMPT,
  RUNACCOUNTMIXER_SUCCESS,
  RUNACCOUNTMIXER_FAILED,
  RUNACCOUNTMIXER_NOBALANCE,
  RUNACCOUNTMIXER_SUFFICIENTBALANCE,
  STOPMIXER_SUCCESS,
  CREATEMIXERACCOUNTS_ATTEMPT,
  CREATEMIXERACCOUNTS_FAILED,
  CREATEMIXERACCOUNTS_SUCCESS
} from "actions/AccountMixerActions";
import {
  GETTRANSACTIONS_ATTEMPT,
  GETTRANSACTIONS_FAILED,
  GETTRANSACTIONS_COMPLETE,
  GETTRANSACTIONS_CANCEL,
  CHANGE_TICKETS_FILTER,
  MATURINGHEIGHTS_CHANGED,
  GETSTARTUPTRANSACTIONS_SUCCESS,
  NEW_TRANSACTIONS_RECEIVED,
  CHANGE_TRANSACTIONS_FILTER
} from "actions/TransactionActions";
import { GETVSPTICKETSTATUS_SUCCESS } from "actions/VSPActions";
import { SETVSPDVOTECHOICE_FAILED } from "../actions/VSPActions";

export default function grpc(state = {}, action) {
  let newMaturingBlockHeights;
  switch (action.type) {
    case GETACCOUNTMIXERSERVICE_SUCCESS:
      return {
        ...state,
        accountMixerService: action.accountMixerService
      };
    case RUNACCOUNTMIXER_ATTEMPT:
      return {
        ...state,
        mixerStreamerError: null
      };
    case RUNACCOUNTMIXER_SUCCESS:
      return {
        ...state,
        accountMixerRunning: true,
        mixerStreamer: action.mixerStreamer,
        mixerStreamerError: null
      };
    case RUNACCOUNTMIXER_FAILED:
      return {
        ...state,
        accountMixerRunning: false,
        mixerStreamerError: action.error
      };
    case RUNACCOUNTMIXER_NOBALANCE:
      return {
        ...state,
        mixerStreamerError: action.error,
        isMixerDisabled: true
      };
    case RUNACCOUNTMIXER_SUFFICIENTBALANCE:
      return {
        ...state,
        mixerStreamerError: null,
        isMixerDisabled: false
      };
    case STOPMIXER_SUCCESS:
      return {
        ...state,
        accountMixerRunning: false,
        mixerStreamer: null
      };
    case GETVSPTICKETSTATUS_SUCCESS:
      return {
        ...state,
        stakeTransactions: action.stakeTransactions
      };
    case CREATEMIXERACCOUNTS_ATTEMPT:
      return {
        ...state,
        createMixerAccountAttempt: true
      };
    case CREATEMIXERACCOUNTS_FAILED:
      return {
        ...state,
        createMixerAccountAttempt: false
      };
    case CREATEMIXERACCOUNTS_SUCCESS:
      return {
        ...state,
        createMixerAccountAttempt: false
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
    case GETTRANSACTIONS_CANCEL:
      return {
        ...state,
        stakeTransactionsCancel: action.stakeTransactionsCancel,
        getTransactionsRequestAttempt: false
      };
    case CHANGE_TICKETS_FILTER:
      return {
        ...state,
        ticketsFilter: action.ticketsFilter,
        getTicketsRequestError: "",
        stakeTransactions: action.stakeTransactions,
        getStakeTxsAux: action.getStakeTxsAux
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
      return {
        ...state,
        stakeTransactions: action.stakeTransactions
          ? { ...state.stakeTransactions, ...action.stakeTransactions }
          : state.stakeTransactions,
        regularTransactions: action.regularTransactions
          ? { ...state.regularTransactions, ...action.regularTransactions }
          : state.regularTransactions,
        transactions: action.transactions
          ? { ...state.transactions, ...action.transactions }
          : state.transactions,
        getRegularTxsAux: action.getRegularTxsAux || state.getStakeTxsAux,
        getStakeTxsAux: action.getStakeTxsAux || state.getStakeTxsAux,
        getTransactionsRequestAttempt: false,
        noMoreLiveTickets: action.noMoreLiveTickets,
        startRequestHeight:
          action.startRequestHeight || state.startRequestHeight,
        normalizedRegularTransactions: action.normalizedRegularTransactions
          ? {
              ...state.normalizedRegularTransactions,
              ...action.normalizedRegularTransactions
            }
          : state.normalizedRegularTransactions
      };
    case ABANDONTRANSACTION_ATTEMPT:
      return { ...state, abandonTransactionRequestAttempt: true };
    case ABANDONTRANSACTION_FAILED:
      return { ...state, abandonTransactionRequestAttempt: false };
    case ABANDONTRANSACTION_SUCCESS:
      return {
        ...state,
        abandonTransactionRequestAttempt: false,
        recentRegularTransactions: action.recentRegularTransactions,
        regularTransactions: action.regularTransactions,
        normalizedRegularTransactions: action.normalizedRegularTransactions
      };
    case MIXERACCOUNTS_SPENDABLE_BALANCE:
      return {
        ...state,
        mixedAccountSpendableBalance:
          action.balances.mixedAccountSpendableBalance,
        changeAccountSpendableBalance:
          action.balances.changeAccountSpendableBalance
      };
    case NEW_TRANSACTIONS_RECEIVED:
      return {
        ...state,
        unminedTransactions: action.unminedTransactions,
        recentRegularTransactions: action.recentRegularTransactions,
        recentStakeTransactions: action.recentStakeTransactions,
        stakeTransactions: action.stakeTransactions,
        regularTransactions: action.regularTransactions,
        normalizedRegularTransactions: action.normalizedRegularTransactions
      };
    case CHANGE_TRANSACTIONS_FILTER:
      return {
        ...state,
        transactionsFilter: action.transactionsFilter,
        regularTransactions: action.regularTransactions,
        getRegularTxsAux: action.getRegularTxsAux,
        normalizedRegularTransactions: action.normalizedRegularTransactions
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
    case GETDECODEMSGSERVICE_ATTEMPT:
      return {
        ...state,
        getDecodeMessageServiceError: null,
        getDecodeMessageServiceAttempt: true
      };
    case GETDECODEMSGSERVICE_FAILED:
      return {
        ...state,
        getDecodeMessageServiceError: String(action.error),
        getDecodeMessageServiceAttempt: false
      };
    case GETDECODEMSGSERVICE_SUCCESS:
      return {
        ...state,
        getDecodeMessageServiceAttempt: false,
        decodeMessageService: action.decodeMessageService
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
        getVoteChoicesResponse: action.voteChoicesConfig
      };
    case SETVOTECHOICES_ATTEMPT:
      return {
        ...state,
        setVoteChoicesError: null,
        setVoteChoicesRequestAttempt: true
      };
    case SETVSPDVOTECHOICE_FAILED:
      return {
        ...state,
        setVoteChoicesRequestAttempt: false
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
    case GETTREASURY_POLICIES_ATTEMPT:
      return {
        ...state,
        getTreasuryPoliciesError: null,
        getTreasuryPoliciesRequestAttempt: true
      };
    case GETTREASURY_POLICIES_FAILED:
      return {
        ...state,
        getTreasuryPoliciesError: String(action.error),
        getTreasuryPoliciesRequestAttempt: false
      };
    case GETTREASURY_POLICIES_SUCCESS:
      return {
        ...state,
        getTreasuryPoliciesRequestAttempt: false,
        getTreasuryPoliciesResponse: action.treasuryPoliciesResponse,
        getTreasuryPoliciesError: null
      };
    case SETTREASURY_POLICY_ATTEMPT:
      return {
        ...state,
        setTreasuryPolicyError: null,
        setTreasuryPolicyRequestAttempt: true
      };
    case SETTREASURY_POLICY_FAILED:
      return {
        ...state,
        setTreasuryPolicyError: String(action.error),
        setTreasuryPolicyRequestAttempt: false
      };
    case SETTREASURY_POLICY_SUCCESS:
      return {
        ...state,
        setTreasuryPolicyRequestAttempt: false
      };
    case GETSTARTUPTRANSACTIONS_SUCCESS:
      return {
        ...state,
        maturingBlockHeights: action.maturingBlockHeights,
        recentRegularTransactions: action.recentRegularTxs,
        recentStakeTransactions: action.recentStakeTxs,
        stakeTransactions: action.stakeTransactions,
        regularTransactions: action.regularTransactions,
        normalizedRegularTransactions: action.normalizedRegularTransactions
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
        decodedTransactions: {},
        getAccountsResponse: null,
        getAgendasResponse: null,
        getNetworkResponse: null,
        getStakeInfoResponse: null,
        getTicketPriceResponse: null,
        lastTransaction: null,
        maturingBlockHeights: {},
        unminedTransactions: [],
        transactions: [],
        noMoreTransactions: false,
        transactionsFilter: {
          search: null,
          listDirection: "desc",
          types: [],
          directions: []
        },
        recentRegularTransactions: [],
        recentStakeTransactions: [],
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
    case GETPEERINFO_SUCCESS:
      return {
        ...state,
        peersCount: action.peersCount
      };
    case GETPEERINFO_FAILED:
      return {
        ...state,
        getPeerInfoError: action.error
      };
    default:
      return state;
  }
}
