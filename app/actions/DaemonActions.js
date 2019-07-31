import { syncCancel } from "./WalletLoaderActions";
import { getVersionServiceAttempt } from "./VersionActions";
import { stopNotifcations } from "./NotificationActions";
import { saveSettings, updateStateSettingsChanged } from "./SettingsActions";
import { rescanCancel } from "./ControlActions";
import { cancelPingAttempt } from "./ClientActions";
import { semverCompatible } from "./VersionActions";
import * as wallet from "wallet";
import { push as pushHistory, goBack } from "react-router-redux";
import { ipcRenderer } from "electron";
import { setMustOpenForm, getWalletCfg, getAppdataPath, getRemoteCredentials, getGlobalCfg, setLastHeight } from "config";
import { isTestNet } from "selectors";
import axios from "axios";
import { STANDARD_EXTERNAL_REQUESTS } from "main_dev/externalRequests";
import { DIFF_CONNECTION_ERROR, LOCALE, TESTNET } from "constants";
import { enableTrezor } from "./TrezorActions";

export const DECREDITON_VERSION = "DECREDITON_VERSION";
export const SELECT_LANGUAGE = "SELECT_LANGUAGE";
export const FINISH_TUTORIAL = "FINISH_TUTORIAL";
export const FINISH_PRIVACY = "FINISH_PRIVACY";
export const FINISH_SPVCHOICE = "FINISH_SPVCHOICE";
export const DAEMONSTART_ATTEMPT = "DAEMONSTART_ATTEMPT";
export const DAEMONSTART_SUCCESS = "DAEMONSTART_SUCCESS";
export const DAEMONSTART_FAILURE = "DAEMONSTART_FAILURE";
export const DAEMONSTARTED_ERROR = "DAEMONSTARTED_ERROR";
export const DAEMONSTOPPED = "DAEMONSTOPPED";
export const DAEMONSYNCING_START = "DAEMONSYNCING_START";
export const DAEMONSYNCING_PROGRESS = "DAEMONSYNCING_PROGRESS";
export const DAEMONSYNCED = "DAEMONSYNCED";
export const WALLETREADY = "WALLETREADY";
export const WALLETREMOVED = "WALLETREMOVED";
export const WALLETREMOVED_FAILED= "WALLETREMOVED_FAILED";
export const AVAILABLE_WALLETS = "AVAILABLE_WALLETS";
export const SHUTDOWN_REQUESTED = "SHUTDOWN_REQUESTED";
export const SET_CREDENTIALS_APPDATA_ERROR = "SET_CREDENTIALS_APPDATA_ERROR";
export const REGISTERFORERRORS = "REGISTERFORERRORS";
export const FATAL_DAEMON_ERROR = "FATAL_DAEMON_ERROR";
export const FATAL_WALLET_ERROR = "FATAL_WALLET_ERROR";
export const DAEMON_WARNING = "DAEMON_WARNING";
export const WALLET_WARNING = "WALLET_WARNING";
export const WALLETCREATED = "WALLETCREATED";
export const WALLET_AUTOBUYER_SETTINGS = "WALLET_AUTOBUYER_SETTINGS";
export const WALLET_STAKEPOOL_SETTINGS = "WALLET_STAKEPOOL_SETTINGS";
export const WALLET_SETTINGS = "WALLET_SETTINGS";
export const WALLET_LOADER_SETTINGS = "WALLET_LOADER_SETTINGS";
export const DELETE_DCRD_ATTEMPT = "DELETE_DCRD_ATTEMPT";
export const DELETE_DCRD_FAILED = "DELETE_DCRD_FAILED";
export const DELETE_DCRD_SUCCESS = "DELETE_DCRD_SUCCESS";
export const NOT_SAME_CONNECTION = "NOT_SAME_CONNECTION";
export const NETWORK_MATCH = "NETWORK_MATCH";
export const CHECK_NETWORKMATCH_ATTEMPT = "CHECK_NETWORKMATCH_ATTEMPT";
export const CHECK_NETWORKMATCH_SUCCESS = "CHECK_NETWORKMATCH_SUCCESS";
export const CHECK_NETWORKMATCH_FAILED = "CHECK_NETWORKMATCH_FAILED";
export const CONNECTDAEMON_ATTEMPT = "CONNECTDAEMON_ATTEMPT";
export const CONNECTDAEMON_SUCCESS = "CONNECTDAEMON_SUCCESS";
export const CONNECTDAEMON_FAILURE = "CONNECTDAEMON_FAILURE";
export const SYNC_DAEMON_ATTEMPT = "SYNC_DAEMON_ATTEMPT";
export const SYNC_DAEMON_FAILED = "SYNC_DAEMON_FAILED";
export const BACK_TO_CREDENTIALS = "BACK_TO_CREDENTIALS";

export const checkDecreditonVersion = () => (dispatch, getState) =>{
  const detectedVersion = getState().daemon.appVersion;
  const releaseApiURL = "https://api.github.com/repos/decred/decrediton/releases";
  axios.get(releaseApiURL, { timeout: 5000 })
    .then(function (response) {
      const currentVersion = response.data[0].tag_name.split("v")[1];
      if (semverCompatible(currentVersion, detectedVersion)) {
        wallet.log("info", "Decrediton version up to date.");
      } else {
        dispatch({ type: DECREDITON_VERSION, msg:  response.data[0].tag_name });
      }
    })
    .catch(function (error) {
      console.log("Unable to check latest decrediton release version.", error);
    });
};

export const showLanguage = () => (dispatch) => {
  dispatch(pushHistory("/getstarted/language"));
};

export const showTutorial = () => (dispatch) => {
  dispatch(pushHistory("/getstarted/tutorial"));
};

export const showGetStarted = () => (dispatch) => {
  dispatch(pushHistory("/getstarted/initial"));
};

export const showSpvChoice = () => (dispatch) => {
  dispatch(pushHistory("/getstarted/spvchoice"));
};

export const showPrivacy = () => (dispatch) => {
  dispatch(pushHistory("/getstarted/privacy"));
};

export const enableSpv = () => (dispatch, getState) => {
  dispatch(updateStateSettingsChanged({ spvMode: true }, true));
  const tempSettings = getState().settings.tempSettings;
  dispatch(saveSettings(tempSettings));
  dispatch(finishSpvChoice());
};

export const disableSpv = () => (dispatch, getState) => {
  dispatch(updateStateSettingsChanged({ spvMode: false }, true));
  const tempSettings = getState().settings.tempSettings;
  dispatch(saveSettings(tempSettings));
  dispatch(finishSpvChoice());
};

export const setupStandardPrivacy = () => (dispatch, getState) => {
  dispatch(updateStateSettingsChanged({ allowedExternalRequests: STANDARD_EXTERNAL_REQUESTS }));
  const tempSettings = getState().settings.tempSettings;
  dispatch(saveSettings(tempSettings));
  dispatch(finishPrivacy());
};

export const setupDisabledPrivacy = () => (dispatch, getState) => {
  dispatch(updateStateSettingsChanged({ allowedExternalRequests: [] }));
  const tempSettings = getState().settings.tempSettings;
  dispatch(saveSettings(tempSettings));
  dispatch(finishPrivacy());
};

export const selectLanguage = (selectedLanguage) => (dispatch) => {
  const config = getGlobalCfg();
  config.set(LOCALE, selectedLanguage.language);
  config.set("set_language", false);
  dispatch({ language: selectedLanguage.language, type: SELECT_LANGUAGE });
  dispatch(pushHistory("/getstarted"));
};

export const finishSpvChoice = () => (dispatch) => {
  const config = getGlobalCfg();
  config.set("show_spvchoice", false);
  dispatch({ type: FINISH_SPVCHOICE });
  dispatch(startDaemon());
  dispatch(goBack());
};

export const finishTutorial = () => (dispatch) => {
  const config = getGlobalCfg();
  config.set("show_tutorial", false);
  dispatch({ type: FINISH_TUTORIAL });
  dispatch(pushHistory("/getstarted"));
};

export const finishPrivacy = () => (dispatch) => {
  const config = getGlobalCfg();
  config.set("show_privacy", false);
  dispatch({ type: FINISH_PRIVACY });
  dispatch(goBack());
};

export const startDaemon = (params) => (dispatch, getState) => new Promise (async (resolve, reject) => {
  const appdata = params && params.appdata;
  dispatch({ type: DAEMONSTART_ATTEMPT });
  const { daemonStarted } = getState().daemon;
  if (daemonStarted) {
    return dispatch({ type: DAEMONSTART_SUCCESS });
  }

  return wallet.startDaemon(params, isTestNet(getState()))
    .then(rpcCreds => {
      dispatch({ type: DAEMONSTART_SUCCESS, credentials: rpcCreds, appdata });
      resolve({ appdata, credentials: rpcCreds });
    })
    .catch((err) => {
      dispatch({ err, type: DAEMONSTART_FAILURE });
      reject(err);
    });
});

export const setCredentialsAppdataError = () => (dispatch) => {
  dispatch({ type: SET_CREDENTIALS_APPDATA_ERROR });
};

export const registerForErrors = () => (dispatch) => {
  dispatch({ type: REGISTERFORERRORS });
  ipcRenderer.sendSync("register-for-errors");
  ipcRenderer.on("error-received", (event, daemon, error) => {
    if (daemon) {
      dispatch({ error, type: FATAL_DAEMON_ERROR });
    } else {
      dispatch({ error, type: FATAL_WALLET_ERROR });
    }
    dispatch(pushHistory("/error"));
  });
  ipcRenderer.on("warning-received", (event, daemon, warning) => {
    if (daemon) {
      dispatch({ warning, type: DAEMON_WARNING });
    } else {
      dispatch({ warning, type: WALLET_WARNING });
    }
  });
};

export const backToCredentials = () => (dispatch) => {
  dispatch({ type: BACK_TO_CREDENTIALS  });
  dispatch(pushHistory("/getstarted"));
};

export const deleteDaemonData = () => (dispatch, getState) => {
  const { appData } = getState().daemon;
  dispatch({ type: DELETE_DCRD_ATTEMPT });
  wallet.deleteDaemonData(appData, isTestNet(getState()))
    .then(() => {
      dispatch({ type: DELETE_DCRD_SUCCESS });
      dispatch(shutdownApp());
    })
    .catch((err) => dispatch({ err, type: DELETE_DCRD_FAILED }));
};

export const shutdownApp = () => (dispatch, getState) => {
  const { currentBlockHeight } = getState().grpc;
  if(currentBlockHeight) {
    setLastHeight(currentBlockHeight);
  }
  dispatch({ type: SHUTDOWN_REQUESTED });
  ipcRenderer.on("daemon-stopped", () => {
    dispatch({ type: DAEMONSTOPPED });
  });
  dispatch(stopNotifcations());
  dispatch(rescanCancel());
  dispatch(cancelPingAttempt());
  dispatch(syncCancel());
  dispatch(pushHistory("/shutdown"));
};

export const cleanShutdown = () => () => wallet.cleanShutdown();

export const getAvailableWallets = () => async (dispatch, getState) => new Promise ((resolve, reject) => {
  const get = async () => {
    const { currentSettings } = getState().settings;
    const network = currentSettings.network;
    const availableWallets = await wallet.getAvailableWallets(network);
    const previousWallet = await wallet.getPreviousWallet();
    return { availableWallets, previousWallet };
  };

  get()
    .then(({ availableWallets, previousWallet }) => {
      dispatch({ availableWallets, previousWallet, type: AVAILABLE_WALLETS });
      resolve({ availableWallets, previousWallet });
    })
    .catch(err => reject(err));
});

export const removeWallet = (selectedWallet) => (dispatch) => {
  wallet.removeWallet(selectedWallet.value.wallet, selectedWallet.network == TESTNET)
    .then(() => {
      dispatch({ type: WALLETREMOVED });
      dispatch(getAvailableWallets());
    })
    .catch((err) => {
      console.error(err);
      dispatch({ error: err, type: WALLETREMOVED_FAILED });
    });
};

export const createWallet = (createNewWallet, selectedWallet) => (dispatch, getState) => {
  const { currentSettings } = getState().settings;
  const network = currentSettings.network;
  wallet.createNewWallet(selectedWallet.value.wallet, network == TESTNET)
    .then(() => {
      dispatch({ createNewWallet, isWatchingOnly: selectedWallet.value.watchingOnly,
        type: WALLETCREATED });
      dispatch(startWallet(selectedWallet));
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: DAEMONSTARTED_ERROR });
    });
};

export const CLOSEDAEMON_ATTEMPT = "CLOSEDAEMON_ATTEMPT";
export const CLOSEDAEMON_FAILED = "CLOSEDAEMON_FAILED";
export const CLOSEDAEMON_SUCCESS = "CLOSEDAEMON_SUCCESS";

export const closeDaemonRequest = () => async(dispatch, getState) => {
  dispatch({ type: CLOSEDAEMON_ATTEMPT });
  try {
    await wallet.stopDaemon();
    const { currentSettings } = getState().settings;
    dispatch({ advanced: currentSettings.daemonStartAdvanced, type: CLOSEDAEMON_SUCCESS });
  } catch (error) {
    dispatch({ error, type: CLOSEDAEMON_FAILED });
    dispatch(pushHistory("/error"));
  }
};

export const startWallet = (selectedWallet) => (dispatch, getState) => new Promise((resolve,reject) => {
  const start = async () => {
    const { currentSettings } = getState().settings;
    const network = currentSettings.network;

    const walletStarted = await wallet.startWallet(selectedWallet.value.wallet, network == "testnet");
    const { port } = walletStarted;
    const walletCfg = getWalletCfg(network == "testnet", selectedWallet.value.wallet);
    wallet.setPreviousWallet(selectedWallet);

    var currentStakePoolConfig = walletCfg.get("stakepools");
    var foundStakePoolConfig = false;
    var firstConfiguredStakePool = null;
    if (currentStakePoolConfig !== undefined) {
      for (var i = 0; i < currentStakePoolConfig.length; i++) {
        if (currentStakePoolConfig[i].ApiKey && currentStakePoolConfig[i].Network == network) {
          foundStakePoolConfig = true;
          firstConfiguredStakePool = currentStakePoolConfig[i];
          break;
        }
      }
    }
    var gapLimit = walletCfg.get("gaplimit");
    var hiddenAccounts = walletCfg.get("hiddenaccounts");
    var currencyDisplay = walletCfg.get("currency_display");
    var balanceToMaintain = walletCfg.get("balancetomaintain");
    var discoverAccountsComplete = walletCfg.get("discoveraccounts");
    var activeStakePoolConfig = foundStakePoolConfig;
    var selectedStakePool = firstConfiguredStakePool;
    walletCfg.set("lastaccess", Date.now());
    dispatch({ type: WALLETREADY, walletName: selectedWallet.value.wallet, network: network, hiddenAccounts, port });
    dispatch({ type: WALLET_AUTOBUYER_SETTINGS, balanceToMaintain });
    dispatch({ type: WALLET_SETTINGS, currencyDisplay, gapLimit });
    dispatch({ type: WALLET_STAKEPOOL_SETTINGS, activeStakePoolConfig, selectedStakePool, currentStakePoolConfig });
    dispatch({ type: WALLET_LOADER_SETTINGS, discoverAccountsComplete });
    selectedWallet.value.isTrezor && dispatch(enableTrezor());
    await dispatch(getVersionServiceAttempt());
    return discoverAccountsComplete;
  };

  start()
    .then(discoverAccountsComplete => {
      resolve (discoverAccountsComplete);
    })
    .catch(err => {
      dispatch({ type: DAEMONSTARTED_ERROR });
      reject(err);
    });
});

export const prepStartDaemon = () => (dispatch, getState) => {
  const { daemon: { daemonAdvanced } } = getState();
  const cliOptions = ipcRenderer.sendSync("get-cli-options");
  dispatch(registerForErrors());
  dispatch(checkDecreditonVersion());
  if (!daemonAdvanced) {
    return;
  }

  let rpc_user, rpc_pass, rpc_cert, rpc_host, rpc_port;
  if (cliOptions.rpcPresent) {
    rpc_user = cliOptions.rpcUser;
    rpc_pass = cliOptions.rpcPass;
    rpc_cert = cliOptions.rpcCert;
    rpc_host = cliOptions.rpcHost;
    rpc_port = cliOptions.rpcPort;
  } else {
    ({ rpc_user, rpc_pass, rpc_cert, rpc_host, rpc_port } = getRemoteCredentials());
  }
  const hasAllCredentials = rpc_pass && rpc_user && rpc_pass.length > 0 && rpc_user.length > 0 && rpc_cert.length > 0 && rpc_host.length > 0 && rpc_port.length > 0;
  const hasAppData = getAppdataPath() && getAppdataPath().length > 0;

  if(hasAllCredentials && hasAppData)
    this.props.setCredentialsAppdataError();
};

const TIME_TO_TIMEOUT = 30 * 1000; // 30 sec
export const connectDaemon = (rpcCreds) => (dispatch, getState) => new Promise((resolve,reject) => {
  dispatch({ type: CONNECTDAEMON_ATTEMPT });
  const timeBeforeConnect = new Date();
  const tryConnect = async () => {
    const { daemonConnected, credentials, daemonError, timeStart } = getState().daemon;
    const creds = rpcCreds ? rpcCreds : credentials;
    const timeNow = new Date();
    const timeElapsed = timeNow - timeBeforeConnect;
    if (timeStart === 0 && timeElapsed >= TIME_TO_TIMEOUT) {
      dispatch({ type: CONNECTDAEMON_FAILURE, daemonTimeout: true, error: "timeout exceed" });
      return;
    }
    if (daemonConnected || daemonError) return;
    try {
      const connected = await wallet.connectDaemon({ rpcCreds: creds, testnet: isTestNet(getState()) });
      dispatch({ type: CONNECTDAEMON_SUCCESS });
      resolve(connected);
    } catch(err) {
      const { error } = err;
      if (error && error.code === "ECONNREFUSED") {
        setTimeout(tryConnect, 1000);
      } else {
        dispatch({ type: CONNECTDAEMON_FAILURE, error });
        reject(err);
      }
    }
  };
  tryConnect();
});

export const checkNetworkMatch = () => async (dispatch, getState) => new Promise((resolve, reject) => {
  dispatch({ type: CHECK_NETWORKMATCH_ATTEMPT });
  wallet.getDaemonInfo()
    .then(daemonInfo => {
      if (daemonInfo.isTestnet !== null &&
      daemonInfo.isTestnet !== isTestNet(getState())) {
        dispatch({ error: DIFF_CONNECTION_ERROR, type: CHECK_NETWORKMATCH_FAILED });
        return dispatch(pushHistory("/error"));
      }
      resolve(daemonInfo);
    })
    .catch(error => {
      dispatch({ error, type: CHECK_NETWORKMATCH_FAILED });
      reject(error);
    });
});

export const syncDaemon = () => (dispatch, getState) => new Promise((resolve) => {
  dispatch({ type: SYNC_DAEMON_ATTEMPT });
  const updateBlockCount = () => {
    const { daemon: { daemonSynced, timeStart, blockStart, daemonError } } = getState();
    if (daemonSynced || daemonError) return;
    return wallet.getBlockCount()
      .then(( blockChainInfo ) => {
        const { blockCount, syncHeight } = blockChainInfo;
        if (blockCount && syncHeight) {
          if (blockCount >= syncHeight) {
            dispatch({ type: DAEMONSYNCED, blockCount, syncHeight });
            setMustOpenForm(false);
            resolve({ type: DAEMONSYNCED, currentBlockHeight: blockCount });
            return;
          }

          if (blockStart === 0) {
            dispatch({
              syncHeight, currentBlockCount: blockCount, timeStart: new Date(), blockStart: blockCount, type: DAEMONSYNCING_START
            });
          } else {
            const blocksLeft = syncHeight - blockCount;
            const blocksDiff = blockCount - blockStart;
            if (blocksDiff !== 0) {
              const currentTime = new Date();
              const timeSyncing = (currentTime - timeStart) / 1000;
              const secondsLeft = Math.round(blocksLeft / blocksDiff * timeSyncing);
              dispatch({
                currentBlockCount: blockCount,
                timeLeftEstimate: secondsLeft,
                type: DAEMONSYNCING_PROGRESS });
            }
          }
        }
        setTimeout(updateBlockCount, 1000);
      })
      .catch( error => {
        console.log(error);
        dispatch({ error, type: SYNC_DAEMON_FAILED });
      });
  };
  updateBlockCount();
});

export const getDcrdLogs = () => {
  wallet.getDcrdLogs()
    .then(logs => {
      return(logs);
    }).catch(
      err=>{
        console.log(err);
        return (null, err);
      });
};

export const getDcrwalletLogs = () => {
  wallet.getDcrwalletLogs()
    .then(logs => {
      return(logs);
    }).catch(
      err=>{
        console.log(err);
        return (null, err);
      });
};

export const getDecreditonLogs = () => {
  wallet.getDecreditonLogs()
    .then(logs => {
      return(logs);
    }).catch(
      err=>{
        console.log(err);
        return (null, err);
      });
};
