import { ipcRenderer, clipboard, shell } from "electron";
import { invoke } from "helpers/electronRenderer";
import {
  isObject,
  isString,
  isNumber,
  isUndefined,
  isNull,
  isFunction
} from "lodash";
import qr from "qr-image";

if (ipcRenderer.on) {
  ipcRenderer.on("open-external", (e, url) => openExternalURL(url));
}

export const onAppReloadRequested = (cb) =>
  ipcRenderer.on("app-reload-requested", cb);

export const requestUIReload = () => ipcRenderer.send("app-reload-ui");

export const onCheckCanClose = (cb) => {
  ipcRenderer.removeAllListeners("check-can-close");
  ipcRenderer.on("check-can-close", cb);
};

export const onShowAboutModal = (cb) => {
  ipcRenderer.removeAllListeners("show-about-modal");
  ipcRenderer.on("show-about-modal", cb);
};

export const onErrorReceived = (cb) => {
  ipcRenderer.removeAllListeners("error-received");
  ipcRenderer.on("error-received", cb);
};

export const onWarningReceived = (cb) => {
  ipcRenderer.removeAllListeners("warning-received");
  ipcRenderer.on("warning-received", cb);
};

export const onDaemonStopped = (cb) => {
  ipcRenderer.removeAllListeners("daemon-stopped");
  ipcRenderer.on("daemon-stopped", cb);
};

export const getCLIOptions = () => ipcRenderer.sendSync("get-cli-options");

const escapeLogMsg = (msg) =>
  msg.replace(/[^\x20-\x7E]/g, (s) =>
    s
      .split("")
      .map((c) => "\\u{" + c.charCodeAt(0).toString(16) + "}")
      .join("")
  );

export const log = (level, msg) => {
  ipcRenderer.send("main-log", level, escapeLogMsg(msg));
};

export const logOptionNoArgs = (opts) => ({ ...opts, noArguments: true });
export const logOptionNoResponseData = (opts) => ({
  ...opts,
  noResponseData: true
});

// Formats a dynamic list of log arguments
const formatLogArgs = (msg, args) => {
  const formatArg = (arg) => {
    if (arg instanceof Error) {
      return arg.toString();
    } else if (isObject(arg) && isFunction(arg.toObject)) {
      // requests/responses on the grpc system have a toObejct() func
      return JSON.stringify(arg.toObject());
    } else if (isUndefined(arg)) {
      return "[undefined]";
    } else if (isString(arg) || isNumber(arg) || isNull(arg)) {
      return String(arg);
    } else {
      return JSON.stringify(arg);
    }
  };

  const logArgs = args.map(formatArg);
  const argsStr = logArgs.join(" ");
  const logMsg = `${msg} ${argsStr}`;

  return { logMsg };
};

// Higher Order Function that wraps the promise-generating function f with log
// calls. Calling f() **must** return a promise.
export const withLog =
  (f, msg, opts = {}) =>
  (...args) => {
    if (opts.noArguments) {
      log("info", msg);
    } else {
      const { logMsg } = formatLogArgs(msg, args);
      log("info", logMsg);
    }

    return new Promise((resolve, reject) => {
      f(...args)
        .then((...res) => {
          if (res.length === 1 && res[0] === undefined) {
            log("debug", `${msg} returned without data`);
          } else if (opts.noResponseData) {
            log("debug", `${msg} returned [response data omitted]`);
          } else {
            const { logMsg } = formatLogArgs(`${msg} returned `, res);
            log("debug", logMsg);
          }

          resolve(...res);
        })
        .catch((err) => {
          const { logMsg } = formatLogArgs(`${msg} errored `, [err]);
          log("error", logMsg);

          reject(err);
        });
    });
  };

export const withLogNoArgs = (f, msg, opts = {}) =>
  withLog(f, msg, logOptionNoArgs(opts));

export const withLogNoResponseData = (f, msg, opts = {}) =>
  withLog(f, msg, logOptionNoResponseData(opts));

export const withLogNoData = (f, msg, opts = {}) =>
  withLog(f, msg, logOptionNoArgs(logOptionNoResponseData(opts)));

export const setupProxy = () => {
  ipcRenderer.send("setup-proxy");
};

export const copyToClipboard = (data) => {
  clipboard.clear();
  clipboard.writeText(data);
};

export const readFromClipboard = () => clipboard.readText();

export const openExternalURL = (url) => {
  // Allow opening external http:// sites only in development mode.
  const regexp =
    process.env.NODE_ENV === "development" ? /^https:\/\// : /^https?:\/\//;
  if (!regexp.test(url)) {
    throw new Error("Unsupported external URL " + url);
  }
  shell.openExternal(url);
};

export const showSaveDialog = (opts) => invoke("show-save-dialog", opts);

export const showOpenDialog = (opts) => invoke("show-open-dialog", opts);

export const getSelectedWallet = () =>
  ipcRenderer.sendSync("get-selected-wallet");

export const setSelectedWallet = (selectedWallet) =>
  ipcRenderer.sendSync("set-selected-wallet", selectedWallet);

export const getDcrdRpcCredentials = () =>
  ipcRenderer.sendSync("get-dcrd-rpc-credentials");

export const dropDcrd = () => invoke("drop-dcrd");

export const changeMenuLocale = (locale) =>
  ipcRenderer.sendSync("change-menu-locale", locale);

export const grpcVersionsDetermined = (versions) =>
  ipcRenderer.send("grpc-versions-determined", versions);

export const genQRCodeSVG = (uri) =>
  qr.imageSync(uri, { type: "svg", ec_level: "H" });

export const getCustomTranslationMessages = () =>
  ipcRenderer.sendSync("custom-translation-msgs");
