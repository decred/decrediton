import { versionCheckAction, startRpcRequestFunc, determineNeededBlocks } from "./WalletLoaderActions";
import { stopNotifcations } from "./NotificationActions";
import * as wallet from "wallet";
import { push as pushHistory } from "react-router-redux";
import { ipcRenderer } from "electron";
import { setMustOpenForm, getWalletCfg, getAppdataPath, getRemoteCredentials, getGlobalCfg } from "config";
import { hideSidebarMenu, showSidebar } from "./SidebarActions";
import { isTestNet } from "selectors";

export const FINISH_TUTORIAL = "FINISH_TUTORIAL";
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
export const AVAILABLE_WALLETS = "AVAILABLE_WALLETS";
export const SHUTDOWN_REQUESTED = "SHUTDOWN_REQUESTED";
export const SET_CREDENTIALS_APPDATA_ERROR = "SET_CREDENTIALS_APPDATA_ERROR";

export const WALLETCREATED = "WALLETCREATED";
export const WALLET_AUTOBUYER_SETTINGS = "WALLET_AUTOBUYER_SETTINGS";
export const WALLET_STAKEPOOL_SETTINGS = "WALLET_STAKEPOOL_SETTINGS";
export const WALLET_SETTINGS = "WALLET_SETTINGS";
export const WALLET_LOADER_SETTINGS = "WALLET_LOADER_SETTINGS";

export const finishTutorial = () => (dispatch) => {
  dispatch(showSidebar());
  dispatch({type: FINISH_TUTORIAL});
};

export const startDaemon = (rpcCreds, appData) => (dispatch, getState) => {
  const { daemonStarted, walletName } = getState().daemon;
  if (daemonStarted) return;
  if (rpcCreds) {
    dispatch({type: DAEMONSTARTED_REMOTE, credentials: rpcCreds, pid: -1});
    dispatch(syncDaemon());
  } else if (appData) {
    wallet.startDaemon(walletName, appData, isTestNet(getState()))
      .then(rpcCreds => {
        dispatch({type: DAEMONSTARTED_APPDATA, appData: appData, credentials: rpcCreds});
        dispatch(syncDaemon(null, appData));
      })
      .catch((err) => dispatch({err, type: DAEMONSTARTED_ERROR}));
  } else {
    wallet.startDaemon(walletName, null, isTestNet(getState()))
      .then(rpcCreds => {
        dispatch({type: DAEMONSTARTED, credentials: rpcCreds});
        dispatch(syncDaemon());
      })
      .catch(() => dispatch({type: DAEMONSTARTED_ERROR}));
  }
};

export const setCredentialsAppdataError = () => (dispatch) => {
  dispatch({type: SET_CREDENTIALS_APPDATA_ERROR});
};

export const shutdownApp = () => (dispatch) => {
  dispatch({type: SHUTDOWN_REQUESTED});
  dispatch(stopNotifcations());
  ipcRenderer.on("daemon-stopped", () => {
    dispatch({type: DAEMONSTOPPED});
  });
  dispatch(hideSidebarMenu());
  dispatch(pushHistory("/shutdown"));
};

export const cleanShutdown = () => () => wallet.cleanShutdown();

export const getAvailableWallets = () => (dispatch) => {
  wallet.getAvailableWallets()
    .then(availableWallets => {
      dispatch({availableWallets, type: AVAILABLE_WALLETS});
    })
    .catch((err) => {
      console.log(err);
    });
};

export const removeWallet = (selectedWallet) => (dispatch) => {
  wallet.removeWallet(selectedWallet.value.wallet, selectedWallet.network == "testnet")
    .then(() => {
      dispatch({type: WALLETREMOVED});
      dispatch(getAvailableWallets());
    })
    .catch((err) => {
      console.log(err);
      dispatch({type: DAEMONSTARTED_ERROR});
    });
};

export const createWallet = (selectedWallet) => (dispatch) => {
  wallet.createNewWallet(selectedWallet.value.wallet, selectedWallet.network == "testnet")
    .then(() => {
      dispatch({type: WALLETCREATED});
      dispatch(startWallet(selectedWallet));
    })
    .catch((err) => {
      console.log(err);
      dispatch({type: DAEMONSTARTED_ERROR});
    });
};

export const startWallet = (selectedWallet) => (dispatch) => {
  wallet.startWallet(selectedWallet.value.wallet, selectedWallet.network == "testnet")
    .then(({port}) => {
      const walletCfg = getWalletCfg(selectedWallet.network == "testnet", selectedWallet.value.wallet);
      const globalCfg = getGlobalCfg();
      globalCfg.set("previouswallet", selectedWallet);

      var currentStakePoolConfig = walletCfg.get("stakepools");
      var foundStakePoolConfig = false;
      var firstConfiguredStakePool = null;
      if (currentStakePoolConfig !== undefined) {
        for (var i = 0; i < currentStakePoolConfig.length; i++) {
          if (currentStakePoolConfig[i].ApiKey && currentStakePoolConfig[i].Network == selectedWallet.network) {
            foundStakePoolConfig = true;
            firstConfiguredStakePool = currentStakePoolConfig[i];
            break;
          }
        }
      }
      var hiddenAccounts = walletCfg.get("hiddenaccounts");
      var currencyDisplay = walletCfg.get("currency_display");
      var balanceToMaintain = walletCfg.get("balancetomaintain");
      var maxFee = walletCfg.get("maxfee");
      var maxPriceAbsolute = walletCfg.get("maxpriceabsolute");
      var maxPriceRelative = walletCfg.get("maxpricerelative");
      var maxPerBlock = walletCfg.get("maxperblock");
      var discoverAccountsComplete = walletCfg.get("discoveraccounts");
      var activeStakePoolConfig = foundStakePoolConfig;
      var selectedStakePool = firstConfiguredStakePool;
      dispatch({type: WALLETREADY, walletName: selectedWallet.value.wallet, network: selectedWallet.network, hiddenAccounts, port});
      dispatch({type: WALLET_AUTOBUYER_SETTINGS, balanceToMaintain, maxFee, maxPriceAbsolute, maxPriceRelative, maxPerBlock});
      dispatch({type: WALLET_SETTINGS, currencyDisplay});
      dispatch({type: WALLET_STAKEPOOL_SETTINGS, activeStakePoolConfig, selectedStakePool, currentStakePoolConfig});
      dispatch({type: WALLET_LOADER_SETTINGS, discoverAccountsComplete});
      setTimeout(()=>dispatch(versionCheckAction()), 2000);
      setTimeout(()=>dispatch(determineNeededBlocks()), 2000);
    })
    .catch((err) => {
      console.log(err);
      dispatch({type: DAEMONSTARTED_ERROR});
    });
};

export const prepStartDaemon = () => (dispatch, getState) => {
  const { daemon: { daemonAdvanced, openForm, walletName } } = getState();
  if (!daemonAdvanced) {
    dispatch(startDaemon());
    return;
  }
  const {rpc_password, rpc_user, rpc_cert, rpc_host, rpc_port} = getRemoteCredentials(isTestNet(getState()), walletName);
  const hasAllCredentials = rpc_password.length > 0 && rpc_user.length > 0 && rpc_cert.length > 0 && rpc_host.length > 0 && rpc_port.length > 0;
  const hasAppData = getAppdataPath(isTestNet(getState()), walletName) && getAppdataPath(isTestNet(getState()), walletName).length > 0;

  if(hasAllCredentials && hasAppData)
    this.props.setCredentialsAppdataError();

  if (!openForm && hasAppData) {
    dispatch(startDaemon(null, getAppdataPath(isTestNet(getState()), walletName)));
  } else if (!openForm && hasAllCredentials) {
    dispatch(startDaemon(getRemoteCredentials(isTestNet(getState()), walletName)));
  }
};

export const STARTUPBLOCK = "STARTUPBLOCK";
export const syncDaemon = () =>
  (dispatch, getState) => {
    const updateBlockCount = () => {
      const { walletLoader: { neededBlocks }} = getState();
      const { daemon: { daemonSynced, timeStart, blockStart, credentials, walletName } } = getState();
      // check to see if user skipped;
      if (daemonSynced) return;
      return wallet
        .getBlockCount(walletName, credentials, isTestNet(getState()))
        .then(updateCurrentBlockCount => {
          if ((neededBlocks == 0 && updateCurrentBlockCount > 0) || (neededBlocks != 0 && updateCurrentBlockCount >= neededBlocks)) {
            dispatch({type: DAEMONSYNCED});
            dispatch({currentBlockHeight: updateCurrentBlockCount, type: STARTUPBLOCK});
            setMustOpenForm(false);
            dispatch(startRpcRequestFunc());
            return;
          } else if (updateCurrentBlockCount !== 0) {
            const blocksLeft = neededBlocks - updateCurrentBlockCount;
            const blocksDiff = updateCurrentBlockCount - blockStart;
            if (timeStart !== 0 && blockStart !== 0 && blocksDiff !== 0) {
              const currentTime = new Date();
              const timeSyncing = (currentTime - timeStart) / 1000;
              const secondsLeft = Math.round(blocksLeft / blocksDiff * timeSyncing);
              dispatch({
                currentBlockCount: parseInt(updateCurrentBlockCount),
                timeLeftEstimate: secondsLeft,
                type: DAEMONSYNCING_PROGRESS});
            } else if (updateCurrentBlockCount !== 0) {
              const time = new Date();
              dispatch({currentBlockCount: parseInt(updateCurrentBlockCount), timeStart: time, blockStart: parseInt(updateCurrentBlockCount), type: DAEMONSYNCING_START});
            }
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
