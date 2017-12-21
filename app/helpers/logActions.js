import fs from "fs";
import path from "path";
import os from "os";
import { getCfg } from "../config";

// getLogFile attempts to read the logfile at the given path
export function getDcrwalletLogs() {
  var logPath = "";
  var cfg = getCfg();

  if (os.platform() == "win32") {
    logPath = path.join(os.homedir(), "AppData", "Local", "Decrediton", "logs", "testnet2", "dcrwallet.log");
  } else if (os.platform() == "darwin") {
    logPath = path.join(os.homedir(), "Library", "Application Support",
            "decrediton", "logs",  "testnet2", "dcrwallet.log");
  } else {
    logPath = path.join(os.homedir(), ".config", "decrediton", "logs",  "testnet2", "dcrwallet.log");
  }

  var logs;
  try {
    logs = fs.readFileSync(logPath, "utf8");
  } catch(err) {
    throw err;
  }
  return logs;
}
