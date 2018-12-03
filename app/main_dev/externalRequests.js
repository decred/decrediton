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
import { POLITEIA_URL_TESTNET, POLITEIA_URL_MAINNET } from "../middleware/politeiaapi";
import { DCRDATA_URL_TESTNET, DCRDATA_URL_MAINNET } from "../middleware/dcrdataapi";

export const EXTERNALREQUEST_NETWORK_STATUS = "EXTERNALREQUEST_NETWORK_STATUS";
export const EXTERNALREQUEST_STAKEPOOL_LISTING = "EXTERNALREQUEST_STAKEPOOL_LISTING";
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

  // ***IMPORTANT***
  // If testing politeia (or other ssl-enabled services which use a self-signed
  // certificate) locally, you need to uncomment and adjust the following lines
  // to allow electron to accept the self-signed cert as valid.
  // This MUST NOT go enabled into production, as it's a possible security
  // vulnerability, so any PRs enabling this by default will be rejected.
  // if (process.env.NODE_ENV === "development") {
  //   const app = require("electron").app;
  //   app.on("certificate-error", (event, webContents, url, error, certificate, callback) => {
  //     if (url.match(/^https:\/\/localhost:4443\/.*$/)) {
  //       event.preventDefault();
  //       callback(true);
  //     } else {
  //       callback(false);
  //     }
  //   });
  // }

  // TODO: check if this filtering is working even when multiple windows are
  // created (relevant to multi-wallet usage)
  session.defaultSession.webRequest.onBeforeSendHeaders(filter, (details, callback) => {
    const isURLAllowed = (urlRegexp) => urlRegexp.test(details.url);
    if (!allowedURLs.some(isURLAllowed)) {
      logger.log("error", "Blocking external request: " + details.method + " " + details.url);
      logger.log("error", "Make sure that the request is whitelisted in main_dev/externalRequests.js");
      callback({ cancel: true, requestHeaders: details.requestHeaders });
    } else {
      logger.log("verbose", details.method + " " + details.url);
      if (allowedExternalRequests[EXTERNALREQUEST_TREZOR_BRIDGE] && /^http:\/\/127.0.0.1:21325\//.test(details.url)) {
        // trezor bridge requires this as an origin to prevent unwanted access.
        details.requestHeaders["Origin"] = "https://dummy-origin-to-fool-trezor-bridge.trezor.io";
      }

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
    addAllowedURL("https://mainnet.decred.org/api/status");
    break;
  case EXTERNALREQUEST_STAKEPOOL_LISTING:
    addAllowedURL(/^https:\/\/api\.decred\.org\/\?c=gsd$/);
    break;
  case EXTERNALREQUEST_UPDATE_CHECK:
    addAllowedURL("https://api.github.com/repos/decred/decrediton/releases");
    break;
  case EXTERNALREQUEST_POLITEIA:
    addAllowedURL(POLITEIA_URL_TESTNET);
    addAllowedURL(POLITEIA_URL_MAINNET);
    break;
  case EXTERNALREQUEST_DCRDATA:
    addAllowedURL(DCRDATA_URL_TESTNET);
    addAllowedURL(DCRDATA_URL_MAINNET);
    break;
  case EXTERNALREQUEST_TREZOR_BRIDGE:
    addAllowedURL(/^http:\/\/127.0.0.1:21324\//);
    addAllowedURL(/^http:\/\/127.0.0.1:21325\//);

    // TODO: decide whether we want to provide our own signed config
    addAllowedURL(/^https:\/\/wallet.trezor.io\/data\/config_signed.bin\?[\d]+$/);

    // TODO: decide if we wanna block this
    addAllowedURL(/^https:\/\/wallet.trezor.io\/data\/bridge\/latest.txt\?[\d]+$/);

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
  addAllowedURL(stakePoolHost + "/api/v1/stats");
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
