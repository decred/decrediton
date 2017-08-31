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

export function startDaemon(rpcuser, rpcpassword) {
  return (dispatch) => {
    var args = {rpcuser: rpcuser, rpcpassword: rpcpassword};
    var dcrdPid = ipcRenderer.sendSync("start-daemon", args);
    if (dcrdPid) {
      dispatch({pid: dcrdPid, type: DAEMONSTARTED});
      dispatch(checkDaemon(rpcuser, rpcpassword));
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
export function checkDaemon(rpcuser, rpcpassword, host, cert) {
  return async (dispatch, getState) => {
    const {neededBlocks} = getState().walletLoader;
    var args = {rpcuser: rpcuser, rpcpassword: rpcpassword, host: host, cert: cert};
    var currentBlockCount = 0;
    while (currentBlockCount < neededBlocks) {
      currentBlockCount = ipcRenderer.sendSync("check-daemon", args);
      console.log(currentBlockCount);
      dispatch({currentBlockCount: currentBlockCount, type: DAEMONSYNCING});
      await sleep(10000);
    }
    if (currentBlockCount) {
      dispatch({currentBlockCount: currentBlockCount, type: DAEMONSYNCED});
      dispatch(startWallet(rpcuser, rpcpassword));
    }
  };
}
