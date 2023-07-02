import { MAINNET, DCR } from "./decrediton";

// Global config constants
export const DAEMON_ADVANCED = "daemon_start_advanced";
export const THEME = "theme";
export const LOCALE = "locale";
export const NETWORK = "network";
export const SET_LANGUAGE = "set_language";
export const UI_ANIMATIONS = "ui_animations";
export const SHOW_SPV_CHOICE = "show_spvchoice";
export const SHOW_TUTORIAL = "show_tutorial";
export const VISITED_TUTORIAL_TABS = "visited_tutorial_tabs";
export const SHOW_PRIVACY = "show_privacy";
export const ALLOWED_EXTERNAL_REQUESTS = "allowed_external_requests";
export const ALLOWED_VSP_HOSTS = "allowed_vsp_hosts";
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
export const AUTO_WALLET_LAUNCHING = "auto_wallet_launching";

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
export const CURRENCY_DISPLAY = "currency_display";
export const HIDDEN_ACCOUNTS = "hiddenaccounts";
export const DISCOVER_ACCOUNTS = "discoveraccounts";
export const GAP_LIMIT = "gaplimit";
export const IS_WATCH_ONLY = "iswatchonly";
export const POLITEIA_LAST_ACCESS_TIME = "politeia_last_access_time";
export const POLITEIA_LAST_ACCESS_BLOCK = "politeia_last_access_block";
export const TREZOR = "trezor";
export const ENABLE_PRIVACY = "enableprivacy";
export const LN_ACCOUNT = "ln_account";
export const LN_ADDRESS = "ln_address";
export const LN_PORT = "ln_port";
export const LN_CERTPATH = "ln_certpath";
export const LN_MACAROONPATH = "ln_macaroonpath";
export const SEND_FROM_UNMIXED = "send_from_unmixed";
export const MIXED_ACCOUNT_CFG = "mixedaccount";
export const CHANGE_ACCOUNT_CFG = "changeaccount";
export const CSPP_SERVER = "csppserver";
export const CSPP_PORT = "csppport";
export const MIXED_ACC_BRANCH = "mixedaccbranch";
export const REMEMBERED_VSP_HOST = "remembered_vsp_host";
export const LAST_ACCESS = "lastaccess";
export const LN_WALLET_EXISTS = "ln_wallet_exists";
export const USED_VSPS = "used_vsps";
export const AUTOBUYER_SETTINGS = "autobuyer_settings";
export const DEX_ACCOUNT = "dex_account";
export const ENABLE_DEX = "enableddex";
export const DEX_READY = "dex_ready";
export const DEXWALLET_RPCUSERNAME = "dexwallet_rpcuser";
export const DEXWALLET_RPCPASSWORD = "dexwallet_rpcpass";
export const DEXWALLET_HOSTPORT = "dexwallet_host";
export const NEEDS_VSPD_PROCESS_TICKETS = "needs_vspd_process_tickets";
export const CONFIRM_DEX_SEED = "confirm_dex_seed";
export const WALLET_CREATED_AS_NEW = "wallet_created_as_new";
export const SHOW_STAKING_WARNING = "show_staking_warning";
export const DISPLAY_WALLET_GRADIENT = "display_wallet_gradient";

export const WALLET_INITIAL_VALUE = {
  [ENABLE_TICKET_BUYER]: false,
  [CURRENCY_DISPLAY]: DCR,
  [HIDDEN_ACCOUNTS]: [],
  [DISCOVER_ACCOUNTS]: true,
  [GAP_LIMIT]: 20,
  [IS_WATCH_ONLY]: false,
  [POLITEIA_LAST_ACCESS_TIME]: 0,
  [POLITEIA_LAST_ACCESS_BLOCK]: 0,
  [TREZOR]: false,
  // enable_privacy only shows the privacy menu on the wallet
  [ENABLE_PRIVACY]: true,
  [LN_ACCOUNT]: null,
  [LN_ADDRESS]: "",
  [LN_PORT]: 10009,
  [LN_CERTPATH]: "",
  [LN_MACAROONPATH]: "",
  [SEND_FROM_UNMIXED]: false,
  [MIXED_ACCOUNT_CFG]: null,
  // change_account used when mixing
  [CHANGE_ACCOUNT_CFG]: null,
  [CSPP_SERVER]: "",
  [CSPP_PORT]: "",
  [MIXED_ACC_BRANCH]: null,
  [REMEMBERED_VSP_HOST]: null,
  [LAST_ACCESS]: 0,
  [USED_VSPS]: [],
  [LN_WALLET_EXISTS]: false,
  [ENABLE_DEX]: false,
  [DEX_READY]: false,
  [DEXWALLET_RPCUSERNAME]: "",
  [DEXWALLET_RPCPASSWORD]: "",
  [DEXWALLET_HOSTPORT]: "",
  [DEX_ACCOUNT]: null,
  [CONFIRM_DEX_SEED]: false,
  [AUTOBUYER_SETTINGS]: null,
  // Force as true to ensure wallets with tickets prior to when this config was
  // introduced trigger a view of the "process managed tickets" page.
  [NEEDS_VSPD_PROCESS_TICKETS]: true,
  [WALLET_CREATED_AS_NEW]: null,
  [SHOW_STAKING_WARNING]: true
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
  [VISITED_TUTORIAL_TABS]: {},
  [SHOW_PRIVACY]: true,
  [ALLOWED_EXTERNAL_REQUESTS]: [],
  [ALLOWED_VSP_HOSTS]: [],
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
  [UPGD_ELECTRON8]: false,
  [AUTO_WALLET_LAUNCHING]: false
};
