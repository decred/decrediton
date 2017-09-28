import Promise from "promise";
import { ipcRenderer } from "electron";

export const startDaemon = (rpcuser, rpcpassword) => Promise
  .resolve(ipcRenderer
    .sendSync("start-daemon", { rpcuser, rpcpassword }))
  .then(pid => {
    if (pid) return pid;
    throw "Error starting daemon";
  });

export const stopDaemon = () => Promise
  .resolve(ipcRenderer.sendSync("stop-daemon"))
  .then(stopped => {
    if (!stopped) throw "Error stopping daemon";
  });

export const startWallet = (rpcuser, rpcpassword) => Promise
  .resolve(ipcRenderer
    .sendSync("start-wallet", { rpcuser, rpcpassword }))
  .then(pid => {
    if (pid) return pid;
    throw "Error starting wallet";
  });

export const getBlockCount = (rpcuser, rpcpassword, host, cert) => Promise
  .resolve(ipcRenderer
    .sendSync("check-daemon", { rpcuser, rpcpassword, host, cert }));
