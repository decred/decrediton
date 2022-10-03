import {
  syncCancel,
  setSelectedWallet,
  openWalletAttempt,
  SET_SHOW_STAKING_WARNING
} from "./WalletLoaderActions";
import { getVersionServiceAttempt, semverCompatible } from "./VersionActions";
import { stopNotifcations } from "./NotificationActions";
import { saveSettings, updateStateSettingsChanged } from "./SettingsActions";
import { rescanCancel, showCantCloseModal } from "./ControlActions";
import { enableTrezor } from "./TrezorActions";
import {
  DEX_LOGOUT_ATTEMPT,
  DEX_LOGOUT_SUCCESS,
  DEX_LOGOUT_FAILED,
  logoutDex
} from "./DexActions";
import {
  TOGGLE_ISLEGACY,
  SET_REMEMBERED_VSP_HOST,
  SET_AUTOBUYER_SETTINGS
} from "./VSPActions";
import { wallet, fs } from "wallet-preload-shim";
import { push as pushHistory, goBack } from "connected-react-router";
import { isTestNet } from "selectors";
import { getJSON } from "helpers/fetch";
import { STANDARD_EXTERNAL_REQUESTS } from "constants";
import { DIFF_CONNECTION_ERROR, LOCALE, TESTNET } from "constants";
import * as cfgConstants from "constants/config";
import { CSPP_URL, CSPP_URL_LEGACY } from "constants";

export const DECREDITON_VERSION = "DECREDITON_VERSION";
export const SELECT_LANGUAGE = "SELECT_LANGUAGE";
export const FINISH_TUTORIAL = "FINISH_TUTORIAL";
export const SET_VISITED_TUTORIAL_TABS = "SET_VISITED_TUTORIAL_TABS";
export const FINISH_PRIVACY = "FINISH_PRIVACY";
export const FINISH_SPVCHOICE = "FINISH_SPVCHOICE";
export const DAEMONSTART_ATTEMPT = "DAEMONSTART_ATTEMPT";
export const DAEMONSTART_SUCCESS = "DAEMONSTART_SUCCESS";
export const DAEMONSTART_FAILURE = "DAEMONSTART_FAILURE";
export const DAEMONSTOPPED = "DAEMONSTOPPED";
export const DAEMONSYNCING_START = "DAEMONSYNCING_START";
export const DAEMONSYNCING_PROGRESS = "DAEMONSYNCING_PROGRESS";
export const DAEMONSYNCED = "DAEMONSYNCED";
export const WALLETREADY = "WALLETREADY";
export const WALLETREMOVED = "WALLETREMOVED";
export const WALLETREMOVED_FAILED = "WALLETREMOVED_FAILED";
export const AVAILABLE_WALLETS = "AVAILABLE_WALLETS";
export const SHUTDOWN_REQUESTED = "SHUTDOWN_REQUESTED";
export const REGISTERFORERRORS = "REGISTERFORERRORS";
export const DAEMON_ERROR = "DAEMON_ERROR";
export const DAEMON_WARNING = "DAEMON_WARNING";
export const WALLET_ERROR = "WALLET_ERROR";
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
export const CREATE_WALLET_ERROR = "CREATE_WALLET_ERROR";
export const CREATE_WALLET_ATTEMPT = "CREATE_WALLET_ATTEMPT";

export const checkDecreditonVersion = () => (dispatch, getState) => {
  const detectedVersion = getState().daemon.appVersion;
  const releaseApiURL =
    "https://api.github.com/repos/decred/decrediton/releases";
  getJSON(releaseApiURL)
    .then(function (response) {
      const currentVersion = response.data[0].tag_name.split("v")[1];
      if (semverCompatible(currentVersion, detectedVersion)) {
        wallet.log("info", "Decrediton version up to date.");
      } else {
        dispatch({ type: DECREDITON_VERSION, msg: response.data[0].tag_name });
      }
    })
    .catch(function (error) {
      console.error(
        "Unable to check latest decrediton release version.",
        error
      );
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

// toggleSpv enables and disables spv in decrediton when first starting.
export const toggleSpv = (isSPV) => async (dispatch, getState) => {
  dispatch(updateStateSettingsChanged({ spvMode: isSPV }, true));
  const tempSettings = getState().settings.tempSettings;
  const config = wallet.getGlobalCfg();
  config.set(cfgConstants.SHOW_SPV_CHOICE, false);

  await dispatch(saveSettings(tempSettings));
  dispatch({ type: FINISH_SPVCHOICE });
  dispatch(goBack());
};

export const setupStandardPrivacy = () => (dispatch, getState) => {
  dispatch(
    updateStateSettingsChanged({
      allowedExternalRequests: STANDARD_EXTERNAL_REQUESTS
    })
  );
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
  const config = wallet.getGlobalCfg();
  config.set(LOCALE, selectedLanguage.language);
  config.set(cfgConstants.SET_LANGUAGE, false);
  dispatch({ language: selectedLanguage.language, type: SELECT_LANGUAGE });
  dispatch(pushHistory("/getstarted"));
};

export const finishTutorial = () => (dispatch) => {
  const config = wallet.getGlobalCfg();
  config.set(cfgConstants.SHOW_TUTORIAL, false);
  dispatch({ type: FINISH_TUTORIAL });
  dispatch(pushHistory("/getstarted"));
};

export const setVisitedTutorialTabs = (visitedTabs) => (dispatch) => {
  const config = wallet.getGlobalCfg();
  config.set(cfgConstants.VISITED_TUTORIAL_TABS, visitedTabs);
  dispatch({ type: SET_VISITED_TUTORIAL_TABS, visitedTabs });
};

export const finishPrivacy = () => (dispatch) => {
  const config = wallet.getGlobalCfg();
  config.set(cfgConstants.SHOW_PRIVACY, false);
  dispatch({ type: FINISH_PRIVACY });
  dispatch(goBack());
};

export const startDaemon = (params) => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    const { daemonStarted, daemonStarting } = getState().daemon;
    // we only consider dcrd as started when it has valid peers, but dcrd can
    // be started doing a long process (like a db upgrade), so we check is it
    // is starting, before dispatching a new DAEMONSTART_ATTEMPT.
    if (daemonStarting) {
      return;
    }
    dispatch({ type: DAEMONSTART_ATTEMPT });
    if (daemonStarted) {
      return dispatch({ type: DAEMONSTART_SUCCESS });
    }

    return wallet
      .startDaemon(params, isTestNet(getState()))
      .then((started) => {
        const rpcCreds = {
          rpc_user: started.rpc_user,
          rpc_pass: started.rpc_pass,
          rpc_cert: started.rpc_cert,
          rpc_host: started.rpc_host,
          rpc_port: started.rpc_port
        };
        const appdata = started.dcrdAppdata;
        dispatch({ type: DAEMONSTART_SUCCESS, credentials: rpcCreds, appdata });
        resolve({ appdata, credentials: rpcCreds });
      })
      .catch((err) => {
        dispatch({ err, type: DAEMONSTART_FAILURE });
        reject(err);
      });
  });

export const registerForErrors = () => (dispatch) => {
  dispatch({ type: REGISTERFORERRORS });
  wallet.onErrorReceived((event, daemon, error) => {
    if (daemon) {
      dispatch({ error, type: DAEMON_ERROR });
    } else {
      dispatch({ error, type: WALLET_ERROR });
    }
  });
  wallet.onWarningReceived((event, daemon, warning) => {
    if (daemon) {
      dispatch({ warning, type: DAEMON_WARNING });
    } else {
      dispatch({ warning, type: WALLET_WARNING });
    }
  });
};

export const backToCredentials = () => (dispatch) => {
  dispatch(pushHistory("/getstarted"));
};

export const deleteDaemonData = () => (dispatch, getState) => {
  const { appData } = getState().daemon;
  dispatch({ type: DELETE_DCRD_ATTEMPT });
  wallet
    .deleteDaemonData(appData, isTestNet(getState()))
    .then(() => {
      dispatch({ type: DELETE_DCRD_SUCCESS });
      dispatch(shutdownApp());
    })
    .catch((err) => dispatch({ err, type: DELETE_DCRD_FAILED }));
};

export const finalShutdown = () => (dispatch, getState) => {
  const { currentBlockHeight } = getState().grpc;
  if (currentBlockHeight) {
    wallet.setLastHeight(currentBlockHeight);
  }
  dispatch({ type: SHUTDOWN_REQUESTED });
  wallet.onDaemonStopped(() => dispatch({ type: DAEMONSTOPPED }));
  dispatch(stopNotifcations());
  dispatch(rescanCancel());
  dispatch(syncCancel());
  dispatch(pushHistory("/shutdown"));
};

export const shutdownApp = () => async (dispatch, getState) => {
  const { loggedIn } = getState().dex;
  try {
    if (loggedIn) {
      dispatch({ type: DEX_LOGOUT_ATTEMPT });
      await logoutDex();
      dispatch({ type: DEX_LOGOUT_SUCCESS });
    }
    return dispatch(finalShutdown());
  } catch (error) {
    const openOrder =
      String(error).indexOf("cannot log out with active orders", 0) > -1;
    dispatch({ type: DEX_LOGOUT_FAILED, error, openOrder });
    dispatch(showCantCloseModal());
  }
};

export const cleanShutdown = () => () => wallet.cleanShutdown();

export const getAvailableWallets = () => (dispatch, getState) =>
  new Promise((resolve, reject) => {
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
      .catch((err) => reject(err));
  });

export const removeWallet = (selectedWallet) => (dispatch) => {
  wallet
    .removeWallet(
      selectedWallet.value.wallet,
      selectedWallet.network == TESTNET
    )
    .then(() => {
      dispatch({ type: WALLETREMOVED });
      dispatch(getAvailableWallets());
    })
    .catch((err) => {
      console.error(err);
      dispatch({ error: err, type: WALLETREMOVED_FAILED });
    });
};

// createWallet creates a new wallet directory and its config, so we can start
// a wallet creation. It does not create the wallet.db file, which is done
// later in the wallet creation proccess.
// selectedWallet is of the form
// selectedWallet = {
//   label: newWalletName,
//   value: {
//    wallet: newWalletName, isWatchingOnly, isTrezor, isNew,
//    network: isTestNet ? "testnet" : "mainnet"
//  }
// }
export const createWallet = (selectedWallet) => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    dispatch({ type: CREATE_WALLET_ATTEMPT });
    const createWalletAsync = async () => {
      const { currentSettings } = getState().settings;
      const network = currentSettings.network;
      try {
        await wallet.createNewWallet(
          selectedWallet.value.wallet,
          network == TESTNET
        );
        try {
          await dispatch(startWallet(selectedWallet));
        } catch (error) {
          // This error message happens if we start creating a wallet. As its
          // wallet.db file still not created.
          if (!error.message.includes("missing database file")) {
            throw error;
          }
        }
        dispatch({
          isWatchingOnly: selectedWallet.value.isWatchingOnly,
          createNewWallet: selectedWallet.value.isNew,
          isTrezor: selectedWallet.value.istrezor,
          type: WALLETCREATED
        });
        dispatch(setSelectedWallet(selectedWallet));
        const walletCfg = wallet.getWalletCfg(
          network == TESTNET,
          selectedWallet.value.wallet
        );
        walletCfg.set(
          cfgConstants.WALLET_CREATED_AS_NEW,
          !!selectedWallet.value.isNew
        );
        if (
          selectedWallet.value.gapLimit &&
          selectedWallet.value.gapLimit > 0
        ) {
          walletCfg.set(cfgConstants.GAP_LIMIT, selectedWallet.value.gapLimit);
        }
        resolve(selectedWallet);
      } catch (err) {
        dispatch({ type: CREATE_WALLET_ERROR });
        reject(err);
      }
    };

    createWalletAsync()
      .then((r) => resolve(r))
      .catch((err) => reject(err));
  });

export const CLOSEDAEMON_ATTEMPT = "CLOSEDAEMON_ATTEMPT";
export const CLOSEDAEMON_FAILED = "CLOSEDAEMON_FAILED";
export const CLOSEDAEMON_SUCCESS = "CLOSEDAEMON_SUCCESS";

export const closeDaemonRequest = () => async (dispatch, getState) => {
  dispatch({ type: CLOSEDAEMON_ATTEMPT });
  try {
    await wallet.stopDaemon();
    const { currentSettings } = getState().settings;
    dispatch({
      advanced: currentSettings.daemonStartAdvanced,
      type: CLOSEDAEMON_SUCCESS
    });
  } catch (error) {
    dispatch({ error, type: CLOSEDAEMON_FAILED });
    dispatch(pushHistory("/error"));
  }
};

export const startWallet = (selectedWallet, hasPassPhrase) => (
  dispatch,
  getState
) =>
  new Promise((resolve, reject) => {
    const start = async () => {
      const { currentSettings } = getState().settings;
      const network = currentSettings.network;

      // if selected wallet is not send in the call of the method,
      // it probably means it is a refresh, so we get the selected wallet
      // stored in ipc memory.
      if (!selectedWallet) {
        selectedWallet = wallet.getSelectedWallet();
      }
      const isTestnet = network == "testnet";
      const walletCfg = wallet.getWalletCfg(
        isTestnet,
        selectedWallet.value.wallet
      );

      const enableDex = walletCfg.get(cfgConstants.ENABLE_DEX);
      const dexReady = walletCfg.get(cfgConstants.DEX_READY);
      const dexAccount = walletCfg.get(cfgConstants.DEX_ACCOUNT);
      const askDexBtcSpv = walletCfg.get(cfgConstants.ASK_DEX_BTC_SPV);
      const confirmDexSeed = walletCfg.get(cfgConstants.CONFIRM_DEX_SEED);
      const dexBtcSpv = walletCfg.get(cfgConstants.DEX_BTC_SPV);
      const btcWalletName = walletCfg.get(cfgConstants.BTCWALLET_NAME);
      let rpcCreds = {};
      if (enableDex) {
        rpcCreds = {
          rpcUser: walletCfg.get(cfgConstants.DEXWALLET_RPCUSERNAME),
          rpcPass: walletCfg.get(cfgConstants.DEXWALLET_RPCPASSWORD),
          rpcListen: walletCfg.get(cfgConstants.DEXWALLET_HOSTPORT),
          rpcCert: fs.joinPaths(
            wallet.getWalletPath(isTestnet, selectedWallet.value.wallet),
            "rpc.cert"
          )
        };
      }

      // Check to see if wallet config has old cspp.decred.org setting, will
      // update to mix.decred.org
      const currentCSPP = walletCfg.get(cfgConstants.CSPP_SERVER);
      if (currentCSPP == CSPP_URL_LEGACY) {
        walletCfg.set(cfgConstants.CSPP_SERVER, CSPP_URL);
      }

      const walletStarted = await wallet.startWallet(
        selectedWallet.value.wallet,
        isTestnet,
        rpcCreds,
        selectedWallet.value.gapLimit,
        selectedWallet.value.disableCoinTypeUpgrades
      );
      const { port } = walletStarted;
      wallet.setPreviousWallet(selectedWallet);

      // TODO clean up this found stakepool
      // we will not need to save at the config the current stakepool
      // anymore as now it is not needed to register into one.
      // we can save a favorite vsp, though.
      const currentStakePoolConfig = walletCfg.get(cfgConstants.STAKEPOOLS);
      let firstConfiguredStakePool = null;
      if (currentStakePoolConfig !== undefined) {
        for (let i = 0; i < currentStakePoolConfig.length; i++) {
          if (
            currentStakePoolConfig[i].ApiKey &&
            currentStakePoolConfig[i].Network == network
          ) {
            firstConfiguredStakePool = currentStakePoolConfig[i];
            break;
          }
        }
      }
      const walletName = selectedWallet.value.wallet;
      const gapLimit = walletCfg.get(cfgConstants.GAP_LIMIT);
      const hiddenAccounts = walletCfg.get(cfgConstants.HIDDEN_ACCOUNTS);
      const currencyDisplay = walletCfg.get(cfgConstants.CURRENCY_DISPLAY);
      const balanceToMaintain = walletCfg.get(cfgConstants.BALANCE_TO_MAINTAIN);
      const discoverAccountsComplete = walletCfg.get(
        cfgConstants.DISCOVER_ACCOUNTS
      );
      const selectedStakePool = firstConfiguredStakePool;
      const lastPoliteiaAccessTime = walletCfg.get(
        cfgConstants.POLITEIA_LAST_ACCESS_TIME
      );
      const lastPoliteiaAccessBlock = walletCfg.get(
        cfgConstants.POLITEIA_LAST_ACCESS_BLOCK
      );
      const dismissBackupRedeemScript = walletCfg.get(
        cfgConstants.DISMISS_BACKUP_MSG_REDEEM_SCRIPT
      );
      const enablePrivacy = walletCfg.get(cfgConstants.ENABLE_PRIVACY);
      const sendFromUnmixed = walletCfg.get(cfgConstants.SEND_FROM_UNMIXED);
      const mixedAccount = walletCfg.get(cfgConstants.MIXED_ACCOUNT_CFG);
      const changeAccount = walletCfg.get(cfgConstants.CHANGE_ACCOUNT_CFG);
      const csppServer = walletCfg.get(cfgConstants.CSPP_SERVER);
      const csppPort = walletCfg.get(cfgConstants.CSPP_PORT);
      const mixedAccountBranch = walletCfg.get(cfgConstants.MIXED_ACC_BRANCH);
      const isLegacy = walletCfg.get(cfgConstants.VSP_IS_LEGACY);
      const rememberedVspHost = walletCfg.get(cfgConstants.REMEMBERED_VSP_HOST);
      const needsVSPdProcessManaged = walletCfg.get(
        cfgConstants.NEEDS_VSPD_PROCESS_TICKETS
      );
      const showStakingWarning = walletCfg.get(
        cfgConstants.SHOW_STAKING_WARNING
      );

      const autobuyerSettings = walletCfg.get(cfgConstants.AUTOBUYER_SETTINGS);
      dispatch({
        type: SET_AUTOBUYER_SETTINGS,
        autobuyerSettings
      });

      walletCfg.set(cfgConstants.LAST_ACCESS, Date.now());
      dispatch({
        type: WALLETREADY,
        walletName,
        network,
        hiddenAccounts,
        port,
        lastPoliteiaAccessTime,
        lastPoliteiaAccessBlock
      });
      dispatch({ type: WALLET_AUTOBUYER_SETTINGS, balanceToMaintain });
      dispatch({ type: WALLET_SETTINGS, currencyDisplay, gapLimit });
      dispatch({ type: TOGGLE_ISLEGACY, isLegacy });
      dispatch({ type: SET_REMEMBERED_VSP_HOST, rememberedVspHost });
      dispatch({
        type: WALLET_STAKEPOOL_SETTINGS,
        selectedStakePool,
        currentStakePoolConfig,
        dismissBackupRedeemScript
      });
      dispatch({ type: SET_SHOW_STAKING_WARNING, showStakingWarning });
      const needsPassPhrase = !discoverAccountsComplete && !hasPassPhrase;
      dispatch({
        type: WALLET_LOADER_SETTINGS,
        discoverAccountsComplete,
        needsPassPhrase,
        enablePrivacy,
        sendFromUnmixed,
        mixedAccount,
        changeAccount,
        csppServer,
        csppPort,
        mixedAccountBranch,
        enableDex,
        dexReady,
        dexAccount,
        rpcCreds,
        btcWalletName,
        needsVSPdProcessManaged,
        askDexBtcSpv,
        dexBtcSpv,
        confirmDexSeed
      });
      selectedWallet.value.isTrezor && dispatch(enableTrezor());
      await dispatch(getVersionServiceAttempt());
      await dispatch(openWalletAttempt("", false, selectedWallet));
      return discoverAccountsComplete;
    };

    // TODO better treat errors here. Errors can fail silently.
    start()
      .then((discoverAccountsComplete) => resolve(discoverAccountsComplete))
      .catch((err) => reject(err));
  });

export const decreditonInit = () => (dispatch) => {
  dispatch(registerForErrors());
  dispatch(checkDecreditonVersion());
};

const TIME_TO_TIMEOUT = 15 * 1000; // 15 sec
export const connectDaemon = (rpcCreds, daemonRemote) => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    dispatch({ type: CONNECTDAEMON_ATTEMPT });
    const timeBeforeConnect = new Date();
    const tryConnect = async () => {
      const {
        daemonConnected,
        credentials,
        daemonError,
        daemonWarning,
        timeStart
      } = getState().daemon;
      const creds = rpcCreds ? rpcCreds : credentials;
      const timeNow = new Date();
      const timeElapsed = timeNow - timeBeforeConnect;
      // We do not consider timeout if has a warning as it probably means dcrd
      // is reindexing or upgrading its database.
      if (!daemonWarning && timeStart === 0 && timeElapsed >= TIME_TO_TIMEOUT) {
        const error = "timeout exceed";
        dispatch({ type: CONNECTDAEMON_FAILURE, daemonTimeout: true, error });
        return reject(error);
      }
      if (daemonConnected || daemonError) return;
      try {
        const connected = await wallet.connectDaemon({
          rpcCreds: creds,
          testnet: isTestNet(getState())
        });
        dispatch({ type: CONNECTDAEMON_SUCCESS, daemonRemote });
        resolve(connected);
      } catch (err) {
        const { error } = err;
        if (error && error.code === "ECONNREFUSED") {
          setTimeout(tryConnect, 1000);
        } else if (daemonWarning) {
          // If we have a warning we wait 3 seconds instead of 1 to retry
          // connecting, as it may be reindexing the blockchain.
          setTimeout(tryConnect, 3000);
        } else {
          dispatch({ type: CONNECTDAEMON_FAILURE, error });
          reject(err);
        }
      }
    };
    tryConnect();
  });

export const checkNetworkMatch = () => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    dispatch({ type: CHECK_NETWORKMATCH_ATTEMPT });
    wallet
      .getDaemonInfo()
      .then((daemonInfo) => {
        if (
          daemonInfo.isTestnet !== null &&
          daemonInfo.isTestnet !== isTestNet(getState())
        ) {
          dispatch({
            error: DIFF_CONNECTION_ERROR,
            type: CHECK_NETWORKMATCH_FAILED
          });
          wallet.dropDcrd();
          return reject(DIFF_CONNECTION_ERROR);
        }
        dispatch({ daemonInfo, type: CHECK_NETWORKMATCH_SUCCESS });
        resolve(daemonInfo);
      })
      .catch((error) => {
        dispatch({ error, type: CHECK_NETWORKMATCH_FAILED });
        reject(error);
      });
  });

export const syncDaemon = () => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    dispatch({ type: SYNC_DAEMON_ATTEMPT });
    const updateBlockCount = () => {
      const {
        daemon: { daemonSynced, timeStart, blockStart }
      } = getState();
      if (daemonSynced) resolve();
      return wallet
        .getBlockCount()
        .then((blockChainInfo) => {
          const { blockCount, syncHeight } = blockChainInfo;
          if (blockCount && syncHeight) {
            if (blockCount >= syncHeight) {
              dispatch({ type: DAEMONSYNCED, blockCount, syncHeight });
              // After this points the refresh will load directly instead of
              // starting, connecting and syncing daemon.
              wallet.setHeightSynced(true);
              dispatch({ type: DAEMONSYNCED, currentBlockHeight: blockCount });
              resolve();
              return;
            }

            if (!blockStart || !timeStart) {
              dispatch({
                syncHeight,
                currentBlockCount: blockCount,
                timeStart: new Date(),
                blockStart: blockCount,
                type: DAEMONSYNCING_START
              });
            } else {
              const blocksLeft = syncHeight - blockCount;
              const blocksDiff = blockCount - blockStart;
              if (blocksDiff !== 0) {
                const currentTime = new Date();
                const timeSyncing = (currentTime - timeStart) / 1000;
                const secondsLeft = Math.round(
                  (blocksLeft / blocksDiff) * timeSyncing
                );
                dispatch({
                  currentBlockCount: blockCount,
                  timeLeftEstimate: secondsLeft,
                  syncHeight,
                  type: DAEMONSYNCING_PROGRESS
                });
              }
            }
          }
          setTimeout(updateBlockCount, 1000);
        })
        .catch((error) => {
          dispatch({ error, type: SYNC_DAEMON_FAILED });
          reject(error);
        });
    };
    updateBlockCount();
  });

export const getDcrdLogs = () => {
  wallet
    .getDcrdLogs()
    .then((logs) => {
      return logs;
    })
    .catch((err) => {
      console.log(err);
      return null, err;
    });
};

export const getDcrdLastLineLogs = () => () =>
  new Promise((resolve, reject) =>
    wallet
      .getDcrdLastLogLine()
      .then((log) => resolve(log))
      .catch((err) => reject(err))
  );

export const getDcrwalletLogs = () => () =>
  new Promise((resolve, reject) =>
    wallet
      .getDcrwalletLastLogLine()
      .then((logs) => resolve(logs))
      .catch((err) => reject(err))
  );

export const getPrivacyLogs = () => () =>
  new Promise((resolve, reject) =>
    wallet
      .getPrivacyLogs()
      .then((logs) => resolve(logs))
      .catch((err) => reject(err))
  );

export const getDecreditonLogs = () => {
  wallet
    .getDecreditonLogs()
    .then((logs) => {
      return logs;
    })
    .catch((err) => {
      console.log(err);
      return null, err;
    });
};

export const getDcrlndLogs = () => {
  wallet
    .getDcrlndLogs()
    .then((logs) => {
      return logs;
    })
    .catch((err) => {
      console.log(err);
      return null, err;
    });
};

export const GET_DEX_LOGS = "GET_DEX_LOGS";
export const getDexLogs = () => (dispatch, getState) =>
  new Promise((resolve, reject) => {
    dispatch({ type: GET_DEX_LOGS });
    const {
      daemon: { walletName }
    } = getState();
    const walletPath = wallet.getWalletPath(isTestNet(getState()), walletName);
    wallet
      .getDexLogs(walletPath)
      .then((logs) => resolve(logs))
      .catch((err) => reject(err));
  });
