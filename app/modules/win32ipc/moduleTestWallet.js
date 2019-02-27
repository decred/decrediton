// Sample script to test the namedpiperx option of dcrwallet in windows.
// Requires that a wallet config exists in the default decrediton config dir,
// with a wallet name "default-wallet".

const childProcess = require("child_process");
const addon = require("./build/Release/win32ipc");
const path = require("path");
const os = require("os");
const fs = require("fs");

//const pipeFname = "\\\\.\\pipe\\dcrwallet-test";
const walletConfPath = path.join(os.homedir(), "AppData", "Local", "Decrediton",
  "wallets", "testnet", "default-wallet", "dcrwallet.conf");

function sleep(milli) {
  return new Promise(resolve => setTimeout(resolve, milli));
}

function DecodeDaemonIPCData(data, cb) {
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
}

async function test() {
  try {
    console.log("\nCreating pipes");

    const pipeRx = addon.createPipe("out");
    const pipeTx = addon.createPipe("in");
    const pipeTxReadFd = addon.getPipeEndFd(pipeTx.readEnd);
    console.log(pipeRx, pipeTx, pipeTxReadFd);

    const txStream = fs.createReadStream("", { fd: pipeTxReadFd });
    txStream.on("data", data => {
      DecodeDaemonIPCData(data, (mtype, payload) => {
        console.log("Got message", mtype, payload.toString("utf-8"));
      });
    });
    txStream.on("error", (e) => console.log("tx stream error", e));
    txStream.on("close", () => console.log("tx stream closed"));
    txStream.on("end", () => console.log("tx stream ended"));

    console.log("Launching wallet");
    childProcess.spawn("dcrwallet", [
      `-C ${walletConfPath}`,
      `--piperx ${pipeRx.readEnd}`,
      `--pipetx ${pipeTx.writeEnd}`,
      "--rpclistenerevents",
      "--debuglevel DCRW=TRACE"
    ], { "detached": true, "shell": true });

    await sleep(7000);
    console.log("Slept to test some. Will try to close the pipe.");

    // txStream has taken control of pipeTx.readEnd, so we have to
    // close this end normally and not via the the native module
    txStream.close();
    pipeTx.readEnd = -1; // -1 == INVALID_HANDLE_VALUE
    addon.closePipe(pipeTx);

    addon.closePipe(pipeRx);

    console.log("Closed the pipes!");
  } catch (error) {
    console.log("Error");
    console.log(error);
    return;
  }
}

async function testMulti() {
  for (let i = 0; i < 10; i++) {
    await test();
  }
}

setTimeout(testMulti, 3000);

setTimeout(function () { process.exit(0); }, 150000);
