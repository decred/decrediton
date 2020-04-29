import {
  dcrwalletConf,
  getWalletPath,
  getExecutablePath,
  dcrdCfg,
  getDcrdRpcCert
} from "./paths";
import { getWalletCfg, readDcrdConfig, getGlobalCfg } from "config";
import {
  createLogger,
  AddToDcrdLog,
  AddToDcrwalletLog,
  AddToDcrlndLog,
  GetDcrdLogs,
  GetDcrwalletLogs,
  lastErrorLine,
  lastPanicLine,
  ClearDcrwalletLogs,
  CheckDaemonLogs
} from "./logging";
import parseArgs from "minimist";
import { OPTIONS, UPGD_ELECTRON8 } from "constants";
import os from "os";
import fs from "fs-extra";
import util from "util";
import { spawn } from "child_process";
import isRunning from "is-running";
import stringArgv from "string-argv";
import { concat, isString } from "../fp";
import * as ln from "wallet/ln";
import webSocket from "ws";
import path from "path";

const argv = parseArgs(process.argv.slice(1), OPTIONS);
const debug = argv.debug || process.env.NODE_ENV === "development";
const logger = createLogger(debug);

let dcrdPID, dcrwPID, dcrlndPID;

// windows-only stuff
let dcrwPipeRx, dcrwPipeTx, dcrdPipeRx, dcrwTxStream;

let dcrwPort;
let rpcuser, rpcpass, rpccert, rpchost, rpcport;
let dcrlndCreds;

let dcrdSocket,
  heightIsSynced,
  selectedWallet = null;

function closeClis() {
  // shutdown daemon and wallet.
  // Don't try to close if not running.
  if (dcrdPID && dcrdPID !== -1) closeDCRD();
  if (dcrwPID && dcrwPID !== -1) closeDCRW();
  if (dcrlndPID && dcrlndPID !== -1) closeDcrlnd();
}

export const setHeightSynced = (isSynced) => {
  heightIsSynced = isSynced;
  return true;
};

export const getHeightSynced = () => heightIsSynced;

export const setDcrdRpcCredentials = ({
  rpc_user,
  rpc_pass,
  rpc_cert,
  rpc_host,
  rpc_port
}) => {
  rpcuser = rpc_user;
  rpcpass = rpc_pass;
  rpccert = rpc_cert;
  rpchost = rpc_host;
  rpcport = rpc_port;
  return true;
};

export const getDcrdRpcCredentials = () => ({
  rpc_user: rpcuser,
  rpc_pass: rpcpass,
  rpc_cert: rpccert,
  rpc_host: rpchost,
  rpc_port: rpcport
});

export const setSelectedWallet = (w) => {
  return (selectedWallet = w);
};

export const getSelectedWallet = () => selectedWallet;

export function closeDCRD() {
  if (dcrdPID === -1) {
    // process is not started by decrediton
    return true;
  }
  if (isRunning(dcrdPID) && os.platform() != "win32") {
    logger.log("info", "Sending SIGINT to dcrd at pid:" + dcrdPID);
    process.kill(dcrdPID, "SIGINT");
    dcrdPID = null;
  } else if (require("is-running")(dcrdPID)) {
    try {
      const win32ipc = require("../node_modules/win32ipc/build/Release/win32ipc.node");
      win32ipc.closePipe(dcrdPipeRx);
      dcrdPID = null;
    } catch (e) {
      logger.log("error", "Error closing dcrd piperx: " + e);
      return false;
    }
  }
  return true;
}

export const closeDCRW = () => {
  if (dcrwPID === -1) {
    // process is not started by decrediton
    return true;
  }
  try {
    if (isRunning(dcrwPID) && os.platform() != "win32") {
      logger.log("info", "Sending SIGINT to dcrwallet at pid:" + dcrwPID);
      process.kill(dcrwPID, "SIGINT");
    } else if (isRunning(dcrwPID)) {
      try {
        const win32ipc = require("../node_modules/win32ipc/build/Release/win32ipc.node");
        dcrwTxStream.close();
        win32ipc.closePipe(dcrwPipeTx);
        win32ipc.closePipe(dcrwPipeRx);
      } catch (e) {
        logger.log("error", "Error closing dcrwallet piperx: " + e);
      }
    }
    dcrwPID = null;
    return true;
  } catch (e) {
    logger.log("error", "error closing wallet: " + e);
    return false;
  }
};

// Send a shutdown request to the dcrlnd daemon. Only used in windows while
// we don't have piperx/pipetx to command it.
const rpcStopDcrlnd = async (creds) => {
  logger.log("info", "Stopping dcrlnd daemon via RPC call");
  const lnClient = await ln.getLightningClient(
    creds.address,
    creds.port,
    creds.certPath,
    creds.macaroonPath
  );
  await ln.stopDaemon(lnClient);
};

export const closeDcrlnd = () => {
  if (dcrlndPID === -1) {
    // process is not started by decrediton
    return true;
  }
  if (isRunning(dcrlndPID) && os.platform() != "win32") {
    logger.log("info", "Sending SIGINT to dcrlnd at pid:" + dcrlndPID);
    process.kill(dcrlndPID, "SIGINT");
    dcrlndPID = null;
    dcrlndCreds = null;
  } else if (require("is-running")(dcrlndPID)) {
    // TODO: needs piperx (and ideally pipetx) in dcrlnd
    // For the moment we'll use the StopDaemon() rpc call in dcrlnd.
    /*
    try {
      const win32ipc = require("../node_modules/win32ipc/build/Release/win32ipc.node");
      win32ipc.closePipe(dcrlndPipeRx);
      dcrlndPID = null;
      dcrlndCreds = null;
    } catch (e) {
      logger.log("error", "Error closing dcrlnd piperx: " + e);
      return false;
    }
    */
    rpcStopDcrlnd(dcrlndCreds);
    dcrlndPID = null;
    dcrlndCreds = null;
  }
  return true;
};

export function cleanShutdown(mainWindow, app) {
  // Attempt a clean shutdown.
  return new Promise((resolve) => {
    const cliShutDownPause = 2; // in seconds.
    const shutDownPause = 3; // in seconds.
    closeClis();
    // Sent shutdown message again as we have seen it missed in the past if they
    // are still running.
    setTimeout(function () {
      closeClis();
    }, cliShutDownPause * 1000);
    logger.log("info", "Closing decrediton.");

    const shutdownTimer = setInterval(function () {
      const stillRunning =
        dcrdPID !== -1 && isRunning(dcrdPID) && os.platform() != "win32";

      if (!stillRunning) {
        logger.log("info", "Final shutdown pause. Quitting app.");
        clearInterval(shutdownTimer);
        if (mainWindow) {
          mainWindow.webContents.send("daemon-stopped");
          setTimeout(() => {
            mainWindow.close();
            app.quit();
          }, 1000);
        } else {
          app.quit();
        }
        resolve(true);
      }
      logger.log(
        "info",
        "Daemon still running in final shutdown pause. Waiting."
      );
    }, shutDownPause * 1000);
  });
}

// launchDCRD checks launches dcrd
export const launchDCRD = (reactIPC, testnet, appdata) =>
  new Promise((resolve, reject) => {
    const dcrdExe = getExecutablePath("dcrd", argv.custombinpath);
    if (!fs.existsSync(dcrdExe)) {
      logger.log(
        "error",
        "The dcrd executable does not exist. Expected to find it at " + dcrdExe
      );
      return;
    }

    const args = ["--nolisten", "--tlscurve=P-256"];
    const newConfig = readDcrdConfig(testnet, appdata);

    args.push(`--appdata=${newConfig.appdata}`);
    args.push(`--configfile=${dcrdCfg(newConfig.configFile)}`);
    if (testnet) {
      args.push("--testnet");
    }

    // Upgrade for electron 8.0+ which doesn't support curve P-521: in systems
    // with the previous version of decrediton installed we need to remove the
    // rpc.key file so that the tls cert is recreated.
    const rpcCertPath = getDcrdRpcCert(newConfig.appdata);
    const rpcKeyPath = rpcCertPath.replace(/\.cert$/, ".key");
    const globalCfg = getGlobalCfg();
    if (!globalCfg.get(UPGD_ELECTRON8)) {
      if (fs.existsSync(rpcKeyPath)) {
        logger.log(
          "info",
          "Removing dcrd TLS key file for electron 8 upgrade at " + rpcKeyPath
        );
        fs.unlinkSync(rpcKeyPath);
      }
      if (fs.existsSync(rpcCertPath)) {
        logger.log(
          "info",
          "Removing dcrd TLS cert file for electron 8 upgrade at " + rpcCertPath
        );
        fs.unlinkSync(rpcCertPath);
      }
      globalCfg.set(UPGD_ELECTRON8, true);
    }

    rpcuser = newConfig.rpc_user;
    rpcpass = newConfig.rpc_pass;
    newConfig.rpc_cert = rpcCertPath;
    rpccert = newConfig.rpc_cert;
    rpchost = newConfig.rpc_host;
    rpcport = newConfig.rpc_port;

    if (os.platform() == "win32") {
      try {
        const win32ipc = require("../node_modules/win32ipc/build/Release/win32ipc.node");
        dcrdPipeRx = win32ipc.createPipe("out");
        args.push(util.format("--piperx=%d", dcrdPipeRx.readEnd));
      } catch (e) {
        logger.log("error", "can't find proper module to launch dcrd: " + e);
      }
    }

    logger.log("info", `Starting ${dcrdExe} with ${args}`);

    const dcrd = spawn(dcrdExe, args, {
      detached: os.platform() === "win32",
      stdio: ["ignore", "pipe", "pipe"]
    });

    dcrd.on("error", function (err) {
      reactIPC.send("error-received", true, err);
      reject(err);
    });

    dcrd.on("close", (code) => {
      if (code !== 0) {
        let lastDcrdErr = lastErrorLine(GetDcrdLogs());
        if (!lastDcrdErr || lastDcrdErr === "") {
          lastDcrdErr = lastPanicLine(GetDcrdLogs());
        }
        logger.log("error", "dcrd closed due to an error: ", lastDcrdErr);
        reactIPC.send("error-received", true, lastDcrdErr);
        reject(lastDcrdErr);
      }

      logger.log("info", `dcrd exited with code ${code}`);
    });

    dcrd.stdout.on("data", (data) => {
      AddToDcrdLog(process.stdout, data, debug);
      const dataString = data.toString("utf-8");
      if (CheckDaemonLogs(dataString)) {
        reactIPC.send("warning-received", true, dataString);
      }
      if (dataString.includes("New valid peer")) {
        newConfig.pid = dcrd.pid;
        dcrdPID = dcrd.pid;
        logger.log("info", "dcrd started with pid:" + newConfig.pid);

        dcrd.unref();
        return resolve(newConfig);
      }
    });

    dcrd.stderr.on("data", (data) => {
      AddToDcrdLog(process.stderr, data, debug);
      reactIPC.send("error-received", true, data.toString("utf-8"));
      reject(data.toString("utf-8"));
    });
  });

// DecodeDaemonIPCData decodes messages from an IPC message received from dcrd/
// dcrwallet using their internal IPC protocol.
// NOTE: very simple impl for the moment, will break if messages get split
// between data calls.
const DecodeDaemonIPCData = (data, cb) => {
  let i = 0;
  while (i < data.length) {
    if (data[i++] !== 0x01)
      throw "Wrong protocol version when decoding IPC data";
    const mtypelen = data[i++];
    const mtype = data.slice(i, i + mtypelen).toString("utf-8");
    i += mtypelen;
    const psize = data.readUInt32LE(i);
    i += 4;
    const payload = data.slice(i, i + psize);
    i += psize;
    cb(mtype, payload);
  }
};

export const launchDCRWallet = (
  mainWindow,
  daemonIsAdvanced,
  walletPath,
  testnet,
  reactIPC
) => {
  const cfg = getWalletCfg(testnet, walletPath);
  const confFile = fs.existsSync(
    dcrwalletConf(getWalletPath(testnet, walletPath))
  )
    ? `--configfile=${dcrwalletConf(getWalletPath(testnet, walletPath))}`
    : "";
  let args = [confFile];

  args.push("--gaplimit=" + cfg.get("gaplimit"));

  const dcrwExe = getExecutablePath("dcrwallet", argv.custombinpath);
  if (!fs.existsSync(dcrwExe)) {
    logger.log(
      "error",
      "The dcrwallet executable does not exist. Expected to find it at " +
        dcrwExe
    );
    return;
  }

  const notifyGrpcPort = (port) => {
    dcrwPort = port;
    logger.log("info", "wallet grpc running on port", port);
    mainWindow.webContents.send("dcrwallet-port", port);
  };

  const decodeDcrwIPC = (data) =>
    DecodeDaemonIPCData(data, (mtype, payload) => {
      if (mtype === "grpclistener") {
        const intf = payload.toString("utf-8");
        const matches = intf.match(/^.+:(\d+)$/);
        if (matches) {
          notifyGrpcPort(matches[1]);
        } else {
          logger.log(
            "error",
            "GRPC port not found on IPC channel to dcrwallet: " + intf
          );
        }
      }
    });

  if (os.platform() == "win32") {
    try {
      const win32ipc = require("../node_modules/win32ipc/build/Release/win32ipc.node");
      dcrwPipeRx = win32ipc.createPipe("out");
      args.push(util.format("--piperx=%d", dcrwPipeRx.readEnd));

      dcrwPipeTx = win32ipc.createPipe("in");
      args.push(util.format("--pipetx=%d", dcrwPipeTx.writeEnd));
      args.push("--rpclistenerevents");
      const pipeTxReadFd = win32ipc.getPipeEndFd(dcrwPipeTx.readEnd);
      dcrwPipeTx.readEnd = -1; // -1 == INVALID_HANDLE_VALUE

      dcrwTxStream = fs.createReadStream("", { fd: pipeTxReadFd });
      dcrwTxStream.on("data", decodeDcrwIPC);
      dcrwTxStream.on(
        "error",
        (e) =>
          e &&
          e.code &&
          e.code != "EOF" &&
          logger.log("error", "tx stream error", e)
      );
      dcrwTxStream.on("close", () =>
        logger.log("info", "dcrwallet tx stream closed")
      );
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
    stdio: ["ignore", "pipe", "pipe", "ignore", "pipe"]
  });

  if (os.platform() !== "win32") {
    dcrwallet.stdio[4].on("data", decodeDcrwIPC);
  }

  dcrwallet.on("error", function (err) {
    logger.log(
      "error",
      "Error running dcrwallet.  Check logs and restart! " + err
    );
    mainWindow.webContents.executeJavaScript(
      'alert("Error running dcrwallet.  Check logs and restart! ' + err + '");'
    );
    mainWindow.webContents.executeJavaScript("window.close();");
  });

  dcrwallet.on("close", (code) => {
    if (daemonIsAdvanced) return;
    if (code !== 0) {
      let lastDcrwalletErr = lastErrorLine(GetDcrwalletLogs());
      if (!lastDcrwalletErr || lastDcrwalletErr == "") {
        lastDcrwalletErr = lastPanicLine(GetDcrwalletLogs());
      }
      logger.log(
        "error",
        "dcrwallet closed due to an error: ",
        lastDcrwalletErr
      );
      reactIPC.send("error-received", false, lastDcrwalletErr);
    } else {
      logger.log("info", `dcrwallet exited with code ${code}`);
    }
    ClearDcrwalletLogs();
  });

  const addStdoutToLogListener = (data) =>
    AddToDcrwalletLog(process.stdout, data, debug);

  dcrwallet.stdout.on("data", addStdoutToLogListener);
  dcrwallet.stderr.on("data", (data) => {
    AddToDcrwalletLog(process.stderr, data, debug);
  });

  dcrwPID = dcrwallet.pid;
  logger.log("info", "dcrwallet started with pid:" + dcrwPID);

  dcrwallet.unref();
  return dcrwPID;
};

export const launchDCRLnd = (
  walletAccount,
  walletPort,
  rpcCreds,
  walletPath,
  testnet,
  autopilotEnabled
) =>
  new Promise((resolve, reject) => {
    if (dcrlndPID === -1) {
      resolve();
    }

    const dcrlndRoot = path.join(walletPath, "dcrlnd");
    const tlsCertPath = path.join(dcrlndRoot, "tls.cert");
    const adminMacaroonPath = path.join(dcrlndRoot, "admin.macaroon");

    const args = [
      "--nolisten",
      "--logdir=" + path.join(dcrlndRoot, "logs"),
      "--datadir=" + path.join(dcrlndRoot, "data"),
      "--tlscertpath=" + tlsCertPath,
      "--tlskeypath=" + path.join(dcrlndRoot, "tls.key"),
      "--configfile=" + path.join(dcrlndRoot, "dcrlnd.conf"),
      "--adminmacaroonpath=" + adminMacaroonPath,
      "--node=dcrd",
      "--dcrd.rpchost=" + rpcCreds.rpc_host + ":" + rpcCreds.rpc_port,
      "--dcrd.rpcuser=" + rpcCreds.rpc_user,
      "--dcrd.rpcpass=" + rpcCreds.rpc_pass,
      "--dcrwallet.grpchost=localhost:" + walletPort,
      "--dcrwallet.certpath=" + path.join(walletPath, "rpc.cert"),
      "--dcrwallet.accountnumber=" + walletAccount
    ];

    if (testnet) {
      args.push("--testnet");
    }

    if (autopilotEnabled) {
      args.push("--autopilot.active");
    }

    const dcrlndExe = getExecutablePath("dcrlnd", argv.custombinpath);
    if (!fs.existsSync(dcrlndExe)) {
      logger.log(
        "error",
        "The dcrlnd executable does not exist. Expected to find it at " +
          dcrlndExe
      );
      reject("The dcrlnd executable does not exist at " + dcrlndExe);
    }

    /*
  if (os.platform() == "win32") {
    try {
      const win32ipc = require("../node_modules/win32ipc/build/Release/win32ipc.node");
      dcrdPipeRx = win32ipc.createPipe("out");
      args.push(util.format("--piperx=%d", dcrdPipeRx.readEnd));
    } catch (e) {
      logger.log("error", "can't find proper module to launch dcrd: " + e);
    }
  }
  */

    const fullArgs = args.join(" ");
    logger.log("info", `Starting ${dcrlndExe} with ${fullArgs}`);

    const dcrlnd = spawn(dcrlndExe, args, {
      detached: os.platform() === "win32",
      stdio: ["ignore", "pipe", "pipe"]
    });

    dcrlnd.on("error", function (err) {
      reject(err);
    });

    dcrlnd.on("close", (code) => {
      /*
    if (code !== 0) {
      let lastDcrdErr = lastErrorLine(GetDcrdLogs());
      if (!lastDcrdErr || lastDcrdErr === "") {
        lastDcrdErr = lastPanicLine(GetDcrdLogs());
      }
      logger.log("error", "dcrd closed due to an error: ", lastDcrdErr);
      return reject(lastDcrdErr);
    }
    */

      logger.log("info", `dcrlnd exited with code ${code}`);
    });

    dcrlnd.stdout.on("data", (data) => {
      AddToDcrlndLog(process.stdout, data, debug);
      resolve(data.toString("utf-8"));
    });

    dcrlnd.stderr.on("data", (data) => {
      AddToDcrlndLog(process.stderr, data, debug);
      reject(data.toString("utf-8"));
    });

    dcrlndPID = dcrlnd.pid;
    logger.log("info", "dcrlnd started with pid:" + dcrlndPID);

    dcrlnd.unref();

    dcrlndCreds = {
      address: "localhost",
      port: 10009,
      certPath: tlsCertPath,
      macaroonPath: adminMacaroonPath
    };
    return resolve(dcrlndCreds);
  });

export const GetDcrwPort = () => dcrwPort;

export const GetDcrdPID = () => dcrdPID;

export const GetDcrwPID = () => dcrwPID;

export const GetDcrlndPID = () => dcrlndPID;
export const GetDcrlndCreds = () => dcrlndCreds;

export const readExesVersion = (app, grpcVersions) => {
  const args = ["--version"];
  const exes = ["dcrd", "dcrwallet", "dcrctl"];
  const versions = {
    grpc: grpcVersions,
    decrediton: app.getVersion()
  };

  for (const exe of exes) {
    const exePath = getExecutablePath("dcrd", argv.custombinpath);
    if (!fs.existsSync(exePath)) {
      logger.log(
        "error",
        "The dcrd executable does not exist. Expected to find it at " + exePath
      );
    }

    const proc = spawn(exePath, args, { encoding: "utf8" });
    if (proc.error) {
      logger.log(
        "error",
        `Error trying to read version of ${exe}: ${proc.error}`
      );
      continue;
    }

    const versionLine = proc.stdout.toString();
    if (!versionLine) {
      logger.log("error", `Empty version line when reading version of ${exe}`);
      continue;
    }

    const decodedLine = versionLine.match(/\w+ version ([^\s]+)/);
    if (decodedLine !== null) {
      versions[exe] = decodedLine[1];
    } else {
      logger.log("error", `Unable to decode version line ${versionLine}`);
    }
  }

  return versions;
};

// connectDaemon starts a new rpc connection to dcrd
export const connectRpcDaemon = async (mainWindow, rpcCreds) => {
  let rpc_user, rpc_pass, rpc_cert, rpc_host, rpc_port;

  if (rpcCreds) {
    setDcrdRpcCredentials(rpcCreds);
    rpc_user = rpcCreds.rpc_user;
    rpc_pass = rpcCreds.rpc_pass;
    rpc_cert = rpcCreds.rpc_cert;
    rpc_host = rpcCreds.rpc_host;
    rpc_port = rpcCreds.rpc_port;
  } else {
    rpc_user = rpcuser;
    rpc_pass = rpcpass;
    rpc_cert = rpccert;
    rpc_host = rpchost;
    rpc_port = rpcport;
  }

  try {
    // During the first startup, the rpc.cert file might not exist for a few
    // seconds. In that case, we wait up to 30s before failing this call.
    let tries = 0;
    const sleep = (ms) => new Promise((ok) => setTimeout(ok, ms));
    while (tries++ < 30 && !fs.existsSync(rpc_cert)) await sleep(1000);
    if (!fs.existsSync(rpc_cert)) {
      return mainWindow.webContents.send("connectRpcDaemon-response", {
        error: new Error("rpc cert '" + rpc_cert + "' does not exist")
      });
    }

    const cert = fs.readFileSync(rpc_cert);
    const url = `${rpc_host}:${rpc_port}`;
    if (dcrdSocket && dcrdSocket.readyState === dcrdSocket.OPEN) {
      return mainWindow.webContents.send("connectRpcDaemon-response", {
        connected: true
      });
    }
    dcrdSocket = new webSocket(`wss://${url}/ws`, {
      headers: {
        Authorization:
          "Basic " + Buffer.from(rpc_user + ":" + rpc_pass).toString("base64")
      },
      cert: cert,
      ecdhCurve: "secp521r1",
      ca: [cert]
    });
    dcrdSocket.on("open", function () {
      logger.log("info", "decrediton has connected to dcrd instance");
      return mainWindow.webContents.send("connectRpcDaemon-response", {
        connected: true
      });
    });
    dcrdSocket.on("error", function (error) {
      logger.log("error", `Error: ${error}`);
      return mainWindow.webContents.send("connectRpcDaemon-response", {
        connected: false,
        error: error.toString()
      });
    });
    dcrdSocket.on("message", function (data) {
      const parsedData = JSON.parse(data);
      const id = parsedData ? parsedData.id : "";
      switch (id) {
        case "getinfo":
          mainWindow.webContents.send(
            "check-getinfo-response",
            parsedData.result
          );
          break;
        case "getblockchaininfo": {
          const dataResults = parsedData.result || {};
          const blockCount = dataResults.blocks;
          const syncHeight = dataResults.syncheight;
          mainWindow.webContents.send("check-daemon-response", {
            blockCount,
            syncHeight
          });
          break;
        }
      }
    });
    dcrdSocket.on("close", () => {
      logger.log("info", "decrediton has disconnected to dcrd instance");
    });
  } catch (error) {
    return mainWindow.webContents.send("connectRpcDaemon-response", {
      connected: false,
      error
    });
  }
};

export const getDaemonInfo = () =>
  dcrdSocket.send(
    '{"jsonrpc":"1.0","id":"getinfo","method":"getinfo","params":[]}'
  );

export const getBlockChainInfo = () =>
  new Promise((resolve) => {
    if (dcrdSocket && dcrdSocket.readyState === dcrdSocket.CLOSED) {
      return resolve({});
    }
    dcrdSocket.send(
      '{"jsonrpc":"1.0","id":"getblockchaininfo","method":"getblockchaininfo","params":[]}'
    );
  });
