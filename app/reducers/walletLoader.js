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
        isWalletExist: false,
      };
    case WALLETEXIST_FAILED:
      return {...state,
        error: action.error,
        isWalletExistRequest: false,
        isWalletExist: false,
      };
    case WALLETEXIST_SUCCESS:
      return {...state,
        error: '',
        isWalletExistRequest: false,
        isWalletExist: true,
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
        isOpenWalletRequest: true,
        isOpenWalletComplete: false,
        pubPass: action.pubPass,
      };
    case OPENWALLET_FAILED:
      return {...state,
        error: action.error,
        isOpenWalletRequest: false,
        isOpenWalletComplete: false,
      };
    case OPENWALLET_SUCCESS:
      return {...state,
        error: '',
        isOpenWalletRequest: false,
        isOpenWalletComplete: true,
      };   
    default:
      return state;
  }
}