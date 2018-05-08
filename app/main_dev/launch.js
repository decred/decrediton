import { dcrwalletCfg, getWalletPath, getExecutablePath, dcrdCfg, getDcrdRpcCert } from "./paths";
import { getWalletCfg, readDcrdConfig } from "../config";
import { createLogger, AddToDcrdLog, AddToDcrwalletLog } from "./logging";
import parseArgs from "minimist";
import { OPTIONS } from "./constants";
import os from "os";
import fs from "fs-extra";
import stringArgv from "string-argv";
import { concat, isString } from "lodash";

const argv = parseArgs(process.argv.slice(1), OPTIONS);
const debug = argv.debug || process.env.NODE_ENV === "development";
const logger = createLogger(debug);

let dcrwPort;

function closeClis(dcrdPID, dcrwPID) {
  // shutdown daemon and wallet.
  // Don't try to close if not running.
  if(dcrdPID && dcrdPID !== -1)
    closeDCRD(dcrdPID);
  if(dcrwPID && dcrwPID !== -1)
    closeDCRW(dcrwPID);
}

function closeDCRD(dcrdPID) {
  if (require("is-running")(dcrdPID) && os.platform() != "win32") {
    logger.log("info", "Sending SIGINT to dcrd at pid:" + dcrdPID);
    process.kill(dcrdPID, "SIGINT");
  }
}

export const closeDCRW = (dcrwPID) => {
  if (require("is-running")(dcrwPID) && os.platform() != "win32") {
    logger.log("info", "Sending SIGINT to dcrwallet at pid:" + dcrwPID);
    process.kill(dcrwPID, "SIGINT");
  }
};

export async function cleanShutdown(mainWindow, app, dcrdPID, dcrwPID) {
  // Attempt a clean shutdown.
  return new Promise(resolve => {
    const cliShutDownPause = 2; // in seconds.
    const shutDownPause = 3; // in seconds.
    closeClis(dcrdPID, dcrwPID);
    // Sent shutdown message again as we have seen it missed in the past if they
    // are still running.
    setTimeout(function () { closeClis(dcrdPID, dcrwPID); }, cliShutDownPause * 1000);
    logger.log("info", "Closing decrediton.");

    let shutdownTimer = setInterval(function () {
      const stillRunning = (require("is-running")(dcrdPID) && os.platform() != "win32");

      if (!stillRunning) {
        logger.log("info", "Final shutdown pause. Quitting app.");
        clearInterval(shutdownTimer);
        if (mainWindow) {
          mainWindow.webContents.send("daemon-stopped");
          setTimeout(() => { mainWindow.close(); app.quit(); }, 1000);
        } else {
          app.quit();
        }
        resolve(true);
      }
      logger.log("info", "Daemon still running in final shutdown pause. Waiting.");

    }, shutDownPause * 1000);
  });
}

export const launchDCRD = (mainWindow, daemonIsAdvanced, daemonPath, appdata, testnet) => {
  const spawn = require("child_process").spawn;
  let args = [];
  let newConfig = {};
  if (appdata) {
    args = [ `--appdata=${appdata}` ];
    newConfig = readDcrdConfig(appdata, testnet);
    newConfig.rpc_cert = getDcrdRpcCert(appdata);
  } else {
    args = [ `--configfile=${dcrdCfg(daemonPath)}` ];
    newConfig = readDcrdConfig(daemonPath, testnet);
    newConfig.rpc_cert = getDcrdRpcCert();
  }
  if (testnet) {
    args.push("--testnet");
  }

  const dcrdExe = getExecutablePath("dcrd", argv.customBinPath);
  if (!fs.existsSync(dcrdExe)) {
    logger.log("error", "The dcrd file does not exists");
    return;
  }

  if (os.platform() == "win32") {
    try {
      const util = require("util");
      const win32ipc = require("./node_modules/win32ipc/build/Release/win32ipc.node");
      var pipe = win32ipc.createPipe("out");
      args.push(util.format("--piperx=%d", pipe.readEnd));
    } catch (e) {
      logger.log("error", "can't find proper module to launch dcrd: " + e);
    }
  }

  logger.log("info", `Starting ${dcrdExe} with ${args}`);

  const dcrd = spawn(dcrdExe, args, {
    detached: os.platform() == "win32",
    stdio: [ "ignore", "pipe", "pipe" ]
  });

  dcrd.on("error", function (err) {
    logger.log("error", "Error running dcrd.  Check logs and restart! " + err);
    mainWindow.webContents.executeJavaScript("alert(\"Error running dcrd.  Check logs and restart! " + err + "\");");
    mainWindow.webContents.executeJavaScript("window.close();");
  });

  dcrd.on("close", (code) => {
    if (daemonIsAdvanced)
      return;
    if (code !== 0) {
      logger.log("error", "dcrd closed due to an error.  Check dcrd logs and contact support if the issue persists.");
      mainWindow.webContents.executeJavaScript("alert(\"dcrd closed due to an error.  Check dcrd logs and contact support if the issue persists.\");");
      mainWindow.webContents.executeJavaScript("window.close();");
    } else {
      logger.log("info", `dcrd exited with code ${code}`);
    }
  });

  dcrd.stdout.on("data", (data) => AddToDcrdLog(process.stdout, data, debug));
  dcrd.stderr.on("data", (data) => AddToDcrdLog(process.stderr, data, debug));

  newConfig.pid = dcrd.pid;
  logger.log("info", "dcrd started with pid:" + newConfig.pid);

  dcrd.unref();
  return newConfig;
};

// DecodeDaemonIPCData decodes messages from an IPC message received from dcrd/
// dcrwallet using their internal IPC protocol.
// NOTE: very simple impl for the moment, will break if messages get split
// between data calls.
const DecodeDaemonIPCData = (logger, data, cb) => {
  let i = 0;
  while (i < data.length) {
    if (data[i++] !== 0x01) throw "Wrong protocol version when decoding IPC data";
    const mtypelen = data[i++];
    const mtype = data.slice(i, i+mtypelen).toString("utf-8");
    i += mtypelen;
    const psize = data.readUInt32LE(i);
    i += 4;
    const payload = data.slice(i, i+psize);
    i += psize;
    cb(mtype, payload);
  }
};

export const launchDCRWallet = (mainWindow, daemonIsAdvanced, walletPath, testnet) => {
  const spawn = require("child_process").spawn;
  let args = [ "--configfile=" + dcrwalletCfg(getWalletPath(testnet, walletPath)) ];

  let dcrwPID;
  const cfg = getWalletCfg(testnet, walletPath);

  args.push("--ticketbuyer.nospreadticketpurchases");
  args.push("--ticketbuyer.balancetomaintainabsolute=" + cfg.get("balancetomaintain"));
  args.push("--ticketbuyer.maxfee=" + cfg.get("maxfee"));
  args.push("--ticketbuyer.maxpricerelative=" + cfg.get("maxpricerelative"));
  args.push("--ticketbuyer.maxpriceabsolute=" + cfg.get("maxpriceabsolute"));
  args.push("--ticketbuyer.maxperblock=" + cfg.get("maxperblock"));
  args.push("--addridxscanlen=" + cfg.get("gaplimit"));

  const dcrwExe = getExecutablePath("dcrwallet", argv.customBinPath);
  if (!fs.existsSync(dcrwExe)) {
    logger.log("error", "The dcrwallet file does not exists");
    return;
  }

  if (os.platform() == "win32") {
    try {
      const util = require("util");
      const win32ipc = require("../../node_modules/win32ipc/build/Release/win32ipc.node");
      const pipe = win32ipc.createPipe("out");
      args.push(util.format("--piperx=%d", pipe.readEnd));
    } catch (e) {
      logger.log("error", "can't find proper module to launch dcrwallet: " + e);
    }
  } else {
    args.push("--rpclistenerevents");
    args.push("--pipetx=4");
  }

  // Add any extra args if defined.
  if (argv.extrawalletargs !== undefined && isString(argv.extrawalletargs)) {
    args = concat(args, stringArgv(argv.extrawalletargs));
  }

  logger.log("info", `Starting ${dcrwExe} with ${args}`);

  const dcrwallet = spawn(dcrwExe, args, {
    detached: os.platform() == "win32",
    stdio: [ "ignore", "pipe", "pipe", "ignore", "pipe" ]
  });

  const notifyGrpcPort = (port) => {
    dcrwPort = port;
    logger.log("info", "wallet grpc running on port", port);
    mainWindow.webContents.send("dcrwallet-port", port);
  };

  dcrwallet.stdio[4].on("data", (data) => DecodeDaemonIPCData(logger, data, (mtype, payload) => {
    if (mtype === "grpclistener") {
      const intf = payload.toString("utf-8");
      const matches = intf.match(/^.+:(\d+)$/);
      if (matches) {
        notifyGrpcPort(matches[1]);
      } else {
        logger.log("error", "GRPC port not found on IPC channel to dcrwallet: " + intf);
      }
    }
  }));

  dcrwallet.on("error", function (err) {
    logger.log("error", "Error running dcrwallet.  Check logs and restart! " + err);
    mainWindow.webContents.executeJavaScript("alert(\"Error running dcrwallet.  Check logs and restart! " + err + "\");");
    mainWindow.webContents.executeJavaScript("window.close();");
  });

  dcrwallet.on("close", (code) => {
    if (daemonIsAdvanced)
      return;
    if (code !== 0) {
      logger.log("error", "dcrwallet closed due to an error.  Check dcrwallet logs and contact support if the issue persists.");
      mainWindow.webContents.executeJavaScript("alert(\"dcrwallet closed due to an error.  Check dcrwallet logs and contact support if the issue persists.\");");
      mainWindow.webContents.executeJavaScript("window.close();");
    } else {
      logger.log("info", `dcrwallet exited with code ${code}`);
    }
  });

  const addStdoutToLogListener = (data) => AddToDcrwalletLog(process.stdout, data, debug);

  // waitForGrpcPortListener is added as a stdout on("data") listener only on
  // win32 because so far that's the only way we found to get back the grpc port
  // on that platform. For linux/macOS users, the --pipetx argument is used to
  // provide a pipe back to decrediton, which reads the grpc port in a secure and
  // reliable way.
  const waitForGrpcPortListener = (data) => {
    const matches = /DCRW: gRPC server listening on [^ ]+:(\d+)/.exec(data);
    if (matches) {
      notifyGrpcPort(matches[1]);
      // swap the listener since we don't need to keep looking for the port
      dcrwallet.stdout.removeListener("data", waitForGrpcPortListener);
      dcrwallet.stdout.on("data", addStdoutToLogListener);
    }
    AddToDcrwalletLog(process.stdout, data, debug);
  };

  dcrwallet.stdout.on("data", os.platform() == "win32" ? waitForGrpcPortListener : addStdoutToLogListener);
  dcrwallet.stderr.on("data", (data) => {
    AddToDcrwalletLog(process.stderr, data, debug);
  });

  dcrwPID = dcrwallet.pid;
  logger.log("info", "dcrwallet started with pid:" + dcrwPID);

  dcrwallet.unref();
  return dcrwPID;
};

export const GetDcrwPort = () => dcrwPort;
