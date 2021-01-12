import winston from "winston";
import path from "path";
import { MAX_LOG_LENGTH } from "constants";
import { getAppDataDirectory } from "./paths";
import os from "os";

let dcrdLogs = Buffer.from("");
let dcrwalletLogs = Buffer.from("");
let dcrlndLogs = Buffer.from("");
let privacyLogs = Buffer.from("");

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
  const date = new Date();
  const y = date.getFullYear();
  const mo = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  const h = pad(date.getHours());
  const mi = pad(date.getMinutes());
  const s = pad(date.getSeconds());
  const ms = pad(date.getMilliseconds(), 3);
  return `${y}-${mo}-${d} ${h}:${mi}:${s}.${ms}`;
};

// logLevelsPrintable are the printable strings for each log level, compatible
// with the dcrd/dcrwallet logs.
const logLevelsPrintable = {
  error: "ERR",
  warn: "WRN",
  info: "INF",
  verbose: "VBS",
  debug: "DBG",
  silly: "TRC"
};

const logFormatter = (opts) => {
  const lvl = logLevelsPrintable[opts.level] || "UNK";
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
  if (logger) return logger;
  logger = new winston.Logger({
    transports: [
      new winston.transports.File({
        json: false,
        filename: path.join(getAppDataDirectory(), "decrediton.log"),
        timestamp: logTimestamp,
        formatter: logFormatter
      })
    ]
  });

  if (debug) {
    logger.add(winston.transports.Console, {
      timestamp: logTimestamp,
      formatter: logFormatterColorized,
      level: "debug"
    });
  }

  return logger;
}

const AddToLog = (destIO, destLogBuffer, data, debug) => {
  const dataBuffer = Buffer.from(data);
  if (destLogBuffer.length + dataBuffer.length > MAX_LOG_LENGTH) {
    destLogBuffer = destLogBuffer.slice(
      destLogBuffer.indexOf(os.EOL, dataBuffer.length) + 1
    );
  }
  debug && destIO.write(data);
  return Buffer.concat([destLogBuffer, dataBuffer]);
};

export const AddToDcrdLog = (destIO, data, debug) => {
  dcrdLogs = AddToLog(destIO, dcrdLogs, data, debug);
};

export const AddToDcrwalletLog = (destIO, data, debug) => {
  dcrwalletLogs = AddToLog(destIO, dcrwalletLogs, data, debug);
};

export const AddToDcrlndLog = (destIO, data, debug) => {
  dcrlndLogs = AddToLog(destIO, dcrlndLogs, data, debug);
};

export const AddToPrivacyLog = (destIO, data, debug) => {
  // if log contains any of those messages we consider it a privacy log.
  const privacyLogsArray = [
    "Dialed CSPPServer",
    "Mixing output",
    "Completed CoinShuffle++ mix of output",
    "wallet.MixOutput",
    "AccountMixer"
  ];
  privacyLogsArray.forEach((log) => {
    if (data.toString("utf8").indexOf(log) > 0) {
      privacyLogs = AddToLog(destIO, privacyLogs, data, debug);
    }
  });
};

export const cleanPrivacyLogs = () => privacyLogs = Buffer.from("");

export const GetDcrdLogs = () => dcrdLogs;

export const GetDcrwalletLogs = () => dcrwalletLogs;

export const GetDcrlndLogs = () => dcrlndLogs;

export const getPrivacyLogs = () => privacyLogs.toString("utf-8");

const logError = "[ERR]";

const panicErr = "panic";

export function lastLogLine(log) {
  const lastLineIdx = log.lastIndexOf(os.EOL, log.length - os.EOL.length - 1);
  const lastLineBuff = log.slice(lastLineIdx).toString("utf-8");
  return lastLineBuff.trim();
}

export function lastErrorLine(log) {
  const lastLineIdx = log.lastIndexOf(logError);
  const endOfErrorLineIdx = log.indexOf(os.EOL, lastLineIdx);
  const lastLineBuff = log
    .slice(lastLineIdx, endOfErrorLineIdx)
    .toString("utf-8");
  return lastLineBuff.trim();
}

export function lastPanicLine(log) {
  let lastLineIdx = log.indexOf(panicErr);
  if (lastLineIdx < 0) lastLineIdx = log.indexOf("goroutine");
  const lastLineBuff = log.slice(lastLineIdx).toString("utf-8");
  return lastLineBuff;
}

export function ClearDcrwalletLogs() {
  dcrwalletLogs = Buffer.from("");
  dcrlndLogs = Buffer.from("");
}

// dcrd upgrades warning.
const reindexCheck = "Reindexing to height";
const upgradeDatabase = "Upgrading database to version 6";
const reindexing = "Reindexing block information in the database";
const upgradeDB7 = "Upgrading database to version 7";

// CheckDaemonLogs checks if dcrd send a message which need to be notified
// to the user.
export function CheckDaemonLogs(data) {
  let hasWarning = false;
  const warningArray = [
    reindexCheck,
    upgradeDatabase,
    reindexing,
    upgradeDB7
  ];
  warningArray.forEach((warnMsg) => {
    if (data.indexOf(warnMsg) > 0) {
      hasWarning = true;
      return;
    }
  });
  return hasWarning;
}
