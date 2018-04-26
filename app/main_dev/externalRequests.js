/**
 * This file is responsible for controlling outbound connections from the wallet.
 *
 * It works on a whitelist basis, only allowing requests with URLs matching the
 * regexps contained in `allowedURLs` to be performed. Individual URLs can be
 * allowed by passing the appropriate url to the ipcMain message "allowURL".
 */
import { session } from "electron";
import { isRegExp } from "util";
import { getGlobalCfg } from "../config";

export const EXTERNALREQUEST_NETWORK_STATUS = "EXTERNALREQUEST_NETWORK_STATUS";
export const EXTERNALREQUEST_STAKEPOOL_LISTING = "EXTERNALREQUEST_STAKEPOOL_LISTING";
export const EXTERNALREQUEST_UPDATE_CHECK = "EXTERNALREQUEST_UPDATE_CHECK";

// These are the requests allowed when the standard privacy mode is selected.
export const STANDARD_EXTERNAL_REQUESTS = [
  EXTERNALREQUEST_NETWORK_STATUS,
  EXTERNALREQUEST_STAKEPOOL_LISTING,
  EXTERNALREQUEST_UPDATE_CHECK,
];

let allowedURLs = [];
let allowedExternalRequests = {};
let logger;

export const installSessionHandlers = (mainLogger) => {
  logger = mainLogger;
  logger.log("info", "Installing session intercept");

  reloadAllowedExternalRequests();

  const filter = {
    urls: []
  };

  // TODO: check if this filtering is working even when multiple windows are
  // created (relevent to multi-wallet usage)
  session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    const isURLAllowed = (urlRegexp) => urlRegexp.test(details.url);
    if (!allowedURLs.some(isURLAllowed)) {
      logger.log("warn", "Cancelling external request " + details.method + " " + details.url);
      callback({ cancel: true, requestHeaders: details.requestHeaders });
    } else {
      logger.log("verbose", details.method + " " + details.url);
      callback({ cancel: false, requestHeaders: details.requestHeaders });
    }
  });
};

const addAllowedURL = (url) => {
  if (!isRegExp(url)) url = new RegExp(url);
  allowedURLs.push(url);
};

export const allowExternalRequest = (externalReqType) => {
  if (allowedExternalRequests[externalReqType]) return;

  switch (externalReqType) {
  case EXTERNALREQUEST_NETWORK_STATUS:
    addAllowedURL("https://testnet.decred.org/api/status");
    addAllowedURL("https://decred.org/api/status");
    break;
  case EXTERNALREQUEST_STAKEPOOL_LISTING:
    addAllowedURL(/^https:\/\/api\.decred\.org\/\?c=gsd$/);
    break;
  case EXTERNALREQUEST_UPDATE_CHECK:
    addAllowedURL("https://api.github.com/repos/decred/decrediton/releases");
    break;
  default:
    logger.log("error", "Unknown external request type: " + externalReqType);
  }

  allowedExternalRequests[externalReqType] = true;
};

export const allowStakepoolRequests = (stakePoolHost) => {
  const reqType = "stakepool_" + stakePoolHost;
  if (allowedExternalRequests[reqType]) return;

  addAllowedURL(stakePoolHost + "/api/v1/address");
  addAllowedURL(stakePoolHost + "/api/v2/voting");
  addAllowedURL(stakePoolHost + "/api/v1/getpurchaseinfo");
};

export const reloadAllowedExternalRequests = () => {
  allowedExternalRequests = {};
  allowedURLs = [];

  if (process.env.NODE_ENV === "development") {
    allowedURLs.push(/^http:\/\/localhost:3000/);
  }

  const globalCfg = getGlobalCfg();
  const cfgAllowedRequests = globalCfg.get("allowed_external_requests", []);
  cfgAllowedRequests.forEach(v => allowExternalRequest(v));
};
