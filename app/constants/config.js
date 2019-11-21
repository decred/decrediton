import { MAINNET } from "./Decrediton";

export const DAEMON_ADVANCED = "daemon_start_advanced";
export const THEME = "theme";
export const OPEN_FORM = "must_open_form";
export const LOCALE = "locale";
export const NETWORK = "network";
export const SET_LANGUAGE = "set_language";
export const UI_ANIMATION = "ui_animations";
export const SHOW_SPV_CHOICE = "show_spvchoice";
export const SHOW_TUTORIAL  = "show_tutorial";
export const SHOW_PRIVACY = "show_privacy";
export const ALLOW_EXTERNAL_REQUEST = "allowed_external_requests";
export const PROXY_TYPE = "proxy_type";
export const PROXY_LOCATION = "proxy_location";
export const REMOTE_CREDENTIALS = "remote_credentials";
export const SPV_MODE = "spv_mode";
export const SPV_CONNECT = "spv_connect";
export const MAX_WALLET_COUNT = "max_wallet_count";
export const TIMEZONE = "timezone";
export const LAST_HEIGHT = "last_height";
export const APPDATA = "appdata_path";
export const DISABLE_HARDWARE_ACCEL = "disable_hardware_accel";
export const LN_ENABLED = "ln_enabled";
export const TREZOR_DEBUG = "trezor_debug";

export const RPCUSER = "rpc_user";
export const RPCPASS = "rpc_pass";
export const RPCCERT = "rpc_cert";
export const RPCHOST = "rpc_host";
export const RPCPORT = "rpc_port";

export const setDaemonRemoteCredentials = (rpcuser, rpcpass, rpccert, rpchost, rpcport) => {
  return {
    [RPCUSER]: rpcuser,
    [RPCPASS]: rpcpass,
    [RPCCERT]: rpccert,
    [RPCHOST]: rpchost,
    [RPCPORT]: rpcport
  };
};

export const INITIAL_VALUES = {
  [DAEMON_ADVANCED]: false,
  [THEME]: "theme-light",
  [OPEN_FORM]: true,
  [LOCALE]: "",
  [NETWORK]: MAINNET,
  [SET_LANGUAGE]: true,
  [UI_ANIMATION]: true,
  [SHOW_SPV_CHOICE]: true,
  [SHOW_TUTORIAL]: true,
  [SHOW_PRIVACY]: true,
  [ALLOW_EXTERNAL_REQUEST]: [],
  [PROXY_TYPE]: null,
  [PROXY_LOCATION]: null,
  [REMOTE_CREDENTIALS]: {},
  [SPV_MODE]: false,
  [SPV_CONNECT]: [],
  [MAX_WALLET_COUNT]: 3,
  [TIMEZONE]: "local",
  [LAST_HEIGHT]: 0,
  [APPDATA]: "",
  [TREZOR_DEBUG]: false,
  [DISABLE_HARDWARE_ACCEL]: false,
  [LN_ENABLED]: false
};
