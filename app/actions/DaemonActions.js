import {ipcRenderer} from "electron";

// @flow
export const DAEMONSTARTED = "DAEMONSTARTED";
export const DAEMONSTARTED_ERROR = "DAEMONSTARTED_ERROR";
export const DAEMONRPCREADY = "DAEMONRPCREADY";
export const DAEMONRPCREADY_ERROR = "DAEMONRPCREADY_ERROR";
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
export function startWallet(rpcuser, rpcpassword) {
  return (dispatch) => {
    var args = {rpcuser: rpcuser, rpcpassword: rpcpassword};
    var dcrdPid = ipcRenderer.sendSync("start-wallet", args);
    if (dcrdPid) {
      dispatch({pid: dcrdPid, type: WALLETREADY});
    } else {
      dispatch({type: DAEMONSTARTED_ERROR});
    }
  };
}
export function checkDaemon(rpcuser, rpcpassword, host, cert) {
  return async (dispatch) => {
    var args = {rpcuser: rpcuser, rpcpassword: rpcpassword, host: host, cert: cert};
    var daemonConnectionAttempts = 5;
    var connected = false;
    for (var i = 0; i < daemonConnectionAttempts; i++) {
      connected = ipcRenderer.sendSync("check-daemon", args);
      if (connected) {
        break;
      }
      await sleep(10000);
    }
    if (connected) {
      dispatch({type: DAEMONRPCREADY});
      dispatch(startWallet(rpcuser, rpcpassword));
    } else {
      dispatch({type: DAEMONRPCREADY_ERROR});
    }
  };
  
}
