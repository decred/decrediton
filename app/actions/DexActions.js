import * as sel from "selectors";
import { wallet, dex } from "wallet-preload-shim";
import { addAllowedExternalRequest } from "./SettingsActions";
import { getNextAccountAttempt } from "./ControlActions";
import { closeWalletRequest } from "./WalletLoaderActions";
import { EXTERNALREQUEST_DEX } from "constants";
import * as configConstants from "constants/config";
import { makeRandomString, base64ToHex } from "helpers";

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
export const RESET_DEXACCOUNT = "RESET_DEXACCOUNT";

export const startDex = () => async (dispatch, getState) => {
  dispatch({ type: DEX_STARTUP_ATTEMPT });
  const isTestnet = sel.isTestNet(getState());
  const locale = sel.currentLocaleName(getState());
  const {
    daemon: { walletName }
  } = getState();
  const accounts = sel.accounts(getState());
  const dexAccount = sel.dexAccount(getState());
  const walletPath = wallet.getWalletPath(isTestnet, walletName);
  try {
    const res = await dex.start(walletPath, isTestnet, locale);
    dispatch({ type: DEX_STARTUP_SUCCESS, serverAddress: res });
    dispatch(dexCheckInit());

    // Check to make sure dex account exists:
    let dexAccountFound = false;
    for (let i = 0; i < accounts.length; i++) {
      if (accounts[i].accountName == dexAccount) {
        dexAccountFound = true;
        break;
      }
    }
    // If dex account not found, reset and allow user to select again.
    if (!dexAccountFound) {
      const walletConfig = wallet.getWalletCfg(
        sel.isTestNet(getState()),
        walletName
      );
      dispatch({ type: RESET_DEXACCOUNT });
      walletConfig.set(configConstants.DEX_ACCOUNT, null);
    }
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

export const initDex = (passphrase, seed) => async (dispatch, getState) => {
  const {
    walletLoader: { confirmDexSeed }
  } = getState();
  dispatch({ type: DEX_INIT_ATTEMPT });
  if (!sel.dexActive(getState())) {
    dispatch({ type: DEX_INIT_FAILED, error: "Dex isn't active" });
    return;
  }
  try {
    await dex.init(passphrase, seed);
    dispatch({ type: DEX_INIT_SUCCESS });
    // Request current user information
    if (!confirmDexSeed) {
      dispatch(exportSeedDex(passphrase));
    }
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
  const {
    walletLoader: { confirmDexSeed }
  } = getState();
  if (!sel.dexActive(getState())) {
    dispatch({ type: DEX_LOGIN_FAILED, error: "Dex isn't active" });
    return;
  }
  try {
    if (!confirmDexSeed) {
      dispatch(exportSeedDex(passphrase));
    }
    await dex.login(passphrase);
    dispatch({ type: DEX_LOGIN_SUCCESS });
    // Request current user information
    dispatch(userDex());
  } catch (error) {
    dispatch({ type: DEX_LOGIN_FAILED, error });
    return;
  }
};

export const DEX_EXPORT_SEED_ATTEMPT = "DEX_EXPORT_SEED_ATTEMPT";
export const DEX_EXPORT_SEED_SUCCESS = "DEX_EXPORT_SEED_SUCCESS";
export const DEX_EXPORT_SEED_FAILED = "DEX_EXPORT_SEED_FAILED";

export const exportSeedDex = (passphrase) => async (dispatch, getState) => {
  dispatch({ type: DEX_EXPORT_SEED_ATTEMPT });
  if (!sel.dexActive(getState())) {
    dispatch({ type: DEX_EXPORT_SEED_FAILED, error: "Dex isn't active" });
    return;
  }
  try {
    const seed = await dex.exportSeed(passphrase);
    dispatch({ type: DEX_EXPORT_SEED_SUCCESS, dexSeed: base64ToHex(seed) });
  } catch (error) {
    dispatch({ type: DEX_EXPORT_SEED_FAILED, error });
    return;
  }
};

export const DEX_CONFIRM_SEED_ATTEMPT = "DEX_CONFIRM_SEED_ATTEMPT";
export const DEX_CONFIRM_SEED_SUCCESS = "DEX_CONFIRM_SEED_SUCCESS";
export const DEX_CONFIRM_SEED_FAILED = "DEX_CONFIRM_SEED_FAILED";

export const confirmDexSeed = () => (dispatch, getState) => {
  const {
    daemon: { walletName }
  } = getState();
  try {
    dispatch({ type: DEX_CONFIRM_SEED_ATTEMPT });
    const walletConfig = wallet.getWalletCfg(
      sel.isTestNet(getState()),
      walletName
    );
    walletConfig.set(configConstants.CONFIRM_DEX_SEED, true);
    dispatch({ type: DEX_CONFIRM_SEED_SUCCESS });
  } catch (error) {
    dispatch({ type: DEX_CONFIRM_SEED_FAILED, error });
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
    const walletType = "dcrwalletRPC";
    await dex.createWallet(
      assetID,
      walletType,
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

export const DEX_SETWALLET_PASSWORD_ATTEMPT = "DEX_SETWALLET_PASSWORD_ATTEMPT";
export const DEX_SETWALLET_PASSWORD_SUCCESS = "DEX_SETWALLET_PASSWORD_SUCCESS";
export const DEX_SETWALLET_PASSWORD_FAILED = "DEX_SETWALLET_PASSWORD_FAILED";

export const setWalletPasswordDex = (passphrase, appPassphrase) => async (
  dispatch,
  getState
) => {
  dispatch({ type: DEX_SETWALLET_PASSWORD_ATTEMPT });
  if (!sel.dexActive(getState())) {
    dispatch({
      type: DEX_SETWALLET_PASSWORD_FAILED,
      error: "Dex isn't active"
    });
    return;
  }
  try {
    const assetID = 42;
    await dex.setWalletPassword(assetID, passphrase, appPassphrase);
    dispatch({ type: DEX_SETWALLET_PASSWORD_SUCCESS });
  } catch (error) {
    dispatch({ type: DEX_SETWALLET_PASSWORD_FAILED, error });
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

export const DEX_LAUNCH_WINDOW_ATTEMPT = "DEX_LAUNCH_WINDOW_ATTEMPT";
export const DEX_LAUNCH_WINDOW_SUCCESS = "DEX_LAUNCH_WINDOW_SUCCESS";
export const DEX_LAUNCH_WINDOW_FAILED = "DEX_LAUNCH_WINDOW_FAILED";
export const DEX_READY = "DEX_READY";

export const launchDexWindow = () => async (dispatch, getState) => {
  const {
    dex: { dexServerAddress },
    walletLoader: { dexReady },
    daemon: { walletName }
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
    if (!dexReady) {
      const walletConfig = wallet.getWalletCfg(
        sel.isTestNet(getState()),
        walletName
      );
      walletConfig.set(configConstants.DEX_READY, true);
      dispatch({ type: DEX_READY });
    }
  } catch (error) {
    dispatch({ type: DEX_LAUNCH_WINDOW_FAILED, error });
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
