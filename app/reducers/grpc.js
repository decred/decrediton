import { GETBALANCE_ATTEMPT, GETBALANCE_FAILED, GETBALANCE_SUCCESSFUL } from '../actions/ClientActions';

export default function grpc(state = {}, action) {
  switch (action.type) {
    case GETBALANCE_ATTEMPT:
      return {...state,
        isGettingBalance: true,
        isGotBalance: false,
        balanceAccountNumber: action.accountNumber,
        balanceRequiredConfs: action.requiredConfs,
      };
    case GETBALANCE_FAILED:
      return {...state,
        error: action.error,
        isGettingBalance: false,
        isGotBalance: false,
        balanceAccountNumber: '',
        balanceRequiredConfs: '',
      };
    case GETBALANCE_SUCCESSFUL:
      return {...state,
        error: '',
        balance: action.balance,
        isGettingBalance: false,
        isGotBalance: true,
      };
    default:
      return state;
  }
}