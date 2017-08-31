import {ipcRenderer} from "electron";
import Promise from "promise";
import {versionCheckAction} from "./WalletLoaderActions";

export const DAEMONSTARTED = "DAEMONSTARTED";
export const DAEMONSTARTED_ERROR = "DAEMONSTARTED_ERROR";
export const DAEMONSTOPPED = "DAEMONSTOPPED";
export const DAEMONSTOPPED_ERROR = "DAEMONSTOPPED_ERROR";
export const DAEMONSYNCING = "DAEMONSYNCING";
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
      var time = new Date();
      console.log(time.getTime());
      dispatch({pid: dcrdPid, timeStarted: time.getTime(), type: DAEMONSTARTED});
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
    while (true){
      // check to see if user skipped;
      const {daemonSynced, currentBlockCount, timeLeftEstimate} = getState().daemon;
      if (daemonSynced) {
        break;
      }
      updateCurrentBlockCount = ipcRenderer.sendSync("check-daemon", args);
      if (updateCurrentBlockCount >= neededBlocks) {
        dispatch({type: DAEMONSYNCED});
        dispatch(startWallet());
        break;
      }
      var updateTimeLeftEstimate = timeLeftEstimate;
      if (updateCurrentBlockCount !== 0) {
        var blocksLeft = neededBlocks - updateCurrentBlockCount;
        var blocksDiff = updateCurrentBlockCount - currentBlockCount;
        if (blocksDiff !== 0 && currentBlockCount > 0) {
          var minutesLeft = blocksLeft / blocksDiff * 10 / 60;
          updateTimeLeftEstimate = minutesLeft + " estimated minutes remaining";
        }
        dispatch({currentBlockCount: parseInt(updateCurrentBlockCount), timeLeftEstimate: updateTimeLeftEstimate, type: DAEMONSYNCING});
      }
      await sleep(10000);
    }
  };
}
