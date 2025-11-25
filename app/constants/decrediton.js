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
export const ASC = "asc";

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
export const TICKET_FEE = "ticketfee";
export const SELFTRANSFER = "self";
export const COINBASE = "coinbase";
export const REGULAR = "regular";
export const ELIGIBLE = "eligible";
export const MIXED = "mixed";
export const ALL = "all";

// tx directions
export const TRANSACTION_DIR_SENT = "sent";
export const TRANSACTION_DIR_RECEIVED = "received";

// Default name to particular accounts
export const DEFAULT_ACCOUNT = "default";
export const IMPORTED_ACCOUNT = "imported";

// Default name to privacy accounts needed for creation
export const MIXED_ACCOUNT = "mixed";
export const CHANGE_ACCOUNT = "unmixed";

// MENU_LINKS_PER_ROW is the default number of menu items shown in sidebar when it's located on bottom.
export const MENU_LINKS_PER_ROW = 4;

// VSP_FEE_PROCESS_STARTED represents the state which process has being
export const VSP_FEE_PROCESS_STARTED = 0;
export const VSP_FEE_PROCESS_PAID = 1;
export const VSP_FEE_PROCESS_ERRORED = 2;
export const VSP_FEE_PROCESS_CONFIRMED = 3;

// TitleHeader icon types
export const ACCOUNTS_ICON = "accounts";
export const SECURITY_ICON = "security";
export const SETTINGS_ICON = "settings";
export const TICKETS_ICON = "tickets";
export const TRANSACTIONS_ICON = "transactions";
export const GOVERNANCE_ICON = "governance";
export const TREZOR_ICON = "trezor";
export const LN_ICON = "ln";
export const TICKET_ICON = "ticket";
export const VOTE_ICON = "vote";
export const MISSED_ICON = "missed";
export const REVOCATION_ICON = "revocation";
export const TICKETFEE_ICON = "ticketfee";
export const UNMINED_ICON = "unmined";
export const IMMATURE_ICON = "immature";
export const MIXED_ICON = "mixed";
export const SELF_ICON = "self";
export const OUT_ICON = "out";
export const IN_ICON = "in";
export const DEX_ICON = "dex";

export const EXTERNALREQUEST_DEX = "EXTERNALREQUEST_DEX";
export const EXTERNALREQUEST_NETWORK_STATUS = "EXTERNALREQUEST_NETWORK_STATUS";
export const EXTERNALREQUEST_STAKEPOOL_LISTING =
  "EXTERNALREQUEST_STAKEPOOL_LISTING";
export const EXTERNALREQUEST_UPDATE_CHECK = "EXTERNALREQUEST_UPDATE_CHECK";
export const EXTERNALREQUEST_POLITEIA = "EXTERNALREQUEST_POLITEIA";
export const EXTERNALREQUEST_DCRDATA = "EXTERNALREQUEST_DCRDATA";
export const EXTERNALREQUEST_TREZOR_BRIDGE = "EXTERNALREQUEST_TREZOR_BRIDGE";

// These are the requests allowed when the standard privacy mode is selected.
export const STANDARD_EXTERNAL_REQUESTS = [
  EXTERNALREQUEST_NETWORK_STATUS,
  EXTERNALREQUEST_STAKEPOOL_LISTING,
  EXTERNALREQUEST_UPDATE_CHECK,
  EXTERNALREQUEST_DCRDATA
];

export const PROXYTYPE_PAC = "PROXYTYPE_PAC";
export const PROXYTYPE_HTTP = "PROXYTYPE_HTTP";
export const PROXYTYPE_SOCKS4 = "PROXYTYPE_SOCKS4";
export const PROXYTYPE_SOCKS5 = "PROXYTYPE_SOCKS5";

// ln invoice status
export const INVOICE_STATUS_OPEN = "open";
export const INVOICE_STATUS_SETTLED = "settled";
export const INVOICE_STATUS_EXPIRED = "expired";
export const INVOICE_STATUS_CANCELED = "canceled";

// ln payment status
export const PAYMENT_STATUS_CONFIRMED = "confirmed";
export const PAYMENT_STATUS_FAILED = "failed";
export const PAYMENT_STATUS_PENDING = "pending";

// ln channel status
export const CHANNEL_STATUS_ACTIVE = "active";
export const CHANNEL_STATUS_PENDING = "pending";
export const CHANNEL_STATUS_CLOSED = "closed";
