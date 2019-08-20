import { app } from "electron";

export const BOTH_CONNECTION_ERR_MESSAGE = "Cannot use both --testnet and --mainnet.";

export const SPV_CONNECT_WITHOUT_SPV = "Launch with the --spv option in order to use --spvconnect";

export const RPC_WITHOUT_ADVANCED_MODE = "Use --advanced to connect to a dcrd instance manually via PRC";

export const RPCCONNECT_INVALID_FORMAT = "Please provide a valid host and port for --rpcconnect, eg. --rpcconnect=\"127.0.0.1:19109\"";

export const RPC_MISSING_OPTIONS = "Missing RPC connection params. Did you include all of the following: --rpcuser, --rpcpass, --rpccert, --rpcconnect?";

export const SPV_WITH_ADVANCED_MODE = "Cannot use SPV mode and advanced daemon mode at the same time";

export const DIFF_CONNECTION_ERROR = "daemon and decrediton does not have the same network";

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


export const VERSION_MESSAGE = app ? `${app.getName()} version ${app.getVersion()}` : null;

// POSITION_ERROR and MISMATCH_ERROR represent errors when creating or
// restoring wallet with seed.
export const POSITION_ERROR = "not valid at position";
export const MISMATCH_ERROR = "checksum mismatch";
