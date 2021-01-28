import { MAINNET, DCR } from "./Decrediton";

// Global config constants
export const DAEMON_ADVANCED = "daemon_start_advanced";
export const THEME = "theme";
export const LOCALE = "locale";
export const NETWORK = "network";
export const SET_LANGUAGE = "set_language";
export const UI_ANIMATIONS = "ui_animations";
export const SHOW_SPV_CHOICE = "show_spvchoice";
export const SHOW_TUTORIAL = "show_tutorial";
export const SHOW_PRIVACY = "show_privacy";
export const ALLOWED_EXTERNAL_REQUESTS = "allowed_external_requests";
export const PROXY_TYPE = "proxy_type";
export const PROXY_LOCATION = "proxy_location";
export const REMOTE_CREDENTIALS = "remote_credentials";
export const SPV_MODE = "spv_mode";
export const SPV_CONNECT = "spv_connect";
export const TIMEZONE = "timezone";
export const LAST_HEIGHT = "last_height";
export const APPDATA = "appdata_path";
export const DISABLE_HARDWARE_ACCEL = "disable_hardware_accel";
export const LN_ENABLED = "ln_enabled";
export const TREZOR_DEBUG = "trezor_debug";
export const UPGD_ELECTRON8 = "is_electron8";

// advanced daemon configs
export const RPCUSER = "rpc_user";
export const RPCPASS = "rpc_pass";
export const RPCCERT = "rpc_cert";
export const RPCHOST = "rpc_host";
export const RPCPORT = "rpc_port";

// aux function for setting remote daemon credentials
export const setDaemonRemoteCredentials = (
  rpcuser,
  rpcpass,
  rpccert,
  rpchost,
  rpcport
) => ({
    [RPCUSER]: rpcuser,
    [RPCPASS]: rpcpass,
    [RPCCERT]: rpccert,
    [RPCHOST]: rpchost,
    [RPCPORT]: rpcport
  });

// Wallet config constants
export const ENABLE_TICKET_BUYER = "enableticketbuyer";
export const BALANCE_TO_MAINTAIN = "balancetomaintain";
export const CURRENCY_DISPLAY = "currency_display";
export const HIDDEN_ACCOUNTS = "hiddenaccounts";
export const DISCOVER_ACCOUNTS = "discoveraccounts";
export const GAP_LIMIT = "gaplimit";
export const IS_WATCH_ONLY = "iswatchonly";
export const POLITEIA_LAST_ACCESS_TIME = "politeia_last_access_time";
export const POLITEIA_LAST_ACCESS_BLOCK = "politeia_last_access_block";
export const TREZOR = "trezor";
export const VSP_IS_LEGACY = "vsp_is_legacy";
export const ENABLE_PRIVACY = "enableprivacy";
export const LN_ACCOUNT = "ln_account";
export const LN_ADDRESS = "ln_address";
export const LN_PORT = "ln_port";
export const LN_CERTPATH = "ln_certpath";
export const LN_MACAROONPATH = "ln_macaroonpath";
export const SEND_FROM_UNMIXED = "send_from_unmixed";
export const MIXED_ACCOUNT_CFG = "mixedaccount";
export const DISMISS_BACKUP_MSG_REDEEM_SCRIPT = "dismiss_backup_msg_redeem_script";
export const CHANGE_ACCOUNT_CFG = "changeaccount";
export const CSPP_SERVER = "csppserver";
export const CSPP_PORT = "csppport";
export const MIXED_ACC_BRANCH = "mixedaccbranch";
export const REMEMBERED_VSP_HOST = "remembered_vsp_host";
export const LAST_ACCESS = "lastaccess";
export const STAKEPOOLS = "stakepools";
export const LN_WALLET_EXISTS = "ln_wallet_exists";
export const USED_VSPS = "used_vsps";

export const WALLET_INITIAL_VALUE = {
  [ENABLE_TICKET_BUYER]: false,
  [BALANCE_TO_MAINTAIN]: "0",
  [CURRENCY_DISPLAY]: DCR,
  [HIDDEN_ACCOUNTS]: [],
  [DISCOVER_ACCOUNTS]: true,
  [GAP_LIMIT]: 20,
  [IS_WATCH_ONLY]: false,
  [POLITEIA_LAST_ACCESS_TIME]: 0,
  [POLITEIA_LAST_ACCESS_BLOCK]: 0,
  [TREZOR]: false,
  [VSP_IS_LEGACY]: false,
  // enable_privacy only shows the privacy menu on the wallet
  [ENABLE_PRIVACY]: true,
  [LN_ACCOUNT]: null,
  [LN_ADDRESS]: "",
  [LN_PORT]: 10009,
  [LN_CERTPATH]: "",
  [LN_MACAROONPATH]: "",
  [SEND_FROM_UNMIXED]: false,
  [MIXED_ACCOUNT_CFG]: null,
  [DISMISS_BACKUP_MSG_REDEEM_SCRIPT]: false,
  // change_account used when mixing
  [CHANGE_ACCOUNT_CFG]: null,
  [CSPP_SERVER]: "",
  [CSPP_PORT]: "",
  [MIXED_ACC_BRANCH]: null,
  [REMEMBERED_VSP_HOST]: null,
  [LAST_ACCESS]: 0,
  [USED_VSPS]: [],
  [LN_WALLET_EXISTS]: false,
  // STAKEPOOLS is a legacy code which can be deleted after stopping giving
  // support for old vsp versions.
  [STAKEPOOLS]: []
};

export const INITIAL_VALUES = {
  [DAEMON_ADVANCED]: false,
  [THEME]: "light",
  [LOCALE]: "",
  [NETWORK]: MAINNET,
  [SET_LANGUAGE]: true,
  [UI_ANIMATIONS]: true,
  [SHOW_SPV_CHOICE]: true,
  [SHOW_TUTORIAL]: true,
  [SHOW_PRIVACY]: true,
  [ALLOWED_EXTERNAL_REQUESTS]: [],
  [PROXY_TYPE]: null,
  [PROXY_LOCATION]: null,
  [REMOTE_CREDENTIALS]: {},
  [SPV_MODE]: false,
  [SPV_CONNECT]: [],
  [TIMEZONE]: "local",
  [LAST_HEIGHT]: 0,
  [APPDATA]: "",
  [TREZOR_DEBUG]: false,
  [DISABLE_HARDWARE_ACCEL]: false,
  [LN_ENABLED]: false,
  [UPGD_ELECTRON8]: false
};
