import path from "path";
import { MAX_LOG_LENGTH } from "constants";
import { getAppDataDirectory } from "./paths";
import os from "os";
import fs from "fs";

let dcrdLogs = Buffer.from("");
let dcrwalletLogs = Buffer.from("");
let dcrlndLogs = Buffer.from("");
let dexcLogs = Buffer.from("");
let trezordLogs = Buffer.from("");
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

export const getLogFileName = () =>
  path.join(getAppDataDirectory(), "decrediton.log");

class Logger {
  constructor(debug) {
    this.debug = debug;
    this.logLevels = {
      error: 0,
      warn: 1,
      info: 2,
      verbose: 3,
      debug: 3,
      silly: 3
    };
    this.colorCodes = {
      [-1]: "\u001b[39m",
      0: "\u001b[91m",
      1: "\u001b[35m",
      2: "\u001b[32m",
      3: "\u001b[34m"
    };
    this.drained = true;
    this.buffer = [];
    this.logFile = fs.createWriteStream(getLogFileName());
    this.logFile.on("drain", this.dequeue);
  }

  dequeue() {
    if (this.buffer.length === 0) {
      this.drained = true;
      return;
    }

    // Keep writing data to the file until we either write all available data or
    // the file becomes busy for writes (in which case this function will be
    // called again once the file can be written to again).
    let drained = true;
    while (this.buffer.length() > 0 && drained) {
      const data = this.buffer.shift();
      this.drained = this.logFile.write(data);
      drained = this.drained;
    }
  }

  queue(data) {
    if (this.drained) {
      // Fast path: file is not busy, so write directly.
      this.drained = this.logFile.write(data);
    } else {
      // Slow path: file is busy, so enqueue data to be written as possible.
      this.buffer.push(data);
    }
  }

  log(level, msg) {
    const levelLower = level.toLowerCase();
    const logLevel = this.logLevels[levelLower] || 3;

    const subsys = "DCTN";
    const lvl = logLevelsPrintable[levelLower] || "UNK";
    const data = `${logTimestamp()} [${lvl}] ${subsys}: ${msg}`;

    // Log to file only if msg is of level INFO or lower.
    if (logLevel <= 2) {
      this.queue(data + "\n");
    }

    // Log to console if debug is set and level is DEBUG or lower.
    if (this.debug && logLevel <= 3) {
      console.log(this.colorCodes[logLevel] + data + this.colorCodes[-1]);
    }
  }

  close() {
    return new Promise((ok) => {
      this.logFile.once("finish", ok);
      this.logFile.end();
    });
  }
}

// createLogger creates the main app logger. This stores all logs into the
// decrediton app data dir and sends to the console when debug == true.
// This is meant to be called from the ipcMain thread.
export function createLogger(debug) {
  if (!logger) {
    logger = new Logger(debug);
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

export const AddToDexcLog = (destIO, data, debug) => {
  dexcLogs = AddToLog(destIO, dexcLogs, data, debug);
};

export const AddToTrezordLog = (destIO, data, debug) => {
  trezordLogs = AddToLog(destIO, trezordLogs, data, debug);
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

export const cleanPrivacyLogs = () => (privacyLogs = Buffer.from(""));

export const GetDcrdLogs = () => dcrdLogs;

export const GetDcrwalletLogs = () => dcrwalletLogs;

export const GetDcrlndLogs = () => dcrlndLogs;

export const GetTrezordLogs = () => trezordLogs;

export const GetDexcLogs = () => dexcLogs;

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
  dexcLogs = Buffer.from("");
  trezordLogs = Buffer.from("");
}

// dcrd upgrades warning.
const reindexCheck = "Reindexing to height";
const upgradeDatabase = "Upgrading database to version 6";
const reindexing = "Reindexing block information in the database";
const upgradeDB7 = "Upgrading database to version 7";
const upgradeDB12 = "Upgrading database to version 12";
const upgradeJournal3 = "Upgrading spend journal to version 3";

// CheckDaemonLogs checks if dcrd send a message which need to be notified
// to the user.
export function CheckDaemonLogs(data) {
  let hasWarning = false;
  const warningArray = [
    reindexCheck,
    upgradeDatabase,
    reindexing,
    upgradeDB7,
    upgradeDB12,
    upgradeJournal3
  ];
  warningArray.forEach((warnMsg) => {
    if (data.indexOf(warnMsg) > 0) {
      hasWarning = true;
      return;
    }
  });
  return hasWarning;
}
