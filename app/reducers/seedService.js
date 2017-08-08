import { SEEDER_ATTEMPT, SEEDER_FAILED, SEEDER_SUCCESS } from "../actions/SeedServiceActions";
import { GENERATERANDOMSEED_ATTEMPT, GENERATERANDOMSEED_CLEAR, GENERATERANDOMSEED_FAILED, GENERATERANDOMSEED_SUCCESS } from "../actions/SeedServiceActions";
import { DECODESEED_ATTEMPT, DECODESEED_FAILED, DECODESEED_SUCCESS } from "../actions/SeedServiceActions";

export default function walletLoader(state = {}, action) {
  switch (action.type) {
  case SEEDER_ATTEMPT:
    return {...state,
      getSeederRequestAttempt: true,
    };
  case SEEDER_FAILED:
    return {...state,
      getSeederError: String(action.error),
      getSeederRequestAttempt: false,
      seeder: null,
    };
  case SEEDER_SUCCESS:
    return {...state,
      getSeederError: null,
      seeder: action.seeder,
      getSeederRequestAttempt: false,
    };
  case GENERATERANDOMSEED_ATTEMPT:
    return {...state,
      generateRandomSeedRequestAttempt: true,
    };
  case GENERATERANDOMSEED_CLEAR:
    return {...state,
      generateRandomSeedResponse: null,
    };
  case GENERATERANDOMSEED_FAILED:
    return {...state,
      generateRandomSeedError: String(action.error),
      generateRandomSeedRequestAttempt: false,
      generateRandomSeedResponse: null,
    };
  case GENERATERANDOMSEED_SUCCESS:
    return {...state,
      generateRandomSeedError: null,
      generateRandomSeedRequestAttempt: false,
      generateRandomSeedResponse: action.response,
    };
  case DECODESEED_ATTEMPT:
    return {...state,
      decodeSeedRequestAttempt: true,
    };
  case DECODESEED_FAILED:
    return {...state,
      decodeSeedError: String(action.error),
      decodeSeedRequestAttempt: false,
    };
  case DECODESEED_SUCCESS:
    return {...state,
      decodeSeedError: null,
      decodeSeedRequestAttempt: false,
      decodeSeedResponse: action.response,
    };
  default:
    return state;
  }
}
