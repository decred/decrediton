/**
 * This file is responsible for controlling outbound connections from the wallet.
 *
 * It works on a whitelist basis, only allowing requests with URLs matching the
 * regexps contained in `allowedURLs` to be performed. Individual URLs can be
 * allowed by passing the appropriate url to the ipcMain message "allowURL".
 */
import { session } from "electron";
import { getGlobalCfg } from "../config";
import {
  POLITEIA_URL_TESTNET,
  POLITEIA_URL_MAINNET
} from "../middleware/politeiaapi";
import {
  DCRDATA_URL_TESTNET,
  DCRDATA_URL_MAINNET
} from "../middleware/dcrdataapi";
import * as cfgConstants from "constants/config";

import {
  EXTERNALREQUEST_DEX,
  EXTERNALREQUEST_NETWORK_STATUS,
  EXTERNALREQUEST_STAKEPOOL_LISTING,
  EXTERNALREQUEST_UPDATE_CHECK,
  EXTERNALREQUEST_POLITEIA,
  EXTERNALREQUEST_DCRDATA,
  EXTERNALREQUEST_TREZOR_BRIDGE
} from "constants";

export const DEX_LOCALPAGE = "127.0.0.1:5760";

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
  session.defaultSession.webRequest.onBeforeSendHeaders(
    filter,
    (details, callback) => {
      const isURLAllowed = (urlRegexp) => urlRegexp.test(details.url);
      if (!allowedURLs.some(isURLAllowed)) {
        logger.log(
          "error",
          "Blocking external request: " + details.method + " " + details.url
        );
        logger.log(
          "error",
          "Make sure that the request is whitelisted in main_dev/externalRequests.js"
        );
        callback({ cancel: true, requestHeaders: details.requestHeaders });
      } else {
        //logger.log("verbose", details.method + " " + details.url);
        if (
          allowedExternalRequests[EXTERNALREQUEST_TREZOR_BRIDGE] &&
          /^http:\/\/127.0.0.1:21325\//.test(details.url)
        ) {
          // trezor bridge requires this as an origin to prevent unwanted access.
          details.requestHeaders["Origin"] =
            "https://dummy-origin-to-fool-trezor-bridge.trezor.io";
        }

        callback({ cancel: false, requestHeaders: details.requestHeaders });
      }
    }
  );

  session.defaultSession.webRequest.onHeadersReceived((details, callback) => {
    const newHeaders = { ...details.responseHeaders };
    let statusLine = details.statusLine;

    const isDev = process.env.NODE_ENV === "development";

    if (/app\.html$/.test(details.url)) {
      // Allow unsafe-eval in dev mode due to react-devtools requiring it.
      const defaultSrc = isDev ? "'self' 'unsafe-eval'" : "'self'";

      // Allow http calls in dev mode so testing local services is easier.
      const connectSrc = isDev ? "https: http:" : "https:";

      // Allow unsafe-inline due to us injecting certain styles directly in
      // elements.
      const styleSrc = "'self' 'unsafe-inline'";

      // Allow data: due to webpack injecting some assets directly as data URLs.
      const imgSrc = "data: 'self'";

      // Set the CSP header for the main wallet UI entry point.
      newHeaders["Content-Security-Policy"] =
        `default-src ${defaultSrc}; ` +
        `style-src ${styleSrc}; ` +
        `img-src ${imgSrc}; ` +
        `connect-src ${connectSrc}; `;
    }

    const requestURL = new URL(details.url);
    const maybeVSPReqType = `stakepool_${requestURL.protocol}//${requestURL.host}`;
    const isVSPRequest = allowedExternalRequests[maybeVSPReqType];

    if (isDev && /^http[s]?:\/\//.test(details.url)) {
      // In development (when accessing via the HMR server) we need to overwrite
      // the origin, otherwise electron fails to contact external servers due
      // to missing or wrong Access-Control-Allow-Origin when webSecurity is
      // enabled.
      Object.keys(newHeaders).forEach(
        (k) =>
          k.toLowerCase() === "access-control-allow-origin" &&
          delete newHeaders[k]
      );
      newHeaders["Access-Control-Allow-Origin"] = "http://localhost:3000";

      // When calling a Politeia POST endpoint in dev mode, electron performs
      // a preflight OPTIONS call. Include the "Content-Type" as an allowed
      // header because Politeia doesn't currently does this.
      const isPoliteia =
        details.url.startsWith(POLITEIA_URL_TESTNET) ||
        details.url.startsWith(POLITEIA_URL_MAINNET);
      if (isPoliteia && details.method === "OPTIONS") {
        statusLine = "OK";
        newHeaders["Access-Control-Allow-Headers"] = "Content-Type";
      }

      if (isVSPRequest && details.method === "OPTIONS") {
        statusLine = "OK";
        newHeaders["Access-Control-Allow-Headers"] =
          "Content-Type,vsp-client-signature";
      }

      const globalCfg = getGlobalCfg();
      const cfgAllowedVSPs = globalCfg.get(cfgConstants.ALLOWED_VSP_HOSTS, []);
      if (cfgAllowedVSPs.some((url) => details.url.includes(url))) {
        statusLine = "OK";
        newHeaders["Access-Control-Allow-Headers"] =
          "Content-Type, VSP-Client-Signature";
      }
    }
    callback({ responseHeaders: newHeaders, statusLine });
  });
};

const addAllowedURL = (url) => {
  if (!(url instanceof RegExp)) url = new RegExp(url);
  allowedURLs.push(url);
};

export const allowExternalRequest = (externalReqType) => {
  if (allowedExternalRequests[externalReqType]) return;

  switch (externalReqType) {
    case EXTERNALREQUEST_DEX:
      addAllowedURL(`http://${DEX_LOCALPAGE}`);
      addAllowedURL(`ws://${DEX_LOCALPAGE}`);
      break;
    case EXTERNALREQUEST_NETWORK_STATUS:
      addAllowedURL("https://testnet.decred.org/api/status");
      addAllowedURL("https://mainnet.decred.org/api/status");
      break;
    case EXTERNALREQUEST_STAKEPOOL_LISTING:
      addAllowedURL(/^https:\/\/api\.decred\.org\/\?c=gsd$/);
      addAllowedURL(/^https:\/\/api\.decred\.org\/\?c=vsp$/);
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
      addAllowedURL(/^http:\/\/127.0.0.1:21325\//);
      break;
    default:
      logger.log("error", "Unknown external request type: " + externalReqType);
  }

  allowedExternalRequests[externalReqType] = true;
};

// TODO remove after stopping support vsp v1/v2.
export const LEGACY_allowStakepoolRequests = (stakePoolHost) => {
  const reqType = "stakepool_" + stakePoolHost;
  if (allowedExternalRequests[reqType]) return;

  addAllowedURL(stakePoolHost + "/api/v1/address");
  addAllowedURL(stakePoolHost + "/api/v2/voting");
  addAllowedURL(stakePoolHost + "/api/v1/getpurchaseinfo");
  addAllowedURL(stakePoolHost + "/api/v1/stats");
  allowedExternalRequests[reqType] = true;
};

// allowVSPRequests allows external vsp request into decrediton.
export const allowVSPRequests = (stakePoolHost) => {
  const reqType = "stakepool_" + stakePoolHost;
  if (allowedExternalRequests[reqType]) return;

  addAllowedURL(stakePoolHost + "/api/v3/vspinfo");
  addAllowedURL(stakePoolHost + "/api/v3/ticketstatus");
  addAllowedURL(stakePoolHost + "/api/v3/feeaddress");
  addAllowedURL(stakePoolHost + "/api/v3/payfee");
  addAllowedURL(stakePoolHost + "/api/ticketstatus");
  allowedExternalRequests[reqType] = true;
};

export const reloadAllowedExternalRequests = () => {
  allowedExternalRequests = {};
  allowedURLs = [/^devtools:\/\/*/, /^file:\/\/(.*)\/app\/*/];

  if (process.env.NODE_ENV === "development") {
    allowedURLs.push(/^http:\/\/localhost:3000/);
    allowedURLs.push(/^chrome-extension:\/\/*/);
  }

  const globalCfg = getGlobalCfg();
  const cfgAllowedRequests = globalCfg.get(
    cfgConstants.ALLOWED_EXTERNAL_REQUESTS,
    []
  );
  cfgAllowedRequests.forEach((v) => allowExternalRequest(v));

  const cfgAllowedVSPs = globalCfg.get(cfgConstants.ALLOWED_VSP_HOSTS, []);
  cfgAllowedVSPs.forEach((v) => allowVSPRequests(v));
};
