import winston from "winston";
import path from "path";
import { MAX_LOG_LENGTH } from "./constants";
import { appDataDirectory } from "./paths";
import os from "os";

let dcrdLogs = Buffer.from("");
let dcrwalletLogs = Buffer.from("");

let logger;

const pad = (s, n) => {
  n = n || 2;
  s = Array(n).join("0") + s;
  return s.substring(s.length - n);
};

// logTimestamp is a function to format current time as a string using a
// format compatible to dcrd/dcrwallet logs. This function is meant to be
// installed in the winston loggers.
const logTimestamp = () => {
  let date = new Date();
  let y = date.getFullYear();
  let mo = pad(date.getMonth() + 1);
  let d = pad(date.getDate());
  let h = pad(date.getHours());
  let mi = pad(date.getMinutes());
  let s = pad(date.getSeconds());
  let ms = pad(date.getMilliseconds(), 3);
  return `${y}-${mo}-${d} ${h}:${mi}:${s}.${ms}`;
};

// logLevelsPrintable are the printable strings for each log level, compatible
// with the dcrd/dcrwallet logs.
const logLevelsPrintable = {
  "error": "ERR",
  "warn": "WRN",
  "info": "INF",
  "verbose": "VBS",
  "debug": "DBG",
  "silly": "TRC",
};

const logFormatter = (opts) => {
  //console.log(opts);
  const lvl = logLevelsPrintable[opts.level]||"UNK";
  const time = opts.timestamp();
  const msg = opts.message;
  const subsys = "DCTN";
  return `${time} [${lvl}] ${subsys}: ${msg}`;
};

const logFormatterColorized = (opts) => {
  const config = winston.config;
  return config.colorize(opts.level, logFormatter(opts));
};

// createLogger creates the main app logger. This stores all logs into the
// decrediton app data dir and sends to the console when debug == true.
// This is meant to be called from the ipcMain thread.
export function createLogger(debug) {
  if (logger)
    return logger;
  logger = new (winston.Logger)({
    transports: [
      new (winston.transports.File)({
        json: false,
        filename: path.join(appDataDirectory(), "decrediton.log"),
        timestamp: logTimestamp,
        formatter: logFormatter,
      })
    ]
  });

  if (debug) {
    logger.add(winston.transports.Console, {
      timestamp: logTimestamp,
      formatter: logFormatterColorized,
      level: "debug",
    });
  }

  return logger;
}

const AddToLog = (destIO, destLogBuffer, data, debug) => {
  var dataBuffer = Buffer.from(data);
  if (destLogBuffer.length + dataBuffer.length > MAX_LOG_LENGTH) {
    destLogBuffer = destLogBuffer.slice(destLogBuffer.indexOf(os.EOL,dataBuffer.length)+1);
  }
  debug && destIO.write(data);
  return Buffer.concat([ destLogBuffer, dataBuffer ]);
};

export const AddToDcrdLog = (destIO, data, debug) => {
  dcrdLogs = AddToLog(destIO, dcrdLogs, data, debug);
};

export const AddToDcrwalletLog = (destIO, data, debug) => {
  dcrwalletLogs = AddToLog(destIO, dcrwalletLogs, data, debug);
};

export const GetDcrdLogs = () => dcrdLogs;

export const GetDcrwalletLogs = () => dcrwalletLogs;

const logError = "[ERR]";

const panicErr = "panic";

export function lastLogLine(log) {
  let lastLineIdx = log.lastIndexOf(os.EOL, log.length - os.EOL.length -1);
  let lastLineBuff = log.slice(lastLineIdx).toString("utf-8");
  return lastLineBuff.trim();
}

export function lastErrorLine(log) {
  let lastLineIdx = log.lastIndexOf(logError);
  let endOfErrorLineIdx = log.indexOf(os.EOL, lastLineIdx);
  let lastLineBuff = log.slice(lastLineIdx, endOfErrorLineIdx).toString("utf-8");
  return lastLineBuff.trim();
}

export function lastPanicLine(log) {
  let lastLineIdx = log.indexOf(panicErr);
  if (lastLineIdx < 0) lastLineIdx = log.indexOf("goroutine");
  let lastLineBuff = log.slice(lastLineIdx).toString("utf-8");
  return lastLineBuff;
}

export function ClearDcrwalletLogs() {
  dcrwalletLogs = Buffer.from("");
}

const reindexCheck = "Reindexing to height";

export function CheckDaemonLogs(data) {
  if (data.indexOf(reindexCheck) > 0) {
    return true;
  }
  return false;
}
