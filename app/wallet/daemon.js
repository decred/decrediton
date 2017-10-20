import Promise from "promise";
import { ipcRenderer } from "electron";

export const startDaemon = () => Promise
  .resolve(ipcRenderer.sendSync("start-daemon"))
  .then(PIDAndAdvancedMode => {
    if (PIDAndAdvancedMode) return PIDAndAdvancedMode;
    throw "Error starting daemon";
  });

export const startDaemonAdvanced = (rpcuser, rpcpassword, rpccert) => {
  console.log("Start-advanced-daemon on daemon.js\n");
  console.log("rpcuser: "+ rpcuser);
  console.log("rpcpassword: "+ rpcpassword);
  console.log("rpccert: "+ rpccert);
  return Promise
    .resolve(ipcRenderer
      .sendSync("start-daemon-advanced", { rpcuser, rpcpassword, rpccert }))
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

export const getBlockCount = (rpcuser, rpcpassword, host, cert) => Promise
  .resolve(ipcRenderer
    .sendSync("check-daemon", { rpcuser, rpcpassword, host, cert }));
