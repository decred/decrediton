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
    dispatch({ type: DEX_INIT_SUCCESS, fromSeed: seed });
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

export const DEX_USE_SPV_BTC_ATTEMPT = "DEX_USE_SPV_BTC_ATTEMPT";
export const DEX_USE_SPV_BTC_SUCCESS = "DEX_USE_SPV_BTC_SUCCESS";
export const DEX_USE_SPV_BTC_FAILED = "DEX_USE_SPV_BTC_FAILED";

export const useBtcSpvDex = (useSPV) => (dispatch, getState) => {
  const {
    daemon: { walletName }
  } = getState();
  try {
    dispatch({ type: DEX_USE_SPV_BTC_ATTEMPT });
    const walletConfig = wallet.getWalletCfg(
      sel.isTestNet(getState()),
      walletName
    );
    dispatch({
      type: DEX_USE_SPV_BTC_SUCCESS,
      dexBtcSpv: useSPV,
      askDexBtcSpv: true
    });
    walletConfig.set(configConstants.DEX_BTC_SPV, useSPV);
    walletConfig.set(configConstants.ASK_DEX_BTC_SPV, true);
  } catch (error) {
    dispatch({ type: DEX_USE_SPV_BTC_FAILED, error });
  }
};

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
    const walletType = "bitcoindRPC"; // "SPV" for the native/built-in spv btcwallet
    await dex.createWallet(
      assetID,
      walletType,
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

export const DEX_PREREGISTER_ATTEMPT = "DEX_PREREGISTER_ATTEMPT";
export const DEX_PREREGISTER_SUCCESS = "DEX_PREREGISTER_SUCCESS";
export const DEX_PREREGISTER_FAILED = "DEX_PREREGISTER_FAILED";

export const preRegisterDex = (appPass, addr) => async (dispatch, getState) => {
  dispatch({ type: DEX_PREREGISTER_ATTEMPT });
  if (!sel.dexActive(getState())) {
    dispatch({ type: DEX_PREREGISTER_FAILED, error: "Dex isn't active" });
    return;
  }
  try {
    const alreadyPaid = await dex.preRegister(appPass, addr);
    // If it's not already paid it returns the config that is used to pay the
    // required fee.
    if (typeof alreadyPaid == "boolean") {
      dispatch({ type: DEX_PREREGISTER_SUCCESS, alreadyPaid, addr });
    } else {
      dispatch({ type: DEX_GETCONFIG_SUCCESS, config: alreadyPaid, addr });
    }
  } catch (error) {
    dispatch({ type: DEX_PREREGISTER_FAILED, error });
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

// NOTE: dex accepts fees in multiple assets, as indicated by server in
// config.regFees object. See the dcrdex/client/core.Exchange struct. This
// function registers with Decred.
export const registerDex = (appPass) => async (dispatch, getState) => {
  dispatch({ type: DEX_REGISTER_ATTEMPT });
  if (!sel.dexActive(getState())) {
    dispatch({ type: DEX_REGISTER_FAILED, error: "Dex isn't active" });
    return;
  }
  const {
    dex: { config, addr }
  } = getState();
  if (!config.regFees.dcr || config.regFees.dcr.id != 42) {
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

export const checkBTCConfig = (bitcoinDirectory) => async (
  dispatch,
  getState
) => {
  dispatch({ type: CHECK_BTC_CONFIG_ATTEMPT });
  try {
    const res = await dex.checkBTCConfig(bitcoinDirectory);
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
    }
  } catch (error) {
    if (String(error).indexOf("no such file or directory") > -1) {
      dispatch({ type: CHECK_BTC_CONFIG_SUCCESS_NEED_INSTALL });
    } else {
      dispatch({ type: CHECK_BTC_CONFIG_FAILED, error });
    }
  }
  return;
};

export const NEW_BTC_CONFIG_ATTEMPT = "NEW_BTC_CONFIG_ATTEMPT";
export const NEW_BTC_CONFIG_SUCCESS = "NEW_BTC_CONFIG_SUCCESS";
export const NEW_BTC_CONFIG_FAILED = "NEW_BTC_CONFIG_FAILED";

export const newBTCConfig = (bitcoinDirectory) => async (
  dispatch,
  getState
) => {
  dispatch({ type: NEW_BTC_CONFIG_ATTEMPT });
  try {
    const rpcuser = makeRandomString(12);
    const rpcpassword = makeRandomString(12);
    const rpcbind = "127.0.0.1";
    const rpcport = sel.isTestNet(getState()) ? "18332" : "8332";
    const testnet = sel.isTestNet(getState());
    const res = await dex.newBTCConfig(
      rpcuser,
      rpcpassword,
      rpcbind,
      rpcport,
      testnet,
      bitcoinDirectory
    );
    dispatch({ type: NEW_BTC_CONFIG_SUCCESS, btcConfig: res });
  } catch (error) {
    dispatch({ type: NEW_BTC_CONFIG_FAILED, error });
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
