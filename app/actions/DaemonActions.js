import {versionCheckAction} from "./WalletLoaderActions";
import * as daemon from "../wallet/daemon";
import { push as pushHistory } from "react-router-redux";

export const DAEMONSTARTED = "DAEMONSTARTED";
export const DAEMONSTARTED_APPDATA = "DAEMONSTARTED_APPDATA";
export const DAEMONSTARTED_REMOTE = "DAEMONSTARTED_REMOTE";
export const DAEMONSTARTED_ERROR = "DAEMONSTARTED_ERROR";
export const DAEMONSTOPPED = "DAEMONSTOPPED";
export const DAEMONSTOPPED_ERROR = "DAEMONSTOPPED_ERROR";
export const DAEMONSYNCING_START = "DAEMONSYNCING_START";
export const DAEMONSYNCING_PROGRESS = "DAEMONSYNCING_PROGRESS";
export const DAEMONSYNCED = "DAEMONSYNCED";
export const WALLETREADY = "WALLETREADY";

export const startDaemon = (rpcCreds, appData) => (dispatch) => {
  if (rpcCreds) {
    dispatch({type: DAEMONSTARTED_REMOTE, credentials: rpcCreds, pid: -1});
    dispatch(syncDaemon());
  } else if (appData) {
    daemon.startDaemon(appData)
    .then(pid => {
      dispatch({type: DAEMONSTARTED_APPDATA, appData: appData, pid});
      dispatch(syncDaemon(null, appData));
    })
    .catch((err) => dispatch({err, type: DAEMONSTARTED_ERROR}));
  } else {
    daemon.startDaemon()
    .then(pid => {
      dispatch({type: DAEMONSTARTED, pid});
      dispatch(syncDaemon());
    })
    .catch(() => dispatch({type: DAEMONSTARTED_ERROR}));
  }
};

export const shutdownApp = () => (dispatch) => dispatch(pushHistory("/shutdown"));

export const cleanShutdown = () => () => daemon
  .cleanShutdown();

export const startWallet = () => (dispatch) => {
  daemon.startWallet()
  .then(pid => {
    dispatch({type: WALLETREADY, pid});
    setTimeout(()=>dispatch(versionCheckAction()), 1000);
  })
  .catch((err) => {
    console.log(err);
    dispatch({type: DAEMONSTARTED_ERROR});
  });
};

export const syncDaemon = () =>
  (dispatch, getState) => {
    const updateBlockCount = () => {
      const { walletLoader: { neededBlocks }} = getState();
      const { daemon: { daemonSynced, timeStart, blockStart, credentials, appData} } = getState();
      // check to see if user skipped;
      if (daemonSynced) return;
      return daemon
        .getBlockCount(credentials, appData)
        .then(updateCurrentBlockCount => {
          if (updateCurrentBlockCount >= neededBlocks) {
            dispatch({type: DAEMONSYNCED});
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
