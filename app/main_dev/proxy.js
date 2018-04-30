import { getGlobalCfg } from "../config";
import { session } from "electron";

export const PROXYTYPE_PAC = "PROXYTYPE_PAC";
export const PROXYTYPE_HTTP = "PROXYTYPE_HTTP";
export const PROXYTYPE_SOCKS4 = "PROXYTYPE_SOCKS4";
export const PROXYTYPE_SOCKS5 = "PROXYTYPE_SOCKS5";

export const setupProxy = (logger) => new Promise( (resolve, reject) => {
  const cfg = getGlobalCfg();

  const proxyType = cfg.get("proxy_type");
  const proxyLocation = cfg.get("proxy_location");

  let proxyConfig = {
    pacScript: null,
    proxyRules: null,
    proxyBypassRules: null,
  };

  if (process.env.NODE_ENV === "development") {
    proxyConfig.proxyBypassRules = "http://localhost:3000";
  }

  switch (proxyType) {
  case PROXYTYPE_PAC:
    proxyConfig.pacScript = proxyLocation;
    break;
  case PROXYTYPE_HTTP:
    proxyConfig.proxyRules = proxyLocation;
    break;
  case PROXYTYPE_SOCKS4:
    proxyConfig.proxyRules = "socks4://" + proxyLocation;
    break;
  case PROXYTYPE_SOCKS5:
    proxyConfig.proxyRules = "socks5://" + proxyLocation;
    break;
  default:
    if (proxyType) {
      logger.log("error", "Unknown proxy type " + proxyType);
      reject("Unknown proxy type: " + proxyType);
    }
  }

  logger.log("info", "Setting up proxy " + (proxyConfig.pacScript||proxyConfig.proxyRules));
  session.defaultSession.setProxy(proxyConfig, () => {
    logger.log("info", "Proxy successfully setup");
    resolve();
  });
});
