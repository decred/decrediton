import { dcrwalletCfg, getWalletPath, getExecutablePath, dcrdCfg, getDcrdRpcCert } from "./paths";
import { getWalletCfg, readDcrdConfig } from "../config";
import { createLogger, AddToDcrdLog, AddToDcrwalletLog, GetDcrdLogs,
  GetDcrwalletLogs, lastErrorLine, lastPanicLine, ClearDcrwalletLogs, CheckDaemonLogs } from "./logging";
import parseArgs from "minimist";
import { OPTIONS } from "./constants";
import os from "os";
import fs from "fs-extra";
import util from "util";
import { spawn } from "child_process";
import isRunning from "is-running";
import stringArgv from "string-argv";
import { concat, isString } from "../fp";
import webSocket from "ws";
import { reverseRawHash, hexToRaw } from "../helpers";
import { Uint64LE } from "int64-buffer";

const argv = parseArgs(process.argv.slice(1), OPTIONS);
const debug = argv.debug || process.env.NODE_ENV === "development";
const logger = createLogger(debug);

let dcrdPID, dcrwPID;

// windows-only stuff
let dcrwPipeRx, dcrwPipeTx, dcrdPipeRx, dcrwTxStream;

let dcrwPort;
let rpcuser, rpcpass, rpccert, rpchost, rpcport;

let dcrdSocket = null;

function closeClis() {
  // shutdown daemon and wallet.
  // Don't try to close if not running.
  if(dcrdPID && dcrdPID !== -1)
    closeDCRD(dcrdPID);
  if(dcrwPID && dcrwPID !== -1)
    closeDCRW(dcrwPID);
}

export function closeDCRD() {
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

export async function cleanShutdown(mainWindow, app) {
  // Attempt a clean shutdown.
  return new Promise(resolve => {
    const cliShutDownPause = 2; // in seconds.
    const shutDownPause = 3; // in seconds.
    closeClis();
    // Sent shutdown message again as we have seen it missed in the past if they
    // are still running.
    setTimeout(function () { closeClis(); }, cliShutDownPause * 1000);
    logger.log("info", "Closing decrediton.");

    let shutdownTimer = setInterval(function () {
      const stillRunning = (isRunning(dcrdPID) && os.platform() != "win32");

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

export const launchDCRD = (mainWindow, daemonIsAdvanced, daemonPath, appdata, testnet, reactIPC) => {
  let args = [ "--nolisten" ];
  let newConfig = {};
  if (appdata) {
    newConfig = readDcrdConfig(appdata, testnet);
    newConfig.rpc_cert = getDcrdRpcCert(appdata);
    args.push(`--appdata=${appdata}`);
    args.push(`--rpcuser=${newConfig.rpc_user}`);
    args.push(`--rpcpass=${newConfig.rpc_password}`);
  } else {
    args.push(`--configfile=${dcrdCfg(daemonPath)}`);
    newConfig = readDcrdConfig(daemonPath, testnet);
    newConfig.rpc_cert = getDcrdRpcCert();
  }
  if (testnet) {
    args.push("--testnet");
  }
  rpcuser = newConfig.rpc_user;
  rpcpass = newConfig.rpc_password;
  rpccert = newConfig.rpc_cert;
  rpchost = newConfig.rpc_host;
  rpcport = newConfig.rpc_port;

  const dcrdExe = getExecutablePath("dcrd", argv.custombinpath);
  if (!fs.existsSync(dcrdExe)) {
    logger.log("error", "The dcrd executable does not exist. Expected to find it at " + dcrdExe);
    return;
  }

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
      var lastDcrdErr = lastErrorLine(GetDcrdLogs());
      if (!lastDcrdErr || lastDcrdErr == "") {
        lastDcrdErr = lastPanicLine(GetDcrdLogs());
        console.log("panic error", lastDcrdErr);
      }
      logger.log("error", "dcrd closed due to an error: ", lastDcrdErr);
      reactIPC.send("error-received", true, lastDcrdErr);
    } else {
      logger.log("info", `dcrd exited with code ${code}`);
    }
  });

  dcrd.stdout.on("data", (data) => {
    AddToDcrdLog(process.stdout, data, debug);
    if (CheckDaemonLogs(data)) {
      reactIPC.send("warning-received", true, data.toString("utf-8"));
    }
  });
  dcrd.stderr.on("data", (data) => AddToDcrdLog(process.stderr, data, debug));

  newConfig.pid = dcrd.pid;
  dcrdPID = dcrd.pid;
  logger.log("info", "dcrd started with pid:" + newConfig.pid);

  dcrd.unref();
  return newConfig;
};

// DecodeDaemonIPCData decodes messages from an IPC message received from dcrd/
// dcrwallet using their internal IPC protocol.
// NOTE: very simple impl for the moment, will break if messages get split
// between data calls.
const DecodeDaemonIPCData = (data, cb) => {
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

export const launchDCRWallet = (mainWindow, daemonIsAdvanced, walletPath, testnet, reactIPC) => {
  let args = [ "--configfile=" + dcrwalletCfg(getWalletPath(testnet, walletPath)) ];

  const cfg = getWalletCfg(testnet, walletPath);

  args.push("--gaplimit=" + cfg.get("gaplimit"));

  const dcrwExe = getExecutablePath("dcrwallet", argv.custombinpath);
  if (!fs.existsSync(dcrwExe)) {
    logger.log("error", "The dcrwallet executable does not exist. Expected to find it at " + dcrwExe);
    return;
  }

  const notifyGrpcPort = (port) => {
    dcrwPort = port;
    logger.log("info", "wallet grpc running on port", port);
    mainWindow.webContents.send("dcrwallet-port", port);
  };

  const decodeDcrwIPC = data => DecodeDaemonIPCData(data, (mtype, payload) => {
    if (mtype === "grpclistener") {
      const intf = payload.toString("utf-8");
      const matches = intf.match(/^.+:(\d+)$/);
      if (matches) {
        notifyGrpcPort(matches[1]);
      } else {
        logger.log("error", "GRPC port not found on IPC channel to dcrwallet: " + intf);
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
      dcrwTxStream.on("error", (e) => e && e.code && e.code != "EOF" && logger.log("error", "tx stream error", e));
      dcrwTxStream.on("close", () => logger.log("info", "dcrwallet tx stream closed"));
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

  if (os.platform() !== "win32") {
    dcrwallet.stdio[4].on("data", decodeDcrwIPC);
  }

  dcrwallet.on("error", function (err) {
    logger.log("error", "Error running dcrwallet.  Check logs and restart! " + err);
    mainWindow.webContents.executeJavaScript("alert(\"Error running dcrwallet.  Check logs and restart! " + err + "\");");
    mainWindow.webContents.executeJavaScript("window.close();");
  });

  dcrwallet.on("close", (code) => {
    if (daemonIsAdvanced)
      return;
    if (code !== 0) {
      var lastDcrwalletErr = lastErrorLine(GetDcrwalletLogs());
      if (!lastDcrwalletErr || lastDcrwalletErr == "") {
        lastDcrwalletErr = lastPanicLine(GetDcrwalletLogs());
      }
      logger.log("error", "dcrwallet closed due to an error: ", lastDcrwalletErr);
      reactIPC.send("error-received", false, lastDcrwalletErr);
    } else {
      logger.log("info", `dcrwallet exited with code ${code}`);
    }
    ClearDcrwalletLogs();
  });

  const addStdoutToLogListener = (data) => AddToDcrwalletLog(process.stdout, data, debug);

  dcrwallet.stdout.on("data", addStdoutToLogListener);
  dcrwallet.stderr.on("data", (data) => {
    AddToDcrwalletLog(process.stderr, data, debug);
  });

  dcrwPID = dcrwallet.pid;
  logger.log("info", "dcrwallet started with pid:" + dcrwPID);

  dcrwallet.unref();
  return dcrwPID;
};

export const GetDcrwPort = () => dcrwPort;

export const GetDcrdPID = () => dcrdPID;

export const GetDcrwPID = () => dcrwPID;

export const readExesVersion = (app, grpcVersions) => {
  let args = [ "--version" ];
  let exes = [ "dcrd", "dcrwallet", "dcrctl" ];
  let versions = {
    grpc: grpcVersions,
    decrediton: app.getVersion()
  };

  for (let exe of exes) {
    let exePath = getExecutablePath("dcrd", argv.custombinpath);
    if (!fs.existsSync(exePath)) {
      logger.log("error", "The dcrd executable does not exist. Expected to find it at " + exePath);
    }

    let proc = spawn(exePath, args, { encoding: "utf8" });
    if (proc.error) {
      logger.log("error", `Error trying to read version of ${exe}: ${proc.error}`);
      continue;
    }

    let versionLine = proc.stdout.toString();
    if (!versionLine) {
      logger.log("error", `Empty version line when reading version of ${exe}`);
      continue;
    }

    let decodedLine = versionLine.match(/\w+ version ([^\s]+)/);
    if (decodedLine !== null) {
      versions[exe] = decodedLine[1];
    } else {
      logger.log("error", `Unable to decode version line ${versionLine}`);
    }
  }

  return versions;
};

// connectDaemon starts a new rpc connection to dcrd
export const connectRpcDaemon = () => new Promise((resolve,reject) => {
  var cert = fs.readFileSync(rpccert);
  const url = `${rpchost}:${rpcport}`;
  if (dcrdSocket && dcrdSocket.readyState === dcrdSocket.OPEN) {
    return resolve(true);
  }
  dcrdSocket = new webSocket(`wss://${url}/ws`, {
    headers: {
      'Authorization': 'Basic '+Buffer.from(rpcuser+':'+rpcpass).toString('base64')
    },
    cert: cert,
    ecdhCurve: 'secp521r1',
    ca: [cert]
  });
  dcrdSocket.on('open', function() {
    console.log('**********************************************************************');
    console.log('CONNECTED');
    // Send a JSON-RPC command to be notified when blocks are connected and
    // disconnected from the chain.
    dcrdSocket.send('{"jsonrpc":"1.0","id":"0","method":"notifyblocks","params":[]}');

    resolve(true);
  });
  dcrdSocket.on('error', function(error) {
    console.log('ERROR:' + error);
    reject(error);
  })
  dcrdSocket.on('message', function(data, flags) {
    const parsedData = JSON.parse(data);
    const method = parsedData ? parsedData.method : "";
    switch (method) {
      case "blockconnected":
        const hex = hexToRaw(parsedData.params[0]);
        const newBlock = decodeConnectedBlockHeader(Buffer.from(hex));
        break;
    }
  });
  dcrdSocket.on('close', function(data) {
    console.log('DISCONNECTED');
  });
})

export const getInfo = () => new Promise((resolve, reject) => {
  dcrdSocket.send('{"jsonrpc":"1.0","id":"0","method":"getinfo","params":[]}');
  dcrdSocket.on('message', (data) => {
    const parsedData = JSON.parse(data);
    logger.log("info", parsedData.result);
    resolve(parsedData.result)
  });
});

export const getBlockChainInfo = () => new Promise((resolve, reject) => {
  dcrdSocket.send('{"jsonrpc":"1.0","id":"getblockchaininfo","method":"getblockchaininfo","params":[]}');
  dcrdSocket.on('message', (data) => {
    const parsedData = JSON.parse(data);
    const dataResults = parsedData.result || {};
    const blockCount = dataResults.blocks;
    const syncHeight = dataResults.syncheight;
    logger.log("info", dataResults.blocks, dataResults.syncheight, dataResults.verificationprogress);
    resolve({ blockCount, syncHeight })
  });
});

const decodeConnectedBlockHeader = (headerBytes) => {
  if (!(headerBytes instanceof Buffer)) {
    throw new Error("header requested for decoding is not a Buffer object");
  }
  let position = 0;
  const blockHeader = {};
  blockHeader.version = headerBytes.readUInt32LE(position);
  position += 4;
  blockHeader.prevBlockHash = reverseRawHash(headerBytes.slice(position, position + 32));
  position += 32;
  blockHeader.merkleRoot = reverseRawHash(headerBytes.slice(position, position + 32));
  position += 32;
  blockHeader.stakeRoot = reverseRawHash(headerBytes.slice(position, position + 32));
  position += 32;
  blockHeader.voteBits = headerBytes.readUInt16LE(position);
  position += 2;
  blockHeader.finalState = headerBytes.slice(position, position + 6);
  position += 6;
  blockHeader.voters = headerBytes.readUInt16LE(position);
  position += 2;
  blockHeader.FreshStake = headerBytes.readUInt8(position);
  position += 1;
  blockHeader.revocations = headerBytes.readUInt8(position);
  position += 1;
  blockHeader.poolSize = headerBytes.readUInt32LE(position);
  position += 4;
  blockHeader.bits = headerBytes.readUInt32LE(position);
  position += 4;
  blockHeader.sBits = Uint64LE(headerBytes.slice(position, position+8)).toNumber();
  position += 8;
  blockHeader.height = headerBytes.readUInt32LE(position);
  position += 4;
  blockHeader.size = headerBytes.readUInt32LE(position);
  position += 4;
  blockHeader.time = headerBytes.readUInt32LE(position);
  position += 4;
  blockHeader.nonce = headerBytes.readUInt32LE(position);
  position += 4;
  blockHeader.extraData = headerBytes.slice(position, position + 32);
  position += 32;
  blockHeader.stakeVersion = headerBytes.readUInt32LE(position);
  position += 4;

  return blockHeader;
};
