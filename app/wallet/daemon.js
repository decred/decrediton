import Promise from "promise";
import { ipcRenderer } from "electron";

export const startDaemon = () => Promise
  .resolve(ipcRenderer.sendSync("start-daemon"))
  .then(PIDAndAdvancedMode => {
    if (PIDAndAdvancedMode) return PIDAndAdvancedMode;
    throw "Error starting daemon";
  });

export const startDaemonAdvanced = (args, startType) => {
  return Promise
    .resolve(ipcRenderer
      .sendSync("start-daemon-advanced", {args, startType}))
    .then(PIDAndAdvancedMode => {
      if (PIDAndAdvancedMode) return PIDAndAdvancedMode;
      throw "Error starting daemon in advanced mode";
    });
};

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

export const getBlockCount = (rpcuser, rpcpassword, rpccert, rpchost, rpcport) => Promise
  .resolve(ipcRenderer
    .sendSync("check-daemon", { rpcuser, rpcpassword, rpccert, rpchost, rpcport }));
