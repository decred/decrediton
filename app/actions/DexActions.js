import * as sel from "selectors";
import * as wallet from "wallet";
import { ipcRenderer } from "electron";
import { getWalletPath } from "main_dev/paths";
import { getWalletCfg } from "config";
import { isTestNet } from "selectors";
import { addAllowedExternalRequest } from "./SettingsActions";
import { closeWalletRequest } from "./WalletLoaderActions";
import { EXTERNALREQUEST_DEXC } from "main_dev/externalRequests";
import * as configConstants from "constants/config";
import { makeRandomString } from "helpers";

export const DEXC_ENABLE_ATTEMPT = "DEXC_ENABLE_ATTEMPT";
export const DEXC_ENABLE_FAILED = "DEXC_ENABLE_FAILED";
export const DEXC_ENABLE_SUCCESS = "DEXC_ENABLE_SUCCESS";

export const enableDexc = () => (dispatch, getState) => {
  dispatch({ type: DEXC_ENABLE_ATTEMPT });
  const {
    daemon: { walletName }
  } = getState();

  try {
    const walletConfig = getWalletCfg(isTestNet(getState()), walletName);
    walletConfig.set(
      configConstants.DEXWALLET_RPCUSERNAME,
      makeRandomString(12)
    );
    walletConfig.set(
      configConstants.DEXWALLET_RPCPASSWORD,
      makeRandomString(12)
    );
    walletConfig.set(configConstants.DEXWALLET_HOSTPORT, "127.0.0.1:19110");
    walletConfig.set(configConstants.ENABLE_DEX, true);
    dispatch(addAllowedExternalRequest(EXTERNALREQUEST_DEXC));

    dispatch({ type: DEXC_ENABLE_SUCCESS });
    dispatch(closeWalletRequest());
  } catch (error) {
    dispatch({ type: DEXC_ENABLE_FAILED, error });
    return;
  }
};

export const DEXC_STARTUP_ATTEMPT = "DEXC_STARTUP_ATTEMPT";
export const DEXC_STARTUP_FAILED = "DEXC_STARTUP_FAILED";
export const DEXC_STARTUP_SUCCESS = "DEXC_STARTUP_SUCCESS";

export const startDexc = () => (dispatch, getState) => {
  dispatch({ type: DEXC_STARTUP_ATTEMPT });
  const isTestnet = sel.isTestNet(getState());
  const {
    daemon: { walletName }
  } = getState();
  const walletPath = getWalletPath(isTestnet, walletName);

  try {
    const res = ipcRenderer.sendSync("start-dexc", walletPath, isTestnet);
    if (res instanceof Error) {
      throw res;
    }
    if (typeof res === "string") {
      if (res.indexOf("error", 0) > -1) {
        throw res;
      }
    }
    dispatch({ type: DEXC_STARTUP_SUCCESS, serverAddress: res });
    dispatch(dexcCheckInit());
  } catch (error) {
    dispatch({ type: DEXC_STARTUP_FAILED, error });
    return;
  }
};

export const DEXC_CHECKINIT_ATTEMPT = "DEXC_CHECKINIT_ATTEMPT";
export const DEXC_CHECKINIT_FAILED = "DEXC_CHECKINIT_FAILED";
export const DEXC_CHECKINIT_SUCCESS = "DEXC_CHECKINIT_SUCCESS";

export const dexcCheckInit = () => (dispatch) => {
  dispatch({ type: DEXC_CHECKINIT_ATTEMPT });
  try {
    let res = ipcRenderer.sendSync("check-init-dexc");
    if (res instanceof Error) {
      throw res;
    }
    if (typeof res === "string") {
      if (res.indexOf("error", 0) > -1) {
        throw res;
      }
      res = res == "true" ? true : false;
    }
    dispatch({ type: DEXC_CHECKINIT_SUCCESS, res });
  } catch (error) {
    dispatch({ type: DEXC_CHECKINIT_FAILED, error });
    return;
  }
};

export const DEXC_STOPPED = "DEXC_STOPPED";

export const stopDexc = () => (dispatch, getState) => {
  if (!sel.dexcActive(getState())) {
    return;
  }

  ipcRenderer.send("stop-dexc");
  dispatch({ type: DEXC_STOPPED });
};

export const DEXC_INIT_ATTEMPT = "DEXC_INIT_ATTEMPT";
export const DEXC_INIT_SUCCESS = "DEXC_INIT_SUCCESS";
export const DEXC_INIT_FAILED = "DEXC_INIT_FAILED";

export const initDexc = (passphrase) => (dispatch, getState) => {
  dispatch({ type: DEXC_INIT_ATTEMPT });
  if (!sel.dexcActive(getState())) {
    dispatch({ type: DEXC_INIT_FAILED, error: "Dexc isn't active" });
    return;
  }
  try {
    const res = ipcRenderer.sendSync("init-dexc", passphrase);
    if (res instanceof Error) {
      throw res;
    } else if (typeof res === "string") {
      if (res.indexOf("error", 0) > -1) {
        throw res;
      }
    }
    dispatch({ type: DEXC_INIT_SUCCESS });
    // Request current user information
    dispatch(userDexc());
  } catch (error) {
    dispatch({ type: DEXC_INIT_FAILED, error });
    return;
  }
};

export const DEXC_LOGIN_ATTEMPT = "DEXC_LOGIN_ATTEMPT";
export const DEXC_LOGIN_SUCCESS = "DEXC_LOGIN_SUCCESS";
export const DEXC_LOGIN_FAILED = "DEXC_LOGIN_FAILED";

export const loginDexc = (passphrase) => (dispatch, getState) => {
  dispatch({ type: DEXC_LOGIN_ATTEMPT });
  if (!sel.dexcActive(getState())) {
    dispatch({ type: DEXC_LOGIN_FAILED, error: "Dexc isn't active" });
    return;
  }
  try {
    const res = ipcRenderer.sendSync("login-dexc", passphrase);
    if (res instanceof Error) {
      throw res;
    } else if (typeof res === "string") {
      if (res.indexOf("error", 0) > -1) {
        throw res;
      }
    }
    dispatch({ type: DEXC_LOGIN_SUCCESS });
    // Request current user information
    dispatch(userDexc());
  } catch (error) {
    dispatch({ type: DEXC_LOGIN_FAILED, error });
    return;
  }
};

export const DEXC_LOGOUT_ATTEMPT = "DEXC_LOGOUT_ATTEMPT";
export const DEXC_LOGOUT_SUCCESS = "DEXC_LOGOUT_SUCCESS";
export const DEXC_LOGOUT_FAILED = "DEXC_LOGOUT_FAILED";

export const logoutDexc = () =>
  new Promise((resolve, reject) => {
    try {
      const res = ipcRenderer.sendSync("logout-dexc");
      if (res instanceof Error) {
        throw res;
      } else if (typeof res === "string") {
        if (res.indexOf("error", 0) > -1) {
          throw res;
        }
      }
      return resolve(true);
    } catch (error) {
      return reject(error);
    }
  });

export const DEXC_CREATEWALLET_ATTEMPT = "DEXC_CREATEWALLET_ATTEMPT";
export const DEXC_CREATEWALLET_SUCCESS = "DEXC_CREATEWALLET_SUCCESS";
export const DEXC_CREATEWALLET_FAILED = "DEXC_CREATEWALLET_FAILED";

export const createWalletDexc = (passphrase, appPassphrase, accountName) => (
  dispatch,
  getState
) => {
  dispatch({ type: DEXC_CREATEWALLET_ATTEMPT });
  if (!sel.dexcActive(getState())) {
    dispatch({ type: DEXC_CREATEWALLET_FAILED, error: "Dexc isn't active" });
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
    const res = ipcRenderer.sendSync(
      "create-wallet-dexc",
      assetID,
      passphrase,
      appPassphrase,
      account,
      rpcuser,
      rpcpass,
      rpclisten,
      rpccert
    );
    if (res instanceof Error) {
      throw res;
    } else if (typeof res === "string") {
      if (res.indexOf("error", 0) > -1) {
        throw res;
      }
    }
    dispatch({ type: DEXC_CREATEWALLET_SUCCESS });
    // Request current user information
    dispatch(userDexc());
  } catch (error) {
    dispatch({ type: DEXC_CREATEWALLET_FAILED, error });
    return;
  }
};

export const BTC_CREATEWALLET_ATTEMPT = "BTC_CREATEWALLET_ATTEMPT";
export const BTC_CREATEWALLET_SUCCESS = "BTC_CREATEWALLET_SUCCESS";
export const BTC_CREATEWALLET_FAILED = "BTC_CREATEWALLET_FAILED";

export const btcCreateWalletDexc = (
  passphrase,
  appPassphrase,
  btcWalletName
) => (dispatch, getState) => {
  dispatch({ type: BTC_CREATEWALLET_ATTEMPT });
  if (!sel.dexcActive(getState())) {
    dispatch({ type: BTC_CREATEWALLET_FAILED, error: "Dexc isn't active" });
    return;
  }
  try {
    const {
      dex: { btcConfig }
    } = getState();
    const testnet = isTestNet(getState());
    const account = btcWalletName;
    const rpcuser = btcConfig.rpcuser;
    const rpcpass = btcConfig.rpcpassword;
    const rpclisten = testnet
      ? btcConfig.test.rpcbind + ":" + btcConfig.test.rpcport
      : btcConfig.rpcbind + ":" + btcConfig.rpcport;
    const assetID = 0;
    const res = ipcRenderer.sendSync(
      "create-wallet-dexc",
      assetID,
      passphrase,
      appPassphrase,
      account,
      rpcuser,
      rpcpass,
      rpclisten
    );
    if (res instanceof Error) {
      throw res;
    } else if (typeof res === "string") {
      if (res.indexOf("error", 0) > -1) {
        throw res;
      }
    }
    dispatch({ type: BTC_CREATEWALLET_SUCCESS });
    const {
      daemon: { walletName }
    } = getState();
    const walletConfig = getWalletCfg(isTestNet(getState()), walletName);
    walletConfig.set(configConstants.BTCWALLET_NAME, account);
    // Request current user information
    dispatch(userDexc());
  } catch (error) {
    dispatch({ type: BTC_CREATEWALLET_FAILED, error });
    return;
  }
};

export const DEXC_USER_ATTEMPT = "DEXC_USER_ATTEMPT";
export const DEXC_USER_SUCCESS = "DEXC_USER_SUCCESS";
export const DEXC_USER_FAILED = "DEXC_USER_FAILED";

export const userDexc = () => (dispatch, getState) => {
  dispatch({ type: DEXC_USER_ATTEMPT });
  if (!sel.dexcActive(getState())) {
    dispatch({ type: DEXC_USER_FAILED, error: "Dexc isn't active" });
    return;
  }
  try {
    const res = ipcRenderer.sendSync("user-dexc");
    if (res instanceof Error) {
      throw res;
    } else if (typeof res === "string") {
      if (res.indexOf("error", 0) > -1) {
        throw res;
      }
    }
    const resJson = JSON.parse(res);
    dispatch({ type: DEXC_USER_SUCCESS, user: resJson });
  } catch (error) {
    dispatch({ type: DEXC_USER_FAILED, error });
    return;
  }
};

export const DEXC_GETFEE_ATTEMPT = "DEXC_GETFEE_ATTEMPT";
export const DEXC_GETFEE_SUCCESS = "DEXC_GETFEE_SUCCESS";
export const DEXC_GETFEE_FAILED = "DEXC_GETFEE_FAILED";

export const getFeeDexc = (addr) => (dispatch, getState) => {
  dispatch({ type: DEXC_GETFEE_ATTEMPT });
  if (!sel.dexcActive(getState())) {
    dispatch({ type: DEXC_GETFEE_FAILED, error: "Dexc isn't active" });
    return;
  }
  try {
    const res = ipcRenderer.sendSync("get-fee-dexc", addr);
    if (res instanceof Error) {
      throw res;
    } else if (typeof res === "string") {
      if (res.indexOf("error", 0) > -1) {
        throw res;
      }
    }
    dispatch({ type: DEXC_GETFEE_SUCCESS, fee: res, addr });
  } catch (error) {
    dispatch({ type: DEXC_GETFEE_FAILED, error });
    return;
  }
};

export const DEXC_REGISTER_ATTEMPT = "DEXC_REGISTER_ATTEMPT";
export const DEXC_REGISTER_SUCCESS = "DEXC_REGISTER_SUCCESS";
export const DEXC_REGISTER_FAILED = "DEXC_REGISTER_FAILED";

export const registerDexc = (appPass) => (dispatch, getState) => {
  dispatch({ type: DEXC_REGISTER_ATTEMPT });
  if (!sel.dexcActive(getState())) {
    dispatch({ type: DEXC_REGISTER_FAILED, error: "Dexc isn't active" });
    return;
  }
  const {
    dex: { fee, addr }
  } = getState();
  try {
    let res = ipcRenderer.sendSync("register-dexc", appPass, addr, fee);
    if (res instanceof Error) {
      throw res;
    } else if (typeof res === "string") {
      if (res.indexOf("error", 0) > -1) {
        if (res.indexOf("insufficient funds") > -1) {
          res =
            "Insufficient funds in dex account to pay " +
            fee +
            ". Please fund the account, and try again.";
        }
        throw res;
      }
    }
    dispatch({ type: DEXC_REGISTER_SUCCESS });
    // Request current user information
    dispatch(userDexc());
  } catch (error) {
    dispatch({ type: DEXC_REGISTER_FAILED, error });
    return;
  }
};

export const DEXC_LAUNCH_WINDOW_ATTEMPT = "DEXC_LAUNCH_WINDOW_ATTEMPT";
export const DEXC_LAUNCH_WINDOW_SUCCESS = "DEXC_LAUNCH_WINDOW_SUCCESS";
export const DEXC_LAUNCH_WINDOW_FAILED = "DEXC_LAUNCH_WINDOW_FAILED";

export const launchDexcWindow = () => (dispatch, getState) => {
  const {
    dex: { dexServerAddress }
  } = getState();
  dispatch({ type: DEXC_LAUNCH_WINDOW_ATTEMPT });
  if (!sel.dexcActive(getState())) {
    dispatch({ type: DEXC_LAUNCH_WINDOW_FAILED, error: "Dexc isn't active" });
    return;
  }
  try {
    const serverAddress = dexServerAddress;
    const res = ipcRenderer.sendSync("launch-dex-window", serverAddress);
    if (res instanceof Error) {
      throw res;
    } else if (typeof res === "string") {
      if (res.indexOf("error", 0) > -1) {
        throw res;
      }
    }
    dispatch({ type: DEXC_LAUNCH_WINDOW_SUCCESS });
    // Request current user information
    dispatch(userDexc());
  } catch (error) {
    dispatch({ type: DEXC_LAUNCH_WINDOW_FAILED, error });
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
    const res = ipcRenderer.sendSync("check-btc-config");
    if (res instanceof Error) {
      throw res;
    } else if (typeof res === "string") {
      if (res.indexOf("error", 0) > -1) {
        throw res;
      }
    }
    if (
      res.rpcuser &&
      res.rpcpassword &&
      ((!isTestNet(getState()) && !res.test && res.rpcbind && res.rpcport) ||
        (isTestNet(getState()) &&
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
    const rpcport = isTestNet(getState()) ? "18332" : "8332";
    const testnet = isTestNet(getState());
    const res = ipcRenderer.sendSync(
      "update-btc-config",
      rpcuser,
      rpcpassword,
      rpcbind,
      rpcport,
      testnet
    );
    if (res instanceof Error) {
      throw res;
    } else if (typeof res === "string") {
      if (res.indexOf("error", 0) > -1) {
        throw res;
      }
    }
    dispatch({ type: UPDATE_BTC_CONFIG_SUCCESS, btcConfig: res });
  } catch (error) {
    dispatch({ type: UPDATE_BTC_CONFIG_FAILED, error });
    return;
  }
};

export const CREATEDEXACCOUNT_ATTEMPT = "CREATEDEXACCOUNT_ATTEMPT";
export const CREATEDEXACCOUNT_FAILED = "CREATEDEXACCOUNT_FAILED";
export const CREATEDEXACCOUNT_SUCCESS = "CREATEDEXACCOUNT_SUCCESS";

export const createDexAccount = (passphrase, accountName) => (
  dispatch,
  getState
) => {
  const {
    daemon: { walletName }
  } = getState();
  const walletConfig = getWalletCfg(isTestNet(getState()), walletName);
  dispatch({ type: CREATEDEXACCOUNT_ATTEMPT });
  return wallet
    .getNextAccount(sel.walletService(getState()), passphrase, accountName)
    .then(() => {
      dispatch({ dexAccount: accountName, type: CREATEDEXACCOUNT_SUCCESS });
      walletConfig.set(configConstants.DEX_ACCOUNT, accountName);
    })
    .catch((error) => dispatch({ error, type: CREATEDEXACCOUNT_FAILED }));
};
