import { ipcRenderer } from "electron";

export const onAppReloadRequested = cb => ipcRenderer.on("app-reload-requested", cb);

export const log = (level, ...args) => {
  ipcRenderer.send("main-log", ...[level, ...args]);
};

// Higher Order Function that wraps the promise-generating function f with log
// calls. Calling f() **must** return a promise.
export const withLog = (msg, f) => (...args) => {
  log("info", "Wallet requesting %s", msg);
  return new Promise((resolve, reject) => {
    f(...args)
      .then((...res) => {
        log("debug", "Wallet received response %s", ...res);
        resolve(...res);
      })
      .catch(err => {
        log("error", "Wallet received error %s", err);
        reject(err);
      });
  });
};
