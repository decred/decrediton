import * as cfg from "../config";
import * as paths from "main_dev/paths";
import * as cfgConstants from "constants/config";

export const getWalletCfg = (...args) => {
  const c = cfg.getWalletCfg(...args);
  return {
    get: (...args) => c.get(...args),
    set: (...args) => c.set(...args),
    delete: (...args) => c.delete(...args)
  };
};

// This is a map that stores which keys cannot be directly set by UI code and
// must be set only by preload script functions.
//
// TODO: switch to an allowlist mode instead, after identifying the relevant
// entries and move setting code to the preload layer.
const disallowedGlobalKeys = new Map().set(cfgConstants.ALLOWED_VSP_HOSTS);

export const getGlobalCfg = (...args) => {
  const c = cfg.getGlobalCfg(...args);
  return {
    get: (...args) => c.get(...args),
    set: (key, value) => {
      if (disallowedGlobalKeys.has[key]) {
        throw new Error(`Cannot set global config key '${key}' from UI code`);
      }
      c.set(key, value);
    },
    delete: (...args) => c.delete(...args)
  };
};

export const setLastHeight = cfg.setLastHeight;
export const getDcrdCert = cfg.getDcrdCert;
export const setAppdataPath = cfg.setAppdataPath;
export const getAppdataPath = cfg.getAppdataPath;
export const getRemoteCredentials = cfg.getRemoteCredentials;
export const setRemoteCredentials = cfg.setRemoteCredentials;
export const getDaemonIsAdvanced = cfg.getDaemonIsAdvanced;
export const getIsSpv = cfg.getIsSpv;
export const getWalletPath = paths.getWalletPath;
export const getAppDataDirectory = paths.getAppDataDirectory;
