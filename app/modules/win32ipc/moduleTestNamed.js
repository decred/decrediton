// Sample script to test the namedpiperx option of dcrwallet in windows.
// Requires that a wallet config exists in the default decrediton config dir,
// with a wallet name "default-wallet".

const childProcess = require("child_process");
const addon = require("./build/Release/win32ipc");
const path = require("path");
const os = require("os");

const pipeFname = "\\\\.\\pipe\\dcrwallet-test";
const walletConfPath = path.join(os.homedir(), "AppData", "Local", "Decrediton",
  "wallets", "testnet", "default-wallet", "dcrwallet.conf");

childProcess.spawn("dcrwallet", [
  `-C ${walletConfPath}`,
  `--namedpiperx ${pipeFname}`, "--debuglevel DCRW=TRACE"
], { "detached": true, "shell": true });

function sleep(milli) {
  return new Promise(resolve => setTimeout(resolve, milli));
}

async function test() {
  try {
    const pipe = addon.openNamedPipe(pipeFname);
    console.log(pipe);
    await sleep(7000);
    console.log("Slept to test some. Will try to close the pipe.");
    console.log(addon.closePipeEnd(pipe.readEnd));
    console.log("Closed the pipe!");
  } catch (error) {
    console.log("Error");
    console.log(error);
    return;
  }
}

setTimeout(test, 3000);

setTimeout(function () { process.exit(0); }, 30000);
