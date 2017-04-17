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
  GETTRANSACTIONS_UNMINED_PROGRESS,
  GETTRANSACTIONS_PROGRESS_REGULAR, GETTRANSACTIONS_PROGRESS_TICKET,
  GETTRANSACTIONS_PROGRESS_VOTE, GETTRANSACTIONS_PROGRESS_REVOKE,
  PAGINATETRANSACTIONS,
  GETTRANSACTIONDETAILS_SET, GETTRANSACTIONDETAILS_CLEAR,
  UPDATETIMESINCEBLOCK,

  GETAGENDASERVICE_ATTEMPT, GETAGENDASERVICE_FAILED, GETAGENDASERVICE_SUCCESS,
  GETVOTINGSERVICE_ATTEMPT, GETVOTINGSERVICE_FAILED, GETVOTINGSERVICE_SUCCESS,
  GETAGENDAS_ATTEMPT, GETAGENDAS_FAILED, GETAGENDAS_SUCCESS,
  GETVOTECHOICES_ATTEMPT, GETVOTECHOICES_FAILED, GETVOTECHOICES_SUCCESS,
  SETVOTECHOICES_ATTEMPT, SETVOTECHOICES_FAILED, SETVOTECHOICES_SUCCESS,
} from '../actions/ClientActions';

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
      getWalletServiceError: action.error,
      getWalletServiceRequestAttempt: false,
    };
  case GETWALLETSERVICE_SUCCESS:
    return {
      ...state,
      getBalanceError: null,
      getWalletServiceRequestAttempt: false,
      walletService: action.walletService,
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
      getTicketBuyerServiceError: action.error,
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
      getBalanceRequest: action.request,
    };
  case GETBALANCE_FAILED:
    return {
      ...state,
      getBalanceError: action.error,
      getBalanceRequestAttempt: false,
      getBalanceRequest: null,
    };
  case GETBALANCE_SUCCESS:
    return {
      ...state,
      getBalanceError: '',
      getBalanceRequestAttempt: false,
      getBalanceResponse: action.getBalanceResponse,
    };
  case GETACCOUNTNUMBER_ATTEMPT:
    return {
      ...state,
      getAccountNumberError: '',
      getAccountNumberRequestAttempt: true,
      getAccountNumberRequest: action.request,
    };
  case GETACCOUNTNUMBER_FAILED:
    return {
      ...state,
      getAccountNumberError: action.error,
      getAccountNumberRequestAttempt: false,
    };
  case GETACCOUNTNUMBER_SUCCESS:
    return {
      ...state,
      getAccountNumberError: '',
      getAccountNumberRequestAttempt: false,
      getAccountNumberResponse: action.getAccountNumberResponse,
    };
  case GETNETWORK_ATTEMPT:
    return {
      ...state,
      getNetworkError: null,
      getNetworkRequestAttempt: true,
      getNetworkRequest: action.request,
    };
  case GETNETWORK_FAILED:
    return {
      ...state,
      getNetworkError: action.error,
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
      getPingError: '',
      getPingRequestAttempt: true,
      getPingRequest: action.request,
    };
  case GETPING_FAILED:
    return {
      ...state,
      getPingError: action.error,
      getPingRequestAttempt: false,
    };
  case GETPING_SUCCESS:
    return {
      ...state,
      getPingError: '',
      getPingRequestAttempt: false,
      getPingResponse: action.getPingResponse,
    };
  case GETSTAKEINFO_ATTEMPT:
    return {
      ...state,
      getStakeInfoError: '',
      getStakeInfoRequestAttempt: true,
      getStakeInfoRequest: action.request,
    };
  case GETSTAKEINFO_FAILED:
    return {
      ...state,
      getStakeInfoError: action.error,
      getStakeInfoRequestAttempt: false,
    };
  case GETSTAKEINFO_SUCCESS:
    return {
      ...state,
      getStakeInfoError: '',
      getStakeInfoRequestAttempt: false,
      getStakeInfoResponse: action.getStakeInfoResponse,
    };
  case GETTICKETPRICE_ATTEMPT:
    return {
      ...state,
      getTicketPriceError: '',
      getTicketPriceRequestAttempt: true,
      getTicketPriceRequest: action.request,
    };
  case GETTICKETPRICE_FAILED:
    return {
      ...state,
      getTicketPriceError: action.error,
      getTicketPriceRequestAttempt: false,
    };
  case GETTICKETPRICE_SUCCESS:
    return {
      ...state,
      getTicketPriceError: '',
      getTicketPriceRequestAttempt: false,
      getTicketPriceResponse: action.getTicketPriceResponse,
    };
  case GETACCOUNTS_ATTEMPT:
    return {
      ...state,
      getAccountsError: '',
      getAccountsRequestAttempt: true,
      getAccountsRequest: action.request,
    };
  case GETACCOUNTS_FAILED:
    return {
      ...state,
      getAccountsError: action.error,
      getAccountsRequestAttempt: false,
    };
  case GETACCOUNTS_SUCCESS:
    return {
      ...state,
      getAccountsError: '',
      getAccountsRequestAttempt: false,
      getAccountsResponse: action.response,
    };
  case PAGINATETRANSACTIONS:
    return {
      ...state,
      paginatedTxs: action.paginatedTxs,
      currentPage: action.currentPage,
    };
  case GETTRANSACTIONS_ATTEMPT:
    return {
      ...state,
      regularTransactionsInfo: Array(),
      ticketTransactionsInfo: Array(),
      voteTransactionsInfo: Array(),
      revokeTransactionsInfo: Array(),
      getTransactionsRequestAttempt: true,
    };
  case GETTRANSACTIONS_FAILED:
    return {
      ...state,
      getTransactionsRequestError: action.error,
      getTransactionsRequestAttempt: false,
    };
  case GETTRANSACTIONS_COMPLETE:
    return {
      ...state,
      getTransactionsRequestError: '',
      getTransactionsRequestAttempt: false,
    };
  case GETTRANSACTIONS_PROGRESS_REGULAR:
    return {
      ...state,
      regularTransactionsInfo: action.regularTransactionsInfo,
    };
  case GETTRANSACTIONS_PROGRESS_TICKET:
    return {
      ...state,
      ticketTransactionsInfo: action.ticketTransactionsInfo,
    };
  case GETTRANSACTIONS_PROGRESS_VOTE:
    return {
      ...state,
      voteTransactionsInfo: action.voteTransactionsInfo,
    };
  case GETTRANSACTIONS_PROGRESS_REVOKE:
    return {
      ...state,
      revokeTransactionsInfo: action.revokeTransactionsInfo,
    };
  case GETTRANSACTIONS_UNMINED_PROGRESS:
    return {
      ...state,
      unminedTransactions: action.unmined,
    };
  case GETTRANSACTIONDETAILS_SET:
    return {
      ...state,
      transactionDetails: action.tx,
    };
  case GETTRANSACTIONDETAILS_CLEAR:
    return {
      ...state,
      transactionDetails: null,
    };
  case UPDATETIMESINCEBLOCK:
    return {
      ...state,
      timeSinceString: action.timeSinceString,
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
      getAgendaServiceError: action.error,
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
      getVotingServiceError: action.error,
      getVotingServiceRequestAttempt: false,
    };
  case GETVOTINGSERVICE_SUCCESS:
    return {
      ...state,
      getVotingServiceRequestAttempt: false,
      votingService: action.votingService,
    };
  case GETAGENDAS_ATTEMPT:
    return {
      ...state,
      getAgendasRequest: action.request,
      getAgendasError: null,
      getAgendasRequestAttempt: true,
    };
  case GETAGENDAS_FAILED:
    return {
      ...state,
      getAgendasRequest: null,
      getAgendasError: action.error,
      getAgendasRequestAttempt: false,
    };
  case GETAGENDAS_SUCCESS:
    return {
      ...state,
      getAgendasRequest: null,
      getAgendasRequestAttempt: false,
      getAgendasResponse: action.agendas,
    };
  case GETVOTECHOICES_ATTEMPT:
    return {
      ...state,
      getVoteChoicesRequest: action.request,
      getVoteChoicesError: null,
      getVoteChoicesRequestAttempt: true,
    };
  case GETVOTECHOICES_FAILED:
    return {
      ...state,
      getVoteChoicesRequest: null,
      getVoteChoicesError: action.error,
      getVoteChoicesRequestAttempt: false,
    };
  case GETVOTECHOICES_SUCCESS:
    return {
      ...state,
      getVoteChoicesRequest: null,
      getVoteChoicesRequestAttempt: false,
      getVoteChoicesResponse: action.voteChoices,
    };
  case SETVOTECHOICES_ATTEMPT:
    return {
      ...state,
      setVoteChoicesRequest: action.setVoteChoicesRequest,
      setVoteChoicesError: null,
      setVoteChoicesRequestAttempt: true,
    };
  case SETVOTECHOICES_FAILED:
    return {
      ...state,
      setVoteChoicesRequest: null,
      setVoteChoicesError: action.error,
      setVoteChoicesRequestAttempt: false,
    };
  case SETVOTECHOICES_SUCCESS:
    return {
      ...state,
      setVoteChoicesRequest: null,
      setVoteChoicesRequestAttempt: false,
      setVoteChoicesResponse: action.voteChoices,
    };
  default:
    return state;
  }
}
