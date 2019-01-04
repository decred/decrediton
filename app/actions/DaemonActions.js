import { versionCheckAction, syncCancel } from "./WalletLoaderActions";
import { stopNotifcations } from "./NotificationActions";
import { saveSettings, updateStateSettingsChanged } from "./SettingsActions";
import { rescanCancel } from "./ControlActions";
import { cancelPingAttempt } from "./ClientActions";
import { semverCompatible } from "./VersionActions";
import * as wallet from "wallet";
import { push as pushHistory, goBack } from "react-router-redux";
import { ipcRenderer } from "electron";
import { setMustOpenForm, getWalletCfg, getAppdataPath, getRemoteCredentials, getGlobalCfg, setLastHeight } from "../config";
import { isTestNet } from "selectors";
import axios from "axios";
import { STANDARD_EXTERNAL_REQUESTS } from "main_dev/externalRequests";
import { DIFF_CONNECTION_ERROR } from "main_dev/constants";
import { enableTrezor } from "./TrezorActions";

export const DECREDITON_VERSION = "DECREDITON_VERSION";
export const SELECT_LANGUAGE = "SELECT_LANGUAGE";
export const FINISH_TUTORIAL = "FINISH_TUTORIAL";
export const FINISH_PRIVACY = "FINISH_PRIVACY";
export const FINISH_SPVCHOICE = "FINISH_SPVCHOICE";
export const DAEMONSTARTED = "DAEMONSTARTED";
export const DAEMONSTARTED_APPDATA = "DAEMONSTARTED_APPDATA";
export const DAEMONSTARTED_REMOTE = "DAEMONSTARTED_REMOTE";
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
  config.set("locale", selectedLanguage.language);
  config.set("set_language", false);
  dispatch({ language: selectedLanguage.language, type: SELECT_LANGUAGE });
  dispatch(pushHistory("/getstarted"));
};

export const finishSpvChoice = () => (dispatch) => {
  const config = getGlobalCfg();
  config.set("show_spvchoice", false);
  dispatch({ type: FINISH_SPVCHOICE });
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

export const startDaemon = (rpcCreds, appData) => (dispatch, getState) => {
  const { daemonStarted } = getState().daemon;
  if (daemonStarted) return;
  if (rpcCreds) {
    dispatch({ type: DAEMONSTARTED_REMOTE, credentials: rpcCreds, pid: -1 });
    dispatch(syncDaemon());
  } else if (appData) {
    wallet.startDaemon(appData, isTestNet(getState()))
      .then(rpcCreds => {
        dispatch({ type: DAEMONSTARTED_APPDATA, appData: appData, credentials: rpcCreds });
        dispatch(syncDaemon(null, appData));
      })
      .catch((err) => dispatch({ err, type: DAEMONSTARTED_ERROR }));
  } else {
    wallet.startDaemon(null, isTestNet(getState()))
      .then(rpcCreds => {
        dispatch({ type: DAEMONSTARTED, credentials: rpcCreds });
        dispatch(syncDaemon());
      })
      .catch(() => dispatch({ type: DAEMONSTARTED_ERROR }));
  }
};

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

export const getAvailableWallets = () => async (dispatch, getState) => {
  const { currentSettings } = getState().settings;
  const network = currentSettings.network;
  const availableWallets = await wallet.getAvailableWallets(network);
  const previousWallet = await wallet.getPreviousWallet();
  dispatch({ availableWallets, previousWallet, type: AVAILABLE_WALLETS });
  return { availableWallets, previousWallet };
};

export const removeWallet = (selectedWallet) => (dispatch) => {
  wallet.removeWallet(selectedWallet.value.wallet, selectedWallet.network == "testnet")
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
  wallet.createNewWallet(selectedWallet.value.wallet, network == "testnet")
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

export const startWallet = (selectedWallet) => (dispatch, getState) => {
  const { currentSettings } = getState().settings;
  const network = currentSettings.network;
  wallet.startWallet(selectedWallet.value.wallet, network == "testnet")
    .then(({ port }) => {
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
      setTimeout(()=>dispatch(versionCheckAction()), 2000);
    })
    .catch((err) => {
      console.log(err);
      dispatch({ type: DAEMONSTARTED_ERROR });
    });
};

export const prepStartDaemon = () => (dispatch, getState) => {
  const { daemon: { daemonAdvanced, openForm, walletName } } = getState();
  dispatch(registerForErrors());
  dispatch(checkDecreditonVersion());
  if (!daemonAdvanced) {
    dispatch(startDaemon());
    return;
  }
  if (!walletName) {
    return;
  }
  const { rpc_password, rpc_user, rpc_cert, rpc_host, rpc_port } = getRemoteCredentials();
  const hasAllCredentials = rpc_password && rpc_user && rpc_password.length > 0 && rpc_user.length > 0 && rpc_cert.length > 0 && rpc_host.length > 0 && rpc_port.length > 0;
  const hasAppData = getAppdataPath() && getAppdataPath().length > 0;

  if(hasAllCredentials && hasAppData)
    this.props.setCredentialsAppdataError();

  if (!openForm && hasAppData) {
    dispatch(startDaemon(null, getAppdataPath()));
  } else if (!openForm && hasAllCredentials) {
    dispatch(startDaemon(getRemoteCredentials()));
  }
};

export const STARTUPBLOCK = "STARTUPBLOCK";
export const syncDaemon = () =>
  (dispatch, getState) => {
    const updateBlockCount = async () => {
      const { daemon: { daemonSynced, timeStart, blockStart, credentials, daemonError, neededBlocks, networkMatch } } = getState();
      // check to see if user skipped;
      if (daemonSynced || daemonError) return;
      if (!networkMatch) {
        const daemonInfo = await wallet.getDaemonInfo(credentials);
        if (daemonInfo.isTestNet !== null &&
            daemonInfo.isTestNet !== isTestNet(getState())) {
          dispatch({ error: DIFF_CONNECTION_ERROR, type: NOT_SAME_CONNECTION });
          return dispatch(pushHistory("/error"));
        } else if (daemonInfo.isTestNet !== null && daemonInfo.isTestNet == isTestNet(getState())) {
          dispatch({ type: NETWORK_MATCH });
        }
      }
      return wallet
        .getBlockCount(credentials, isTestNet(getState()))
        .then(( blockChainInfo ) => {
          const blockCount = blockChainInfo.blockCount;
          const syncHeight = blockChainInfo.syncHeight;
          if (neededBlocks != 0 && blockCount >= syncHeight) {
            dispatch({ type: DAEMONSYNCED });
            dispatch({ currentBlockHeight: blockCount, type: STARTUPBLOCK });
            setMustOpenForm(false);
            return;
          } else if (neededBlocks !== 0 && blockCount !== 0 && syncHeight !== 0) {
            const blocksLeft = syncHeight - blockCount;
            const blocksDiff = blockCount - blockStart;
            if (timeStart !== 0 && blockStart !== 0 && blocksDiff !== 0) {
              const currentTime = new Date();
              const timeSyncing = (currentTime - timeStart) / 1000;
              const secondsLeft = Math.round(blocksLeft / blocksDiff * timeSyncing);
              dispatch({
                currentBlockCount: blockCount,
                timeLeftEstimate: secondsLeft,
                type: DAEMONSYNCING_PROGRESS });
            }
          } else if (blockCount && syncHeight && blockCount !== 0 && syncHeight !== 0) {
            dispatch({ syncHeight: syncHeight, currentBlockCount: blockCount, timeStart: new Date(), blockStart: blockCount, type: DAEMONSYNCING_START });
          }
          setTimeout(updateBlockCount, 1000);
        }).catch(err=>console.log(err));
    };
    updateBlockCount();
  };

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
