import * as cfg from "config";
import * as paths from "main_dev/paths";

export const getWalletCfg = (...args) => {
  const c = cfg.getWalletCfg(...args);
  return {
    get: (...args) => c.get(...args),
    set: (...args) => c.set(...args),
    delete: (...args) => c.delete(...args)
  };
};

export const getGlobalCfg = (...args) => {
  const c = cfg.getGlobalCfg(...args);
  return {
    get: (...args) => c.get(...args),
    set: (...args) => c.set(...args),
    delete: (...args) => c.delete(...args)
  };
};

export const setLastHeight = cfg.setLastHeight;
export const updateStakePoolConfig = cfg.updateStakePoolConfig;
export const getDcrdCert = cfg.getDcrdCert;
export const setAppdataPath = cfg.setAppdataPath;
export const getAppdataPath = cfg.getAppdataPath;
export const getRemoteCredentials = cfg.getRemoteCredentials;
export const setRemoteCredentials = cfg.setRemoteCredentials;
export const getDaemonIsAdvanced = cfg.getDaemonIsAdvanced;
export const getIsSpv = cfg.getIsSpv;
export const getWalletPath = paths.getWalletPath;
export const getAppDataDirectory = paths.getAppDataDirectory;
