import * as sel from "selectors";
import { ipcRenderer } from "electron";
import { getWalletPath } from "main_dev/paths";
import { getWalletCfg } from "config";
import { addAllowedExternalRequest } from "./SettingsActions";
import { getNextAccountAttempt } from "./ControlActions";
import { closeWalletRequest } from "./WalletLoaderActions";
import { EXTERNALREQUEST_DEX } from "main_dev/externalRequests";
import * as configConstants from "constants/config";
import { makeRandomString } from "helpers";

const sendSync = (...args) => {
  const res = ipcRenderer.sendSync(...args);
  if (res instanceof Error) {
    throw res;
  }
  return res;
};

export const DEX_ENABLE_ATTEMPT = "DEX_ENABLE_ATTEMPT";
export const DEX_ENABLE_FAILED = "DEX_ENABLE_FAILED";
export const DEX_ENABLE_SUCCESS = "DEX_ENABLE_SUCCESS";

export const enableDex = () => (dispatch, getState) => {
  dispatch({ type: DEX_ENABLE_ATTEMPT });
  const {
    daemon: { walletName }
  } = getState();

  try {
    const walletConfig = getWalletCfg(sel.isTestNet(getState()), walletName);
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

export const startDex = () => (dispatch, getState) => {
  dispatch({ type: DEX_STARTUP_ATTEMPT });
  const isTestnet = sel.isTestNet(getState());
  const {
    daemon: { walletName }
  } = getState();
  const walletPath = getWalletPath(isTestnet, walletName);

  try {
    const res = sendSync("start-dex", walletPath, isTestnet);
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

export const dexCheckInit = () => (dispatch) => {
  dispatch({ type: DEX_CHECKINIT_ATTEMPT });
  try {
    const res = sendSync("check-init-dex");
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

  ipcRenderer.send("stop-dex");
  dispatch({ type: DEX_STOPPED });
};

export const DEX_INIT_ATTEMPT = "DEX_INIT_ATTEMPT";
export const DEX_INIT_SUCCESS = "DEX_INIT_SUCCESS";
export const DEX_INIT_FAILED = "DEX_INIT_FAILED";

export const initDex = (passphrase) => (dispatch, getState) => {
  dispatch({ type: DEX_INIT_ATTEMPT });
  if (!sel.dexActive(getState())) {
    dispatch({ type: DEX_INIT_FAILED, error: "Dex isn't active" });
    return;
  }
  try {
    sendSync("init-dex", passphrase);
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

export const loginDex = (passphrase) => (dispatch, getState) => {
  dispatch({ type: DEX_LOGIN_ATTEMPT });
  if (!sel.dexActive(getState())) {
    dispatch({ type: DEX_LOGIN_FAILED, error: "Dex isn't active" });
    return;
  }
  try {
    sendSync("login-dex", passphrase);
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

export const logoutDex = () =>
  new Promise((resolve, reject) => {
    try {
      sendSync("logout-dex");
      return resolve(true);
    } catch (error) {
      return reject(error);
    }
  });

export const DEX_CREATEWALLET_ATTEMPT = "DEX_CREATEWALLET_ATTEMPT";
export const DEX_CREATEWALLET_SUCCESS = "DEX_CREATEWALLET_SUCCESS";
export const DEX_CREATEWALLET_FAILED = "DEX_CREATEWALLET_FAILED";

export const createWalletDex = (passphrase, appPassphrase, accountName) => (
  dispatch,
  getState
) => {
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
    sendSync(
      "create-wallet-dex",
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
) => (dispatch, getState) => {
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
    sendSync(
      "create-wallet-dex",
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
    const walletConfig = getWalletCfg(sel.isTestNet(getState()), walletName);
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

export const userDex = () => (dispatch, getState) => {
  dispatch({ type: DEX_USER_ATTEMPT });
  if (!sel.dexActive(getState())) {
    dispatch({ type: DEX_USER_FAILED, error: "Dex isn't active" });
    return;
  }
  try {
    const user = sendSync("user-dex");
    dispatch({ type: DEX_USER_SUCCESS, user });
  } catch (error) {
    dispatch({ type: DEX_USER_FAILED, error });
    return;
  }
};

export const DEX_GETCONFIG_ATTEMPT = "DEX_GETCONFIG_ATTEMPT";
export const DEX_GETCONFIG_SUCCESS = "DEX_GETCONFIG_SUCCESS";
export const DEX_GETCONFIG_FAILED = "DEX_GETCONFIG_FAILED";

export const getConfigDex = (addr) => (dispatch, getState) => {
  dispatch({ type: DEX_GETCONFIG_ATTEMPT });
  if (!sel.dexActive(getState())) {
    dispatch({ type: DEX_GETCONFIG_FAILED, error: "Dex isn't active" });
    return;
  }
  try {
    const config = sendSync("get-config-dex", addr);
    dispatch({ type: DEX_GETCONFIG_SUCCESS, config, addr });
  } catch (error) {
    dispatch({ type: DEX_GETCONFIG_FAILED, error });
    return;
  }
};

export const DEX_REGISTER_ATTEMPT = "DEX_REGISTER_ATTEMPT";
export const DEX_REGISTER_SUCCESS = "DEX_REGISTER_SUCCESS";
export const DEX_REGISTER_FAILED = "DEX_REGISTER_FAILED";

export const registerDex = (appPass) => (dispatch, getState) => {
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
    sendSync("register-dex", appPass, addr, fee);
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

export const launchDexWindow = () => (dispatch, getState) => {
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
    sendSync("launch-dex-window", serverAddress);
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

export const checkBTCConfig = () => (dispatch, getState) => {
  dispatch({ type: CHECK_BTC_CONFIG_ATTEMPT });
  try {
    const res = sendSync("check-btc-config");
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

export const updateBTCConfig = () => (dispatch, getState) => {
  dispatch({ type: UPDATE_BTC_CONFIG_ATTEMPT });
  try {
    const rpcuser = makeRandomString(12);
    const rpcpassword = makeRandomString(12);
    const rpcbind = "127.0.0.1";
    const rpcport = sel.isTestNet(getState()) ? "18332" : "8332";
    const testnet = sel.isTestNet(getState());
    const res = sendSync(
      "update-btc-config",
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
    const walletConfig = getWalletCfg(sel.isTestNet(getState()), walletName);
    dispatch({ type: CREATEDEXACCOUNT_ATTEMPT });
    await dispatch(getNextAccountAttempt(passphrase, accountName));
    dispatch({ dexAccount: accountName, type: CREATEDEXACCOUNT_SUCCESS });
    walletConfig.set(configConstants.DEX_ACCOUNT, accountName);
  } catch (error) {
    dispatch({ error, type: CREATEDEXACCOUNT_FAILED });
  }
};
