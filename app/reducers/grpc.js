import { GETBALANCE_ATTEMPT, GETBALANCE_FAILED, GETBALANCE_SUCCESS } from '../actions/ClientActions';
import { GETACCOUNTNUMBER_ATTEMPT, GETACCOUNTNUMBER_FAILED, GETACCOUNTNUMBER_SUCCESS } from '../actions/ClientActions';
import { GETNETWORK_ATTEMPT, GETNETWORK_FAILED, GETNETWORK_SUCCESS } from '../actions/ClientActions';
import { GETPING_ATTEMPT, GETPING_FAILED, GETPING_SUCCESS } from '../actions/ClientActions';
import { GETSTAKEINFO_ATTEMPT, GETSTAKEINFO_FAILED, GETSTAKEINFO_SUCCESS } from '../actions/ClientActions';
import { GETTICKETPRICE_ATTEMPT, GETTICKETPRICE_FAILED, GETTICKETPRICE_SUCCESS } from '../actions/ClientActions';
import { GETACCOUNTS_ATTEMPT, GETACCOUNTS_FAILED, GETACCOUNTS_SUCCESS } from '../actions/ClientActions';
import { GETTRANSACTIONS_ATTEMPT, GETTRANSACTIONS_FAILED, GETTRANSACTIONS_SUCCESS } from '../actions/ClientActions';

export default function grpc(state = {}, action) {
  switch (action.type) {
    case GETBALANCE_ATTEMPT:
      return {...state,
        getBalanceError: '',
        getBalanceRequestAttempt: true,
        getBalanceAccountNumber: action.accountNumber,
        getBalanceRequiredConfs: action.requiredConfs,
      };
    case GETBALANCE_FAILED:
      return {...state,
        getBalanceError: action.error,
        getBalanceRequestAttempt: false,
        getBalanceAccountNumber: '',
        getBalanceRequiredConfs: '',
      };
    case GETBALANCE_SUCCESS:
      return {...state,
        getBalanceError: '',
        getBalanceRequestAttempt: false,
        getBalanceResponse: action.balanceResponse,
      };
    case GETACCOUNTNUMBER_ATTEMPT:
      return {...state,
        getAccountNumberError: '',
        getAccountNumberRequestAttempt: true,
      };
    case GETACCOUNTNUMBER_FAILED:
      return {...state,
        getAccountNumberError: action.error,
        getAccountNumberRequestAttempt: false,
      };
    case GETACCOUNTNUMBER_SUCCESS:
      return {...state,
        getAccountNumberError: '',
        getAccountNumberRequestAttempt: false,
        getAccountNumberResponse: action.balanceResponse,
      };
    case GETNETWORK_ATTEMPT:
      return {...state,
        getNetworkError: '',
        getNetworkRequestAttempt: true,
        getNetworkAccountNumber: action.accountNumber,
        getNetworkRequiredConfs: action.requiredConfs,
      };
    case GETNETWORK_FAILED:
      return {...state,
        getNetworkError: action.error,
        getNetworkRequestAttempt: false,
      };
    case GETNETWORK_SUCCESS:
      return {...state,
        getNetworkError: '',
        getNetworkRequestAttempt: false,
        getNetworkResponse: action.balanceResponse,
      };
    case GETPING_ATTEMPT:
      return {...state,
        getPingError: '',
        getPingRequestAttempt: true,
      };
    case GETPING_FAILED:
      return {...state,
        getPingError: action.error,
        getPingRequestAttempt: false,
      };
    case GETPING_SUCCESS:
      return {...state,
        getPingError: '',
        getPingRequestAttempt: false,
        getPingResponse: action.balanceResponse,
      };
    case GETSTAKEINFO_ATTEMPT:
      return {...state,
        getStakeInfoError: '',
        getStakeInfoRequestAttempt: true,
      };
    case GETSTAKEINFO_FAILED:
      return {...state,
        getStakeInfoError: action.error,
        getStakeInfoRequestAttempt: false,
      };
    case GETSTAKEINFO_SUCCESS:
      return {...state,
        getStakeInfoError: '',
        getStakeInfoRequestAttempt: false,
        getStakeInfoResponse: action.balanceResponse,
      };
    case GETTICKETPRICE_ATTEMPT:
      return {...state,
        getTicketPriceError: '',
        getTicketPriceRequestAttempt: true,
      };
    case GETTICKETPRICE_FAILED:
      return {...state,
        getTicketPriceError: action.error,
        getTicketPriceRequestAttempt: false,
      };
    case GETTICKETPRICE_SUCCESS:
      return {...state,
        getTicketPriceError: '',
        getTicketPriceRequestAttempt: false,
        getTicketPriceResponse: action.balanceResponse,
      };
    case GETACCOUNTS_ATTEMPT:
      return {...state,
        getAccountsError: '',
        getAccountsRequestAttempt: true,
      };
    case GETACCOUNTS_FAILED:
      return {...state,
        getAccountsError: action.error,
        getAccountsRequestAttempt: false,
      };
    case GETACCOUNTS_SUCCESS:
      return {...state,
        getAccountsError: '',
        getAccountsRequestAttempt: false,
        getAccountsResponse: action.balanceResponse,
      };
    case GETTRANSACTIONS_ATTEMPT:
      return {...state,
        getTransactionsError: '',
        getTransactionsRequestAttempt: true,
      };
    case GETTRANSACTIONS_FAILED:
      return {...state,
        getTransactionsError: action.error,
        getTransactionsRequestAttempt: false,
      };
    case GETTRANSACTIONS_SUCCESS:
      return {...state,
        getTransactionsError: '',
        getTransactionsRequestAttempt: false,
        getTransactionsResponse: action.balanceResponse,
      };             
    default:
      return state;
  }
}