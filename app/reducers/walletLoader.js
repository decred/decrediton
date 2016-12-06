import { CREATEWALLET_ATTEMPT, CREATEWALLET_FAILED, CREATEWALLET_SUCCESS } from '../actions/WalletLoaderActions';
import { LOADER_ATTEMPT, LOADER_FAILED, LOADER_SUCCESS } from '../actions/WalletLoaderActions';
import { WALLETEXIST_ATTEMPT, WALLETEXIST_FAILED, WALLETEXIST_SUCCESS } from '../actions/WalletLoaderActions';
import { OPENWALLET_ATTEMPT, OPENWALLET_FAILED, OPENWALLET_SUCCESS } from '../actions/WalletLoaderActions';

export default function walletLoader(state = {}, action) {
  switch (action.type) {
    case LOADER_ATTEMPT:
      return {...state,
        isGettingLoader: true,
        isLoaderReady: false,
        address: action.address,
        port: action.port,
      };
    case LOADER_FAILED:
      return {...state,
        error: action.error,
        isGettingLoader: false,
        isLoaderReady: false,
        address: '',
        port: '',
      };
    case LOADER_SUCCESS:
      return {...state,
        error: "",
        loader: action.loader,
        isGettingLoader: false,
        isLoaderReady: true,
      };
    case WALLETEXIST_ATTEMPT:
      return {...state,
        isWalletExistRequest: true,
        isWalletExistComplete: false,
        isWalletExist: false,
      };
    case WALLETEXIST_FAILED:
      return {...state,
        error: action.error,
        isWalletExistRequest: false,
        isWalletExistComplete: false,
        isWalletExist: false,
      };
    case WALLETEXIST_SUCCESS:
      return {...state,
        error: '',
        isWalletExistRequest: false,
        isWalletExistComplete: true,
        isWalletExist: action.exists,
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
    case OPENWALLET_ATTEMPT:
      return {...state,
        isWalletOpenRequest: true,
        isWalletOpen: false,
        pubPass: action.pubPass,
      };
    case OPENWALLET_FAILED:
      return {...state,
        error: action.error,
        isWalletOpenRequest: false,
        isWalletOpen: false,
      };
    case OPENWALLET_SUCCESS:
      return {...state,
        error: '',
        isWalletOpenRequest: false,
        isWalletOpen: true,
      };   
    default:
      return state;
  }
}