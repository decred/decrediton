import {
  DEX_ENABLE_ATTEMPT,
  DEX_ENABLE_FAILED,
  DEX_ENABLE_SUCCESS,
  DEX_STARTUP_ATTEMPT,
  DEX_STARTUP_FAILED,
  DEX_STARTUP_SUCCESS,
  DEX_INIT_ATTEMPT,
  DEX_INIT_SUCCESS,
  DEX_INIT_FAILED,
  DEX_LOGIN_ATTEMPT,
  DEX_LOGIN_SUCCESS,
  DEX_LOGIN_FAILED,
  DEX_REGISTER_ATTEMPT,
  DEX_REGISTER_SUCCESS,
  DEX_REGISTER_FAILED,
  DEX_LAUNCH_WINDOW_ATTEMPT,
  DEX_LAUNCH_WINDOW_SUCCESS,
  DEX_LAUNCH_WINDOW_FAILED,
  DEX_CHECKINIT_ATTEMPT,
  DEX_CHECKINIT_FAILED,
  DEX_CHECKINIT_SUCCESS,
  DEX_USER_ATTEMPT,
  DEX_USER_FAILED,
  DEX_USER_SUCCESS,
  DEX_CREATEWALLET_ATTEMPT,
  DEX_CREATEWALLET_FAILED,
  DEX_CREATEWALLET_SUCCESS,
  DEX_GETFEE_ATTEMPT,
  DEX_GETFEE_FAILED,
  DEX_GETFEE_SUCCESS,
  CREATEDEXACCOUNT_ATTEMPT,
  CREATEDEXACCOUNT_FAILED,
  CREATEDEXACCOUNT_SUCCESS,
  DEX_LOGOUT_ATTEMPT,
  DEX_LOGOUT_SUCCESS,
  DEX_LOGOUT_FAILED,
  CHECK_BTC_CONFIG_ATTEMPT,
  CHECK_BTC_CONFIG_FAILED,
  CHECK_BTC_CONFIG_SUCCESS,
  CHECK_BTC_CONFIG_SUCCESS_UPDATE_NEEDED,
  CHECK_BTC_CONFIG_SUCCESS_NEED_INSTALL,
  UPDATE_BTC_CONFIG_ATTEMPT,
  UPDATE_BTC_CONFIG_FAILED,
  UPDATE_BTC_CONFIG_SUCCESS
} from "../actions/DexActions";

export default function ln(state = {}, action) {
  switch (action.type) {
    case DEX_ENABLE_ATTEMPT:
      return {
        ...state,
        enableDexAttempt: true,
        enabledDex: false,
        enabledError: null
      };
    case DEX_ENABLE_FAILED:
      return {
        ...state,
        enableDexAttempt: false,
        enabledDex: false,
        enabledError: action.error
      };
    case DEX_ENABLE_SUCCESS:
      return {
        ...state,
        enableDexAttempt: false,
        enabledDex: true,
        enabledError: null
      };
    case DEX_STARTUP_ATTEMPT:
      return {
        ...state,
        startAttempt: true,
        active: false,
        client: null
      };
    case DEX_STARTUP_FAILED:
      return {
        ...state,
        startAttempt: false
      };
    case DEX_STARTUP_SUCCESS:
      return {
        ...state,
        startAttempt: false,
        exists: true,
        active: true,
        dexServerAddress: action.serverAddress
      };
    case DEX_LOGIN_ATTEMPT:
      return {
        ...state,
        loginAttempt: true,
        loggedIn: false,
        loginError: null
      };
    case DEX_LOGIN_FAILED:
      return {
        ...state,
        loginAttempt: false,
        loggedIn: false,
        loginError: action.error
      };
    case DEX_LOGIN_SUCCESS:
      return {
        ...state,
        loginAttempt: false,
        loggedIn: true,
        loginError: null
      };
    case DEX_REGISTER_ATTEMPT:
      return {
        ...state,
        registerAttempt: true,
        registered: false,
        registerError: null
      };
    case DEX_REGISTER_FAILED:
      return {
        ...state,
        registerAttempt: false,
        registered: false,
        registerError: action.error
      };
    case DEX_REGISTER_SUCCESS:
      return {
        ...state,
        registerAttempt: false,
        registered: true,
        registerError: null
      };
    case DEX_CREATEWALLET_ATTEMPT:
      return {
        ...state,
        createWalletAttempt: true,
        createWalletError: null
      };
    case DEX_CREATEWALLET_FAILED:
      return {
        ...state,
        createWalletAttempt: false,
        createWalletError: action.error
      };
    case DEX_CREATEWALLET_SUCCESS:
      return {
        ...state,
        createWalletAttempt: false,
        createWalletError: null
      };
    case DEX_USER_ATTEMPT:
      return {
        ...state,
        userAttempt: true,
        user: null,
        userError: null
      };
    case DEX_USER_FAILED:
      return {
        ...state,
        userAttempt: false,
        userError: action.error
      };
    case DEX_USER_SUCCESS:
      return {
        ...state,
        userAttempt: false,
        user: action.user,
        userError: null
      };
    case DEX_INIT_ATTEMPT:
      return {
        ...state,
        initAttempt: true,
        registerError: null
      };
    case DEX_INIT_FAILED:
      return {
        ...state,
        initAttempt: false,
        initError: action.error
      };
    case DEX_INIT_SUCCESS:
      return {
        ...state,
        initAttempt: false,
        dexInit: true,
        loggedIn: true,
        registerError: null
      };
    case DEX_LAUNCH_WINDOW_ATTEMPT:
      return {
        ...state,
        launchWindowAttempt: true,
        launchWindow: false,
        launchWindowError: null
      };
    case DEX_LAUNCH_WINDOW_FAILED:
      return {
        ...state,
        launchWindowAttempt: false,
        launchWindow: false,
        launchWindowError: action.error
      };
    case DEX_LAUNCH_WINDOW_SUCCESS:
      return {
        ...state,
        launchWindowAttempt: false,
        launchWindow: true,
        launchWindowError: null
      };
    case DEX_CHECKINIT_ATTEMPT:
      return {
        ...state,
        dexCheckInitAttempt: true,
        dexInitError: null
      };
    case DEX_CHECKINIT_FAILED:
      return {
        ...state,
        dexCheckInitAttempt: false,
        dexInit: false,
        dexInitError: action.error
      };
    case DEX_CHECKINIT_SUCCESS:
      return {
        ...state,
        dexCheckInitAttempt: false,
        dexInit: action.res,
        dexInitError: null
      };
    case DEX_GETFEE_ATTEMPT:
      return {
        ...state,
        getFeeAttempt: true,
        fee: null,
        addr: null,
        getFeeError: null
      };
    case DEX_GETFEE_FAILED:
      return {
        ...state,
        getFeeAttempt: false,
        fee: null,
        addr: null,
        getFeeError: action.error
      };
    case DEX_GETFEE_SUCCESS:
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
    case DEX_LOGOUT_ATTEMPT:
      return {
        ...state,
        logoutAttempt: true,
        logoutError: null,
        openOrder: false
      };
    case DEX_LOGOUT_SUCCESS:
      return {
        ...state,
        logoutAttempt: false,
        loggedIn: false,
        logoutError: null,
        openOrder: false
      };
    case DEX_LOGOUT_FAILED:
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
        checkBtcConfigError: null,
        btcConfigUpdateNeeded: false,
        btcInstallNeeded: false
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
        btcInstallNeeded: true
      };
    case UPDATE_BTC_CONFIG_ATTEMPT:
      return {
        ...state,
        updateBtcConfigAttempt: true,
        updateBtcConfigError: null,
        btcConfig: null
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
