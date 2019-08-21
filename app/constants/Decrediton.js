
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

export const DCR = "DCR";
export const ATOMS = "atoms";

export const WORDS = "words";
export const HEX = "hex";

export const TESTNET = "testnet";
export const MAINNET = "mainnet";

// tx types
export const TICKET = "ticket";
export const VOTE = "vote";
export const REVOCATION = "revocation";
export const UNKNOWN = "unknown";
export const VOTED = "voted";
export const UNMINED = "unmined";
export const IMMATURE = "immature";
export const MISSED = "missed";
export const EXPIRED = "expired";
export const REVOKED = "revoked";
export const LIVE = "live";
export const OUT = "out";
export const IN = "in";
export const TRANSFER = "transfer";
export const COINBASE = "coinbase";
