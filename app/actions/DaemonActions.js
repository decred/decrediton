import { versionCheckAction } from "./WalletLoaderActions";
import { stopNotifcations } from "./NotificationActions";
import * as wallet from "wallet";
import { push as pushHistory } from "react-router-redux";
import { ipcRenderer } from "electron";
import { setMustOpenForm } from "config";
import { hideSidebarMenu } from "./SidebarActions";

export const DAEMONSTARTED = "DAEMONSTARTED";
export const DAEMONSTARTED_APPDATA = "DAEMONSTARTED_APPDATA";
export const DAEMONSTARTED_REMOTE = "DAEMONSTARTED_REMOTE";
export const DAEMONSTARTED_ERROR = "DAEMONSTARTED_ERROR";
export const DAEMONSTOPPED = "DAEMONSTOPPED";
export const DAEMONSYNCING_START = "DAEMONSYNCING_START";
export const DAEMONSYNCING_PROGRESS = "DAEMONSYNCING_PROGRESS";
export const DAEMONSYNCED = "DAEMONSYNCED";
export const WALLETREADY = "WALLETREADY";
export const AVAILABLE_WALLETS = "AVAILABLE_WALLETS";
export const SHUTDOWN_REQUESTED = "SHUTDOWN_REQUESTED";
export const SET_CREDENTIALS_APPDATA_ERROR = "SET_CREDENTIALS_APPDATA_ERROR";

export const startDaemon = (rpcCreds, appData) => (dispatch, getState) => {
  const { daemonStarted } = getState().daemon;
  if (daemonStarted) return;
  const { grpc: { network }} = getState();
  if (rpcCreds) {
    dispatch({type: DAEMONSTARTED_REMOTE, credentials: rpcCreds, pid: -1});
    dispatch(syncDaemon());
  } else if (appData) {
    wallet.startDaemon("default-wallet", appData, network == "testnet")
    .then(rpcCreds => {
      dispatch({type: DAEMONSTARTED_APPDATA, appData: appData, credentials: rpcCreds});
      dispatch(syncDaemon(null, appData));
    })
    .catch((err) => dispatch({err, type: DAEMONSTARTED_ERROR}));
  } else {
    wallet.startDaemon("default-wallet", null, network == "testnet")
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

export const startWallet = () => (dispatch, getState) => {
  const { grpc: { network }} = getState();
  wallet.startWallet("default-wallet", network == "testnet")
  .then(pid => {
    dispatch({type: WALLETREADY, pid});
    setTimeout(()=>dispatch(versionCheckAction()), 1000);
  })
  .catch((err) => {
    console.log(err);
    dispatch({type: DAEMONSTARTED_ERROR});
  });
};

export const STARTUPBLOCK = "STARTUPBLOCK";
export const syncDaemon = () =>
  (dispatch, getState) => {
    const updateBlockCount = () => {
      const { walletLoader: { neededBlocks }} = getState();
      const { grpc: { network }} = getState();
      const { daemon: { daemonSynced, timeStart, blockStart, credentials} } = getState();
      // check to see if user skipped;
      if (daemonSynced) return;
      return wallet
        .getBlockCount("default-wallet", credentials, network == "testnet")
        .then(updateCurrentBlockCount => {
          if ((neededBlocks == 0 && updateCurrentBlockCount > 0) || (neededBlocks != 0 && updateCurrentBlockCount >= neededBlocks)) {
            dispatch({type: DAEMONSYNCED});
            dispatch({currentBlockHeight: updateCurrentBlockCount, type: STARTUPBLOCK});
            setMustOpenForm(false);
            dispatch(startWallet());
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
