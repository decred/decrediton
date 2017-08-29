import {ipcRenderer} from "electron";

// @flow
export const DAEMONSTARTED = "DAEMONSTARTED";
export const DAEMONRPCREADY = "DAEMONRPCREADY";
export const DAEMONSYNCED = "DAEMONSYNCED";

export function startDaemon() {
  var args = {rpcuser: "user", rpcpassword: "password"};
  ipcRenderer.sendSync("start-daemon", args); // prints "pong"
}
export function checkDaemon() {
  var args = {rpcuser: "user", rpcpassword: "password"};
  setInterval(()=>console.log(ipcRenderer.sendSync("check-daemon", args)), 5000);
}
