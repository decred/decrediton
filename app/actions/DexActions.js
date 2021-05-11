import * as sel from "selectors";
import * as dex from "wallet/dex";
import * as wallet from "wallet";
import { addAllowedExternalRequest } from "./SettingsActions";
import { getNextAccountAttempt } from "./ControlActions";
import { closeWalletRequest } from "./WalletLoaderActions";
import { EXTERNALREQUEST_DEX } from "main_dev/externalRequests";
import * as configConstants from "constants/config";
import { makeRandomString } from "helpers";

export const DEX_ENABLE_ATTEMPT = "DEX_ENABLE_ATTEMPT";
export const DEX_ENABLE_FAILED = "DEX_ENABLE_FAILED";
export const DEX_ENABLE_SUCCESS = "DEX_ENABLE_SUCCESS";

export const enableDex = () => (dispatch, getState) => {
  dispatch({ type: DEX_ENABLE_ATTEMPT });
  const {
    daemon: { walletName }
  } = getState();

  try {
    const walletConfig = wallet.getWalletCfg(
      sel.isTestNet(getState()),
      walletName
    );
    walletConfig.set(
      configConstants.DEXWALLET_RPCUSERNAME,
      makeRandomString(12)
    );
    walletConfig.set(
      configConstants.DEXWALLET_RPCPASSWORD,
      makeRandomString(12)
    );
    walletConfig.set(
      configConstants.DEXWALLET_HOSTPORT,
      sel.chainParams(getState()).DefaultWalletRPCListener
    );
    walletConfig.set(configConstants.ENABLE_DEX, true);
    dispatch(addAllowedExternalRequest(EXTERNALREQUEST_DEX));

    dispatch({ type: DEX_ENABLE_SUCCESS });
    dispatch(closeWalletRequest());
  } catch (error) {
    dispatch({ type: DEX_ENABLE_FAILED, error });
    return;
  }
};

export const DEX_STARTUP_ATTEMPT = "DEX_STARTUP_ATTEMPT";
export const DEX_STARTUP_FAILED = "DEX_STARTUP_FAILED";
export const DEX_STARTUP_SUCCESS = "DEX_STARTUP_SUCCESS";

export const startDex = () => async (dispatch, getState) => {
  dispatch({ type: DEX_STARTUP_ATTEMPT });
  const isTestnet = sel.isTestNet(getState());
  const {
    daemon: { walletName }
  } = getState();
  const walletPath = wallet.getWalletPath(isTestnet, walletName);

  try {
    const res = await dex.start(walletPath, isTestnet);
    dispatch({ type: DEX_STARTUP_SUCCESS, serverAddress: res });
    dispatch(dexCheckInit());
  } catch (error) {
    dispatch({ type: DEX_STARTUP_FAILED, error });
    return;
  }
};

export const DEX_CHECKINIT_ATTEMPT = "DEX_CHECKINIT_ATTEMPT";
export const DEX_CHECKINIT_FAILED = "DEX_CHECKINIT_FAILED";
export const DEX_CHECKINIT_SUCCESS = "DEX_CHECKINIT_SUCCESS";

export const dexCheckInit = () => async (dispatch) => {
  dispatch({ type: DEX_CHECKINIT_ATTEMPT });
  try {
    const res = await dex.checkInit();
    dispatch({ type: DEX_CHECKINIT_SUCCESS, res });
  } catch (error) {
    dispatch({ type: DEX_CHECKINIT_FAILED, error });
    return;
  }
};

export const DEX_STOPPED = "DEX_STOPPED";

export const stopDex = () => (dispatch, getState) => {
  if (!sel.dexActive(getState())) {
    return;
  }

  dex.stop();
  dispatch({ type: DEX_STOPPED });
};

export const DEX_INIT_ATTEMPT = "DEX_INIT_ATTEMPT";
export const DEX_INIT_SUCCESS = "DEX_INIT_SUCCESS";
export const DEX_INIT_FAILED = "DEX_INIT_FAILED";

export const initDex = (passphrase) => async (dispatch, getState) => {
  dispatch({ type: DEX_INIT_ATTEMPT });
  if (!sel.dexActive(getState())) {
    dispatch({ type: DEX_INIT_FAILED, error: "Dex isn't active" });
    return;
  }
  try {
    await dex.init(passphrase);
    dispatch({ type: DEX_INIT_SUCCESS });
    // Request current user information
    dispatch(userDex());
  } catch (error) {
    dispatch({ type: DEX_INIT_FAILED, error });
    return;
  }
};

export const DEX_LOGIN_ATTEMPT = "DEX_LOGIN_ATTEMPT";
export const DEX_LOGIN_SUCCESS = "DEX_LOGIN_SUCCESS";
export const DEX_LOGIN_FAILED = "DEX_LOGIN_FAILED";

export const loginDex = (passphrase) => async (dispatch, getState) => {
  dispatch({ type: DEX_LOGIN_ATTEMPT });
  if (!sel.dexActive(getState())) {
    dispatch({ type: DEX_LOGIN_FAILED, error: "Dex isn't active" });
    return;
  }
  try {
    await dex.login(passphrase);
    dispatch({ type: DEX_LOGIN_SUCCESS });
    // Request current user information
    dispatch(userDex());
  } catch (error) {
    dispatch({ type: DEX_LOGIN_FAILED, error });
    return;
  }
};

export const DEX_LOGOUT_ATTEMPT = "DEX_LOGOUT_ATTEMPT";
export const DEX_LOGOUT_SUCCESS = "DEX_LOGOUT_SUCCESS";
export const DEX_LOGOUT_FAILED = "DEX_LOGOUT_FAILED";

export const logoutDex = () => dex.logout();

export const DEX_CREATEWALLET_ATTEMPT = "DEX_CREATEWALLET_ATTEMPT";
export const DEX_CREATEWALLET_SUCCESS = "DEX_CREATEWALLET_SUCCESS";
export const DEX_CREATEWALLET_FAILED = "DEX_CREATEWALLET_FAILED";

export const createWalletDex = (
  passphrase,
  appPassphrase,
  accountName
) => async (dispatch, getState) => {
  dispatch({ type: DEX_CREATEWALLET_ATTEMPT });
  if (!sel.dexActive(getState())) {
    dispatch({ type: DEX_CREATEWALLET_FAILED, error: "Dex isn't active" });
    return;
  }
  try {
    const {
      walletLoader: { dexRpcSettings }
    } = getState();
    const rpcCreds = dexRpcSettings;
    const account = accountName;
    const rpcuser = rpcCreds.rpcUser;
    const rpcpass = rpcCreds.rpcPass;
    const rpclisten = rpcCreds.rpcListen;
    const rpccert = rpcCreds.rpcCert;
    const assetID = 42;
    await dex.createWallet(
      assetID,
      passphrase,
      appPassphrase,
      account,
      rpcuser,
      rpcpass,
      rpclisten,
      rpccert
    );
    dispatch({ type: DEX_CREATEWALLET_SUCCESS });
    // Request current user information
    dispatch(userDex());
  } catch (error) {
    dispatch({ type: DEX_CREATEWALLET_FAILED, error });
    return;
  }
};

export const BTC_CREATEWALLET_ATTEMPT = "BTC_CREATEWALLET_ATTEMPT";
export const BTC_CREATEWALLET_SUCCESS = "BTC_CREATEWALLET_SUCCESS";
export const BTC_CREATEWALLET_FAILED = "BTC_CREATEWALLET_FAILED";

export const btcCreateWalletDex = (
  passphrase,
  appPassphrase,
  btcWalletName
) => async (dispatch, getState) => {
  dispatch({ type: BTC_CREATEWALLET_ATTEMPT });
  if (!sel.dexActive(getState())) {
    dispatch({ type: BTC_CREATEWALLET_FAILED, error: "Dex isn't active" });
    return;
  }
  try {
    const {
      dex: { btcConfig }
    } = getState();
    const testnet = sel.isTestNet(getState());
    let account = btcWalletName;
    const rpcuser = btcConfig.rpcuser;
    const rpcpass = btcConfig.rpcpassword;
    const rpclisten = testnet
      ? btcConfig.test.rpcbind + ":" + btcConfig.test.rpcport
      : btcConfig.rpcbind + ":" + btcConfig.rpcport;
    const assetID = 0;
    await dex.createWallet(
      assetID,
      passphrase,
      appPassphrase,
      account,
      rpcuser,
      rpcpass,
      rpclisten
    );
    dispatch({ type: BTC_CREATEWALLET_SUCCESS });
    if (!account || account == "") {
      account = "";
    }
    const {
      daemon: { walletName }
    } = getState();
    const walletConfig = wallet.getWalletCfg(
      sel.isTestNet(getState()),
      walletName
    );
    walletConfig.set(configConstants.BTCWALLET_NAME, account);
    // Request current user information
    dispatch(userDex());
  } catch (error) {
    dispatch({ type: BTC_CREATEWALLET_FAILED, error });
    return;
  }
};

export const DEX_USER_ATTEMPT = "DEX_USER_ATTEMPT";
export const DEX_USER_SUCCESS = "DEX_USER_SUCCESS";
export const DEX_USER_FAILED = "DEX_USER_FAILED";

export const userDex = () => async (dispatch, getState) => {
  dispatch({ type: DEX_USER_ATTEMPT });
  if (!sel.dexActive(getState())) {
    dispatch({ type: DEX_USER_FAILED, error: "Dex isn't active" });
    return;
  }
  try {
    const user = await dex.user();
    dispatch({ type: DEX_USER_SUCCESS, user });
  } catch (error) {
    dispatch({ type: DEX_USER_FAILED, error });
    return;
  }
};

export const DEX_GETCONFIG_ATTEMPT = "DEX_GETCONFIG_ATTEMPT";
export const DEX_GETCONFIG_SUCCESS = "DEX_GETCONFIG_SUCCESS";
export const DEX_GETCONFIG_FAILED = "DEX_GETCONFIG_FAILED";

export const getConfigDex = (addr) => async (dispatch, getState) => {
  dispatch({ type: DEX_GETCONFIG_ATTEMPT });
  if (!sel.dexActive(getState())) {
    dispatch({ type: DEX_GETCONFIG_FAILED, error: "Dex isn't active" });
    return;
  }
  try {
    const config = await dex.getConfig(addr);
    dispatch({ type: DEX_GETCONFIG_SUCCESS, config, addr });
  } catch (error) {
    dispatch({ type: DEX_GETCONFIG_FAILED, error });
    return;
  }
};

export const DEX_REGISTER_ATTEMPT = "DEX_REGISTER_ATTEMPT";
export const DEX_REGISTER_SUCCESS = "DEX_REGISTER_SUCCESS";
export const DEX_REGISTER_FAILED = "DEX_REGISTER_FAILED";

export const registerDex = (appPass) => async (dispatch, getState) => {
  dispatch({ type: DEX_REGISTER_ATTEMPT });
  if (!sel.dexActive(getState())) {
    dispatch({ type: DEX_REGISTER_FAILED, error: "Dex isn't acteive" });
    return;
  }
  const {
    dex: { config, addr }
  } = getState();
  if (config.feeAsset.id != 42) {
    throw "unexpected fee payment type, expected to be paid in DCR";
  }
  const fee = config.feeAsset.amount;
  try {
    await dex.register(appPass, addr, fee);
    dispatch({ type: DEX_REGISTER_SUCCESS });
    // Request current user information
    dispatch(userDex());
  } catch (error) {
    let dispatchError = error;
    if (String(error).indexOf("insufficient funds") > -1) {
      dispatchError = new Error(
        "Insufficient funds in dex account to pay " +
          fee +
          ". Please fund the account, and try again."
      );
    }
    dispatch({ type: DEX_REGISTER_FAILED, error: dispatchError });
    return;
  }
};

export const DEX_LAUNCH_WINDOW_ATTEMPT = "DEX_LAUNCH_WINDOW_ATTEMPT";
export const DEX_LAUNCH_WINDOW_SUCCESS = "DEX_LAUNCH_WINDOW_SUCCESS";
export const DEX_LAUNCH_WINDOW_FAILED = "DEX_LAUNCH_WINDOW_FAILED";

export const launchDexWindow = () => async (dispatch, getState) => {
  const {
    dex: { dexServerAddress }
  } = getState();
  dispatch({ type: DEX_LAUNCH_WINDOW_ATTEMPT });
  if (!sel.dexActive(getState())) {
    dispatch({ type: DEX_LAUNCH_WINDOW_FAILED, error: "Dex isn't active" });
    return;
  }
  try {
    const serverAddress = dexServerAddress;
    await dex.launchWindow(serverAddress);
    dispatch({ type: DEX_LAUNCH_WINDOW_SUCCESS });
    // Request current user information
    dispatch(userDex());
  } catch (error) {
    dispatch({ type: DEX_LAUNCH_WINDOW_FAILED, error });
    return;
  }
};

export const CHECK_BTC_CONFIG_ATTEMPT = "CHECK_BTC_CONFIG_ATTEMPT";
export const CHECK_BTC_CONFIG_SUCCESS = "CHECK_BTC_CONFIG_SUCCESS";
export const CHECK_BTC_CONFIG_FAILED = "CHECK_BTC_CONFIG_FAILED";
export const CHECK_BTC_CONFIG_SUCCESS_UPDATE_NEEDED =
  "CHECK_BTC_CONFIG_SUCCESS_UPDATE_NEEDED";
export const CHECK_BTC_CONFIG_SUCCESS_NEED_INSTALL =
  "CHECK_BTC_CONFIG_SUCCESS_NEED_INSTALL";

export const checkBTCConfig = () => async (dispatch, getState) => {
  dispatch({ type: CHECK_BTC_CONFIG_ATTEMPT });
  try {
    const res = await dex.checkBTCConfig();
    if (
      res.rpcuser &&
      res.rpcpassword &&
      ((!sel.isTestNet(getState()) &&
        !res.test &&
        res.rpcbind &&
        res.rpcport) ||
        (sel.isTestNet(getState()) &&
          res.test &&
          res.test.rpcbind &&
          res.test.rpcbind)) &&
      (res.server || res.test.server)
    ) {
      dispatch({ type: CHECK_BTC_CONFIG_SUCCESS, btcConfig: res });
    } else {
      dispatch({ type: CHECK_BTC_CONFIG_SUCCESS_UPDATE_NEEDED });
      dispatch(updateBTCConfig());
    }
  } catch (error) {
    if (String(error).indexOf("no such file or directory") > -1) {
      dispatch({ type: CHECK_BTC_CONFIG_SUCCESS_NEED_INSTALL });
      dispatch(updateBTCConfig());
    } else {
      dispatch({ type: CHECK_BTC_CONFIG_FAILED, error });
    }
  }
  return;
};

export const UPDATE_BTC_CONFIG_ATTEMPT = "UPDATE_BTC_CONFIG_ATTEMPT";
export const UPDATE_BTC_CONFIG_SUCCESS = "UPDATE_BTC_CONFIG_SUCCESS";
export const UPDATE_BTC_CONFIG_FAILED = "UPDATE_BTC_CONFIG_FAILED";

export const updateBTCConfig = () => async (dispatch, getState) => {
  dispatch({ type: UPDATE_BTC_CONFIG_ATTEMPT });
  try {
    const rpcuser = makeRandomString(12);
    const rpcpassword = makeRandomString(12);
    const rpcbind = "127.0.0.1";
    const rpcport = sel.isTestNet(getState()) ? "18332" : "8332";
    const testnet = sel.isTestNet(getState());
    const res = await dex.updateBTCConfig(
      rpcuser,
      rpcpassword,
      rpcbind,
      rpcport,
      testnet
    );
    dispatch({ type: UPDATE_BTC_CONFIG_SUCCESS, btcConfig: res });
  } catch (error) {
    dispatch({ type: UPDATE_BTC_CONFIG_FAILED, error });
    return;
  }
};

export const CREATEDEXACCOUNT_ATTEMPT = "CREATEDEXACCOUNT_ATTEMPT";
export const CREATEDEXACCOUNT_FAILED = "CREATEDEXACCOUNT_FAILED";
export const CREATEDEXACCOUNT_SUCCESS = "CREATEDEXACCOUNT_SUCCESS";

export const createDexAccount = (passphrase, accountName) => async (
  dispatch,
  getState
) => {
  const {
    daemon: { walletName }
  } = getState();

  try {
    const walletConfig = wallet.getWalletCfg(
      sel.isTestNet(getState()),
      walletName
    );
    dispatch({ type: CREATEDEXACCOUNT_ATTEMPT });
    await dispatch(getNextAccountAttempt(passphrase, accountName));
    dispatch({ dexAccount: accountName, type: CREATEDEXACCOUNT_SUCCESS });
    walletConfig.set(configConstants.DEX_ACCOUNT, accountName);
  } catch (error) {
    dispatch({ error, type: CREATEDEXACCOUNT_FAILED });
  }
};

export const SELECT_DEXACCOUNT_ATTEMPT = "SELECT_DEXACCOUNT_ATTEMPT";
export const SELECT_DEXACCOUNT_FAILED = "SELECT_DEXACCOUNT_FAILED";
export const SELECT_DEXACCOUNT_SUCCESS = "SELECT_DEXACCOUNT_SUCCESS";

export const selectDexAccount = (accountName) => (dispatch, getState) => {
  const {
    daemon: { walletName }
  } = getState();

  try {
    dispatch({ type: SELECT_DEXACCOUNT_ATTEMPT });
    const walletConfig = wallet.getWalletCfg(
      sel.isTestNet(getState()),
      walletName
    );
    dispatch({ dexAccount: accountName, type: SELECT_DEXACCOUNT_SUCCESS });
    walletConfig.set(configConstants.DEX_ACCOUNT, accountName);
  } catch (error) {
    dispatch({ error, type: SELECT_DEXACCOUNT_FAILED });
  }
};
