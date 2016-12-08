import { GETBALANCE_ATTEMPT, GETBALANCE_FAILED, GETBALANCE_SUCCESS } from '../actions/ClientActions';

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
        getBalanceAccountNumber: '',
        getBalanceRequiredConfs: '',
      };
    default:
      return state;
  }
}