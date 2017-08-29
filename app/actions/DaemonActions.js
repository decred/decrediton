// @flow
export const DAEMONCONNECTED = "DAEMONCONNECTED";

const {ipcRenderer} = require("electron");
var args = {rpcuser: "user", rpcpassword: "password"};
ipcRenderer.sendSync("start-daemon", args); // prints "pong"
setInterval(()=>console.log(ipcRenderer.sendSync("check-daemon", args)), 5000);
