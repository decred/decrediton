import { GETBALANCE_ATTEMPT, GETBALANCE_FAILED, GETBALANCE_SUCCESS } from '../actions/ClientActions';
import { CREATEWALLET_ATTEMPT, CREATEWALLET_FAILED, CREATEWALLET_SUCCESS } from '../actions/ClientActions';

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
    case GETBALANCE_SUCCESS:
      return {...state,
        error: '',
        balance: action.balance,
        isGettingBalance: false,
        isGotBalance: true,
      };
    case CREATEWALLET_ATTEMPT:
      return {...state,
        isCreatingWallet: true,
        isCreatedWallet: false,
        privPass: action.privPass,
        pubPass: action.pubPass,
        seed: action.seed,
      };
    case CREATEWALLET_FAILED:
      return {...state,
        error: action.error,
        isCreatingWallet: false,
        isCreatedWallet: false,
        privPass: '',
        pubPass: '',
        seed: '',
      };
    case CREATEWALLET_SUCCESS:
      return {...state,
        error: '',
        isCreatingWallet: false,
        isCreatedWallet: true,
      };  
    default:
      return state;
  }
}