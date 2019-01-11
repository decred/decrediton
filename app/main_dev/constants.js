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
  boolean: [ "debug", "testnet", "mainnet", "help", "version", "advanced", "spv" ],
  string: [ "extrawalletargs", "custombinpath", "spvconnect", "rpcuser", "rpcpass", "rpccert", "rpcconnect" ],
  default: { debug: false },
  alias: {
    d: "debug",
    h: "help",
    v: "version"
  },
  unknown: unknownFn
};

export const MAX_LOG_LENGTH = 50000;

export const VERSION_MESSAGE = app ? `${app.getName()} version ${app.getVersion()}` : null;

export const BOTH_CONNECTION_ERR_MESSAGE = "Cannot use both --testnet and --mainnet.";
export const SPV_CONNECT_WITHOUT_SPV = "Launch with the --spv option in order to use --spvconnect";
export const RPC_WITHOUT_ADVANCED_MODE = "Use --advanced to connect to a dcrd instance manually via PRC";
export const RPCCONNECT_INVALID_FORMAT = "Please provide a valid host and port for --rpcconnect, eg. --rpcconnect=\"127.0.0.1:19109\"";
export const RPC_MISSING_OPTIONS = "Missing RPC connection params. Did you include all of the following: --rpcuser, --rpcpass, --rpccert, --rpcconnect?";
export const SPV_WITH_ADVANCED_MODE = "Cannot use SPV mode and advanced daemon mode at the same time";

export const MAX_POSSIBLE_FEE_INPUT = 0.1;

export const MIN_RELAY_FEE = 0.0001;

export const USAGE_MESSAGE = app ? `${app.getName()} version ${app.getVersion()}
Usage
  $ ${app.getName()} [OPTIONS]

Options
  --help -h          Show help and exit.
  --version -v       Show version and exit.
  --debug -d         Debug daemon/wallet messages.
  --testnet          Connect to testnet.
  --mainnet          Connect to mainnet.
  --advanced         Start in advanced daemon mode.
  --spv              Start in SPV mode (cannot be used at the same time as advanced daemon mode).
  --spvconnect       Specify direct peer for SPV connection in 'host:port' or 'host' format (latter uses the default SPV port). Supports comma-separated list of peers. Always use with --spv.
  --rpcuser          Specify RPC username for advanced daemon mode connection
  --rpcpass          Specify RPC password
  --rpccert          Specify RPC Certificate
  --rpcconnect       Specify RPC connection in 'host:port' or 'host' format (latter uses the default RPC port). Note that different ports are used for RPC and SPV connections.
  --extrawalletargs  Pass extra arguments to dcrwallet.
  --custombinpath    Custom path for dcrd/dcrwallet/dcrctl binaries.
` : null;

export const DIFF_CONNECTION_ERROR = "daemon and decrediton does not have the same network";
