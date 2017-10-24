import {versionCheckAction} from "./WalletLoaderActions";
import * as daemon from "../wallet/daemon";

export const DAEMONSTARTED = "DAEMONSTARTED";
export const DAEMONSTARTED_ERROR = "DAEMONSTARTED_ERROR";
export const DAEMONSTOPPED = "DAEMONSTOPPED";
export const DAEMONSTOPPED_ERROR = "DAEMONSTOPPED_ERROR";
export const DAEMONSYNCING_START = "DAEMONSYNCING_START";
export const DAEMONSYNCING_PROGRESS = "DAEMONSYNCING_PROGRESS";
export const DAEMONSYNCED = "DAEMONSYNCED";
export const WALLETREADY = "WALLETREADY";

export const startDaemon = (rpcuser, rpcpassword) => (dispatch) => daemon
  .startDaemon(rpcuser, rpcpassword)
  .then(pid => {
    dispatch({type: DAEMONSTARTED, pid});
    dispatch(syncDaemon(rpcuser, rpcpassword));
  })
  .catch(() => dispatch({type: DAEMONSTARTED_ERROR}));

export const stopDaemon = () => (dispatch) => daemon
  .stopDaemon()
  .then(() => dispatch({type: DAEMONSTOPPED}))
  .catch(() => dispatch({type: DAEMONSTOPPED_ERROR}));

export const startWallet = (rpcuser, rpcpassword) => (dispatch) => daemon
  .startWallet(rpcuser, rpcpassword)
  .then(pid => {
    dispatch({type: WALLETREADY, pid});
    setTimeout(()=>dispatch(versionCheckAction()), 1000);
  })
  .catch(() => dispatch({type: DAEMONSTARTED_ERROR}));

export const syncDaemon = (rpcuser, rpcpassword, host, cert) =>
  (dispatch, getState) => {
    const updateBlockCount = () => {
      const { walletLoader: { neededBlocks }} = getState();
      const { daemon: { daemonSynced, timeStart, blockStart } } = getState();
      // check to see if user skipped;
      if (daemonSynced) return;
      return daemon
        .getBlockCount(rpcuser, rpcpassword, host, cert)
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
        });
    };
    updateBlockCount();
  };
