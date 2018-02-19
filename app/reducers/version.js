import {
  GETVERSIONSERVICE_ATTEMPT, GETVERSIONSERVICE_FAILED, GETVERSIONSERVICE_SUCCESS,
  WALLETRPCVERSION_ATTEMPT, WALLETRPCVERSION_FAILED, WALLETRPCVERSION_SUCCESS,
  VERSION_NOT_VALID
} from "../actions/VersionActions";

export default function version(state = {}, action) {
  switch (action.type) {
  case GETVERSIONSERVICE_ATTEMPT:
    return { ...state,
      getVersionServiceError: null,
      getVersionServiceRequestAttempt: true,
    };
  case GETVERSIONSERVICE_FAILED:
    return { ...state,
      getVersionServiceError: String(action.error),
      getVersionServiceRequestAttempt: false,
    };
  case GETVERSIONSERVICE_SUCCESS:
    return { ...state,
      getWalletRPCVersionError: null,
      getVersionServiceRequestAttempt: false,
      versionService: action.versionService,
    };
  case WALLETRPCVERSION_ATTEMPT:
    return { ...state,
      getWalletRPCVersionError: null,
      getWalletRPCVersionRequestAttempt: true,
    };
  case WALLETRPCVERSION_FAILED:
    return { ...state,
      getWalletRPCVersionError: String(action.error),
      getWalletRPCVersionRequestAttempt: false,
    };
  case WALLETRPCVERSION_SUCCESS:
    return { ...state,
      getWalletRPCVersionError: "",
      getWalletRPCVersionRequestAttempt: false,
      getWalletRPCVersionResponse: action.getWalletRPCVersionResponse,
    };
  case VERSION_NOT_VALID:
    return { ...state,
      versionInvalid: true,
      versionInvalidError: String(action.error)
    };
  default:
    return state;
  }
}
