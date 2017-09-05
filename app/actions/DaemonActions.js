import {ipcRenderer} from "electron";
import Promise from "promise";
import {versionCheckAction} from "./WalletLoaderActions";

export const DAEMONSTARTED = "DAEMONSTARTED";
export const DAEMONSTARTED_ERROR = "DAEMONSTARTED_ERROR";
export const DAEMONSTOPPED = "DAEMONSTOPPED";
export const DAEMONSTOPPED_ERROR = "DAEMONSTOPPED_ERROR";
export const DAEMONSYNCING_START = "DAEMONSYNCING_START";
export const DAEMONSYNCING_PROGRESS = "DAEMONSYNCING_PROGRESS";
export const DAEMONSYNCED = "DAEMONSYNCED";
export const WALLETREADY = "WALLETREADY";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
export function skipDaemonSync() {
  return (dispatch) => {
    dispatch({type: DAEMONSYNCED});
    dispatch(startWallet());
  };
}
export function startDaemon(rpcuser, rpcpassword) {
  return (dispatch) => {
    var args = {rpcuser: rpcuser, rpcpassword: rpcpassword};
    var dcrdPid = ipcRenderer.sendSync("start-daemon", args);
    if (dcrdPid) {
      dispatch({pid: dcrdPid,  type: DAEMONSTARTED});
      dispatch(syncDaemon(rpcuser, rpcpassword));
    } else {
      dispatch({type: DAEMONSTARTED_ERROR});
    }
  };
}
export function stopDaemon() {
  return (dispatch) => {
    var stopped = ipcRenderer.sendSync("stop-daemon");
    if (stopped) {
      dispatch({type: DAEMONSTOPPED});
    } else {
      dispatch({type: DAEMONSTOPPED_ERROR});
    }
  };
}
export function startWallet(rpcuser, rpcpassword) {
  return (dispatch) => {
    var args = {rpcuser: rpcuser, rpcpassword: rpcpassword};
    var dcrwPid = ipcRenderer.sendSync("start-wallet", args);
    if (dcrwPid) {
      dispatch({pid: dcrwPid, type: WALLETREADY});
      setTimeout(()=>dispatch(versionCheckAction()), 1000);
    } else {
      dispatch({type: DAEMONSTARTED_ERROR});
    }
  };
}
export function syncDaemon(rpcuser, rpcpassword, host, cert) {
  return async (dispatch, getState) => {
    const {neededBlocks} = getState().walletLoader;
    var args = {rpcuser: rpcuser, rpcpassword: rpcpassword, host: host, cert: cert};
    var updateCurrentBlockCount = 0;
    //
    for (;;){
      // check to see if user skipped;
      const {daemonSynced, timeStart, blockStart} = getState().daemon;
      if (daemonSynced) {
        break;
      }
      updateCurrentBlockCount = ipcRenderer.sendSync("check-daemon", args);
      if (updateCurrentBlockCount >= neededBlocks) {
        dispatch({type: DAEMONSYNCED});
        dispatch(startWallet());
        break;
      }
      if (updateCurrentBlockCount !== 0) {
        var blocksLeft = neededBlocks - updateCurrentBlockCount;
        var blocksDiff = updateCurrentBlockCount - blockStart;
        if (timeStart !== 0 && blockStart !== 0 && blocksDiff !== 0) {
          var currentTime = new Date();
          var timeSyncing = (currentTime - timeStart) / 1000;
          var minutesLeft = Math.round(blocksLeft / blocksDiff * timeSyncing / 60);
          if (minutesLeft == 0) {
            minutesLeft = "<1";
          }
          var updateTimeLeftEstimate = "Estimated time remaining: " + minutesLeft + " minutes" ;
          dispatch({currentBlockCount: parseInt(updateCurrentBlockCount), timeLeftEstimate: updateTimeLeftEstimate, type: DAEMONSYNCING_PROGRESS});
        } else if (updateCurrentBlockCount !== 0) {
          var time = new Date();
          dispatch({currentBlockCount: parseInt(updateCurrentBlockCount), timeStart: time, blockStart: parseInt(updateCurrentBlockCount), type: DAEMONSYNCING_START});
        }
      }
      await sleep(10000);
    }
  };
}
