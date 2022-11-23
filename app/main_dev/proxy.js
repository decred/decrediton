import { getGlobalCfg } from "../config";
import { session } from "electron";
import * as cfgConstants from "constants/config";

import {
  PROXYTYPE_PAC,
  PROXYTYPE_HTTP,
  PROXYTYPE_SOCKS4,
  PROXYTYPE_SOCKS5
} from "constants";

export const setupProxy = (logger) =>
  new Promise((resolve, reject) => {
    const { proxyType, proxyLocation } = getProxyTypeAndLocation();

    const proxyConfig = {
      pacScript: null,
      proxyRules: null,
      proxyBypassRules: null
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

    logger.log(
      "info",
      "Setting up proxy " + (proxyConfig.pacScript || proxyConfig.proxyRules)
    );
    session.defaultSession
      .setProxy(proxyConfig)
      .then(() => {
        logger.log("info", "Proxy successfully setup");
        resolve();
      })
      .catch(reject);
  });

export const getProxyTypeAndLocation = () => {
  const cfg = getGlobalCfg();

  const proxyType = cfg.get(cfgConstants.PROXY_TYPE);
  const proxyLocation = cfg.get(cfgConstants.PROXY_LOCATION);

  return { proxyType, proxyLocation };
};
