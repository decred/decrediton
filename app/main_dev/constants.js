import { app } from "electron";

// Not going to make incorrect options fatal since running in dev mode has
// all sorts of things on the cmd line that we don't care about.  If we want
// to make this fatal, it must be for production mode only.
function unknownFn(arg) {
  console.log("%s is not a valid option!", arg);
  return;
}

// Allowed cmd line options are defined here.
export const OPTIONS = {
  boolean: [ "debug", "testnet", "mainnet", "help", "version" ],
  string: [ "extrawalletargs", "customBinPath" ],
  default: { debug: false },
  alias: { d: "debug" },
  unknown: unknownFn
};

export const MAX_LOG_LENGTH = 50000;

export const VERSION_MESSAGE = app ? `${app.getName()} version ${app.getVersion()}` : null;

export const BOTH_CONNECTION_ERR_MESSAGE = "Cannot use both --testnet and --mainnet.";

export const MAX_POSSIBLE_FEE_INPUT = 0.1;

export const MIN_RELAY_FEE = 0.0001;

export const USAGE_MESSAGE = app ? `${app.getName()} version ${app.getVersion()}
Usage
  $ ${app.getName()} [--help] [--version] [--debug] [--testnet|--mainnet]
               [--extrawalletargs=...]

Options
  --help             Show help and exit
  --version          Show version and exit
  --debug  -d        Debug daemon/wallet messages
  --testnet          Connect to testnet
  --mainnet          Connect to mainnet
  --extrawalletargs  Pass extra arguments to dcrwallet
  --customBinPath    Custom path for dcrd/dcrwallet/dcrctl binaries
` : null;

export const DIFF_CONNECTION_ERROR = "daemon and decrediton does not have the same network";
