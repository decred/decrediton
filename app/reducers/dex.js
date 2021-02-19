import {
  DEXC_ENABLE_ATTEMPT,
  DEXC_ENABLE_FAILED,
  DEXC_ENABLE_SUCCESS,
  DEXC_STARTUP_ATTEMPT,
  DEXC_STARTUP_FAILED,
  DEXC_STARTUP_SUCCESS,
  DEXC_INIT_ATTEMPT,
  DEXC_INIT_SUCCESS,
  DEXC_INIT_FAILED,
  DEXC_LOGIN_ATTEMPT,
  DEXC_LOGIN_SUCCESS,
  DEXC_LOGIN_FAILED,
  DEXC_REGISTER_ATTEMPT,
  DEXC_REGISTER_SUCCESS,
  DEXC_REGISTER_FAILED,
  DEXC_LAUNCH_WINDOW_ATTEMPT,
  DEXC_LAUNCH_WINDOW_SUCCESS,
  DEXC_LAUNCH_WINDOW_FAILED,
  DEXC_CHECKINIT_ATTEMPT,
  DEXC_CHECKINIT_FAILED,
  DEXC_CHECKINIT_SUCCESS,
  DEXC_USER_ATTEMPT,
  DEXC_USER_FAILED,
  DEXC_USER_SUCCESS,
  DEXC_CREATEWALLET_ATTEMPT,
  DEXC_CREATEWALLET_FAILED,
  DEXC_CREATEWALLET_SUCCESS,
  DEXC_GETFEE_ATTEMPT,
  DEXC_GETFEE_FAILED,
  DEXC_GETFEE_SUCCESS,
  CREATEDEXACCOUNT_ATTEMPT,
  CREATEDEXACCOUNT_FAILED,
  CREATEDEXACCOUNT_SUCCESS,
  DEXC_LOGOUT_ATTEMPT,
  DEXC_LOGOUT_SUCCESS,
  DEXC_LOGOUT_FAILED,
  CHECK_BTC_CONFIG_ATTEMPT,
  CHECK_BTC_CONFIG_FAILED,
  CHECK_BTC_CONFIG_SUCCESS,
  CHECK_BTC_CONFIG_SUCCESS_UPDATE_NEEDED,
  UPDATE_BTC_CONFIG_ATTEMPT,
  UPDATE_BTC_CONFIG_FAILED,
  UPDATE_BTC_CONFIG_SUCCESS,
  CHECK_BTC_CONFIG_SUCCESS_NEED_INSTALL
} from "../actions/DexActions";

export default function ln(state = {}, action) {
  switch (action.type) {
    case DEXC_ENABLE_ATTEMPT:
      return {
        ...state,
        enableDexAttempt: true,
        enabledDex: false,
        enabledError: null
      };
    case DEXC_ENABLE_FAILED:
      return {
        ...state,
        enableDexAttempt: false,
        enabledDex: false,
        enabledError: action.error
      };
    case DEXC_ENABLE_SUCCESS:
      return {
        ...state,
        enableDexAttempt: false,
        enabledDex: true,
        enabledError: null
      };
    case DEXC_STARTUP_ATTEMPT:
      return {
        ...state,
        startAttempt: true,
        active: false,
        client: null
      };
    case DEXC_STARTUP_FAILED:
      return {
        ...state,
        startAttempt: false,
        startupStage: null
      };
    case DEXC_STARTUP_SUCCESS:
      return {
        ...state,
        startAttempt: false,
        exists: true,
        active: true,
        startupStage: null,
        dexServerAddress: action.serverAddress
      };
    case DEXC_LOGIN_ATTEMPT:
      return {
        ...state,
        loginAttempt: true,
        loggedIn: false,
        loginError: null
      };
    case DEXC_LOGIN_FAILED:
      return {
        ...state,
        loginAttempt: false,
        loggedIn: false,
        loginError: action.error
      };
    case DEXC_LOGIN_SUCCESS:
      return {
        ...state,
        loginAttempt: false,
        loggedIn: true,
        loginError: null
      };
    case DEXC_REGISTER_ATTEMPT:
      return {
        ...state,
        registerAttempt: true,
        registered: false,
        registerError: null
      };
    case DEXC_REGISTER_FAILED:
      return {
        ...state,
        registerAttempt: false,
        registered: false,
        registerError: action.error
      };
    case DEXC_REGISTER_SUCCESS:
      return {
        ...state,
        registerAttempt: false,
        registered: true,
        registerError: null
      };
    case DEXC_CREATEWALLET_ATTEMPT:
      return {
        ...state,
        createWalletAttempt: true,
        createWalletError: null
      };
    case DEXC_CREATEWALLET_FAILED:
      return {
        ...state,
        createWalletAttempt: false,
        createWalletError: action.error
      };
    case DEXC_CREATEWALLET_SUCCESS:
      return {
        ...state,
        createWalletAttempt: false,
        createWalletError: null
      };
    case DEXC_USER_ATTEMPT:
      return {
        ...state,
        userAttempt: true,
        user: null,
        userError: null
      };
    case DEXC_USER_FAILED:
      return {
        ...state,
        userAttempt: false,
        userError: action.error
      };
    case DEXC_USER_SUCCESS:
      return {
        ...state,
        userAttempt: false,
        user: action.user,
        userError: null
      };
    case DEXC_INIT_ATTEMPT:
      return {
        ...state,
        initAttempt: true,
        registerError: null
      };
    case DEXC_INIT_FAILED:
      return {
        ...state,
        initAttempt: false,
        initError: action.error
      };
    case DEXC_INIT_SUCCESS:
      return {
        ...state,
        initAttempt: false,
        dexcInit: true,
        loggedIn: true,
        registerError: null
      };
    case DEXC_LAUNCH_WINDOW_ATTEMPT:
      return {
        ...state,
        launchWindowAttempt: true,
        launchWindow: false,
        launchWindowError: null
      };
    case DEXC_LAUNCH_WINDOW_FAILED:
      return {
        ...state,
        launchWindowAttempt: false,
        launchWindow: false,
        launchWindowError: action.error
      };
    case DEXC_LAUNCH_WINDOW_SUCCESS:
      return {
        ...state,
        launchWindowAttempt: false,
        launchWindow: true,
        launchWindowError: null
      };
    case DEXC_CHECKINIT_ATTEMPT:
      return {
        ...state,
        dexcCheckInitAttempt: true,
        dexcInitError: null
      };
    case DEXC_CHECKINIT_FAILED:
      return {
        ...state,
        dexcCheckInitAttempt: false,
        dexcInit: false,
        dexcInitError: action.error
      };
    case DEXC_CHECKINIT_SUCCESS:
      return {
        ...state,
        dexcCheckInitAttempt: false,
        dexcInit: action.res,
        dexcInitError: null
      };
    case DEXC_GETFEE_ATTEMPT:
      return {
        ...state,
        getFeeAttempt: true,
        fee: null,
        addr: null,
        getFeeError: null
      };
    case DEXC_GETFEE_FAILED:
      return {
        ...state,
        getFeeAttempt: false,
        fee: null,
        addr: null,
        getFeeError: action.error
      };
    case DEXC_GETFEE_SUCCESS:
      return {
        ...state,
        getFeeAttempt: false,
        fee: action.fee,
        addr: action.addr,
        getFeeError: null
      };
    case CREATEDEXACCOUNT_ATTEMPT:
      return {
        ...state,
        dexAccountAttempt: true,
        dexAccountError: null,
        dexAccount: null
      };
    case CREATEDEXACCOUNT_FAILED:
      return {
        ...state,
        dexAccountAttempt: false,
        dexAccountError: action.error
      };
    case CREATEDEXACCOUNT_SUCCESS:
      return {
        ...state,
        dexAccountAttempt: false,
        dexAccountError: null,
        dexAccount: action.dexAccount
      };
    case DEXC_LOGOUT_ATTEMPT:
      return {
        ...state,
        logoutAttempt: true,
        logoutError: null
      };
    case DEXC_LOGOUT_SUCCESS:
      return {
        ...state,
        logoutAttempt: false,
        loggedIn: false,
        logoutError: null
      };
    case DEXC_LOGOUT_FAILED:
      return {
        ...state,
        logoutAttempt: false,
        openOrder: action.openOrder,
        logoutError: action.error
      };
    case CHECK_BTC_CONFIG_ATTEMPT:
      return {
        ...state,
        checkBtcConfigAttempt: true,
        checkBtcConfigError: null
      };
    case CHECK_BTC_CONFIG_FAILED:
      return {
        ...state,
        checkBtcConfigAttempt: false,
        checkBtcConfigError: action.error
      };
    case CHECK_BTC_CONFIG_SUCCESS:
      return {
        ...state,
        checkBtcConfigAttempt: false,
        btcConfig: action.btcConfig
      };
    case CHECK_BTC_CONFIG_SUCCESS_UPDATE_NEEDED:
      return {
        ...state,
        checkBtcConfigAttempt: false,
        btcConfigUpdateNeeded: true
      };
    case CHECK_BTC_CONFIG_SUCCESS_NEED_INSTALL:
      return {
        ...state,
        checkBtcConfigAttempt: false,
        btcIntallNeeded: true
      };
    case UPDATE_BTC_CONFIG_ATTEMPT:
      return {
        ...state,
        updateBtcConfigAttempt: true,
        updateBtcConfigError: null
      };
    case UPDATE_BTC_CONFIG_FAILED:
      return {
        ...state,
        updateBtcConfigAttempt: false,
        updateBtcConfigError: action.error
      };
    case UPDATE_BTC_CONFIG_SUCCESS:
      return {
        ...state,
        updateBtcConfigAttempt: false,
        updateBtcConfigError: null,
        btcConfig: action.btcConfig
      };
    default:
      return state;
  }
}
