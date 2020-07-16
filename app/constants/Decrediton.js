// Not going to make incorrect options fatal since running in dev mode has
// all sorts of things on the cmd line that we don't care about.  If we want
// to make this fatal, it must be for production mode only.
function unknownFn(arg) {
  console.log("%s is not a valid option!", arg);
  return;
}

// Allowed cmd line options are defined here.
export const OPTIONS = {
  boolean: [
    "debug",
    "testnet",
    "mainnet",
    "help",
    "version",
    "advanced",
    "spv"
  ],
  string: [
    "extrawalletargs",
    "custombinpath",
    "spvconnect",
    "rpcuser",
    "rpcpass",
    "rpccert",
    "rpcconnect"
  ],
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

// BATCH_TX_COUNT represents a batch of transaction wich will be fetched
// on a getTransactions request.
export const BATCH_TX_COUNT = 10;

// RECENT_TX_COUNT is the number of transactions for Overview Page.
export const RECENT_TX_COUNT = 8;

// tx filter direction - descending order
export const DESC = "desc";

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
export const TRANSFER = "transfer";
export const COINBASE = "coinbase";
export const REGULAR = "regular";
export const ELIGIBLE = "eligible";

// tx directions
export const TRANSACTION_DIR_SENT = "sent";
export const TRANSACTION_DIR_RECEIVED = "received";
export const TRANSACTION_DIR_TRANSFERRED = "transfer";

// Default name to particular accounts
export const DEFAULT_ACCOUNT = "default";
export const IMPORTED_ACCOUNT = "imported";

// Default name to privacy accounts needed for creation
export const MIXED_ACCOUNT = "mixed";
export const CHANGE_ACCOUNT = "unmixed";

// MENU_LINKS_PER_ROW is the default number of menu items shown in sidebar when it's located on bottom.
export const MENU_LINKS_PER_ROW = 4;
