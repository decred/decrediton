import { app } from "electron";
import winston from "winston";
import path from "path";

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
  const logger = new (winston.Logger)({
    transports: [
      new (winston.transports.File)({
        json: false,
        filename: path.join(app.getPath("userData"), "decrediton.log"),
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
