export const BOTH_CONNECTION_ERR_MESSAGE =
  "Cannot use both --testnet and --mainnet.";

export const SPV_CONNECT_WITHOUT_SPV =
  "Launch with the --spv option in order to use --spvconnect";

export const RPC_WITHOUT_ADVANCED_MODE =
  "Use --advanced to connect to a dcrd instance manually via PRC";

export const RPCCONNECT_INVALID_FORMAT =
  'Please provide a valid host and port for --rpcconnect, eg. --rpcconnect="127.0.0.1:19109"';

export const RPC_MISSING_OPTIONS =
  "Missing RPC connection params. Did you include all of the following: --rpcuser, --rpcpass, --rpccert, --rpcconnect?";

export const SPV_WITH_ADVANCED_MODE =
  "Cannot use SPV mode and advanced daemon mode at the same time";

export const DIFF_CONNECTION_ERROR =
  "daemon and decrediton does not have the same network";

// POSITION_ERROR and MISMATCH_ERROR represent errors when creating or
// restoring wallet with seed.
export const POSITION_ERROR = "not valid at position";
export const MISMATCH_ERROR = "checksum mismatch";
