import { ipcRenderer } from "electron";
import { isObject, isString, isNumber, isUndefined, isNull } from "util";
import { isFunction } from "util";

export const onAppReloadRequested = cb => ipcRenderer.on("app-reload-requested", cb);

export const log = (level, ...args) => {
  ipcRenderer.send("main-log", ...[ level, ...args ]);
};

export const logOptionNoArgs = (opts) => ({ ...opts, noArguments: true });
export const logOptionNoResponseData = (opts) => ({ ...opts, noResponseData: true });

// Formats a dynamic list of log arguments
const formatLogArgs = (msg, args) => {
  const formatArg = (arg) => {
    if (isObject(arg) && isFunction(arg.toObject)) {
      // requests/responses on the grpc system have a toObejct() func
      return JSON.stringify(arg.toObject());
    } else if (isUndefined(arg)) {
      return "[undefined]";
    } else if (isString(arg) || isNumber(arg) || isNull(arg)) {
      return arg;
    } else {
      return JSON.stringify(arg);
    }
  };

  let logMsg = args.reduce((a) => a + "%s ", "%s ");
  let logArgs = [ msg, ...args.map(formatArg) ];

  return { logMsg, logArgs };
};

// Higher Order Function that wraps the promise-generating function f with log
// calls. Calling f() **must** return a promise.
export const withLog = (f, msg, opts={}) => (...args) => {

  if (opts.noArguments) {
    log("info", msg);
  } else {
    const { logMsg, logArgs } = formatLogArgs(msg, args);
    log("info", logMsg, ...logArgs);
  }

  return new Promise((resolve, reject) => {
    f(...args)
      .then((...res) => {
        if (res.length === 1 && res[0] === undefined) {
          log("debug", "%s returned without data", msg);
        } else {
          if (opts.noResponseData) {
            log("debug", `${msg} returned [response data omitted]`);
          } else {
            const { logMsg, logArgs } = formatLogArgs(`${msg} returned `, res);
            log("debug", logMsg, ...logArgs);
          }
        }

        resolve(...res);
      })
      .catch(err => {
        const { logMsg, logArgs } = formatLogArgs(`${msg} errored `, [ err ]);
        log("error", logMsg, ...logArgs);

        reject(err);
      });
  });
};

export const withLogNoArgs = (f, msg, opts={}) =>
  withLog(f, msg, logOptionNoArgs(opts));

export const withLogNoResponseData = (f, msg, opts={}) =>
  withLog(f, msg, logOptionNoResponseData(opts));

export const withLogNoData = (f, msg, opts={}) =>
  withLog(f, msg, logOptionNoArgs(logOptionNoResponseData(opts)));
