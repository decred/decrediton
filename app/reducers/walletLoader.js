import { CREATEWALLET_ATTEMPT, CREATEWALLET_FAILED, CREATEWALLET_SUCCESS } from '../actions/WalletLoaderActions';

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