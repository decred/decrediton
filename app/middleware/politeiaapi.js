// @flow
import axios from "axios";

// Uncomment this and comment the following definition to test locally.
// Also uncomment a code part at externalRequests.js, as politeia is a ssl-enabled
// service and decrediton will fail to fetch locally with a self signed cert.
// export const POLITEIA_URL_TESTNET = "https://localhost:4443";

// Politeia doc source:
// https://github.com/decred/politeia/blob/master/politeiawww/api/www/v1/api.md

export const POLITEIA_URL_TESTNET = "https://test-proposals.decred.org/api";
export const POLITEIA_URL_MAINNET = "https://proposals.decred.org/api";

const CSRF_TOKEN_HEADER = "x-csrf-token"; // must always be lowercase

let CSRFPromise = null;

function ensureCSRF(piURL) {
  if (!CSRFPromise) {
    CSRFPromise = axios.get(piURL + "/");
  }
  return CSRFPromise;
}

function GET(piURL, path) {
  return ensureCSRF(piURL).then(() => axios.get(piURL + path));
}

function POST(piURL, path, payload) {
  return ensureCSRF(piURL).then((resp) => {
    const cfg = {
      headers: {
        [CSRF_TOKEN_HEADER]: resp.headers[CSRF_TOKEN_HEADER]
      }
    };
    return axios.post(piURL + path, payload, cfg);
  });
}

export const getProposal = ({ piURL, token }, cb) =>
  GET(piURL, "/v1/proposals/" + token).then(function (response) {
    cb(response);
  }).catch(function (error) {
    cb(null, error);
  });
export const getProposalVotes = ({ piURL, token }, cb) =>
  GET(piURL, "/v1/proposals/" + token + "/votes").then(function (response) {
    cb(response);
  }).catch(function (error) {
    cb(null, error);
  });
export const getTokenInventory = ({ piURL }, cb) => GET(piURL, "/v1/proposals/tokeninventory").then(function (response) {
  cb(response);
}).catch(function (error) {
  cb(null, error);
});

// votes must be an array of Vote()-produced objects.
export const castVotes = ({ piURL, votes }, cb) =>
  POST(piURL, "/v1/proposals/castvotes", { votes }).then(function (response) {
    cb(response);
  }).catch(function (error) {
    cb(null, error);
  });

// tokens is an array of tokens to be fetched.
export const getProposalsBatch = ({ piURL, tokens }, cb) => POST(piURL, "/v1/proposals/batch", { tokens })
  .then(function (response) {
    cb(response);
  }).catch(function (error) {
    cb(null, error);
  });

export const getProposalsVoteStatusBatch = ({ piURL, tokens }, cb) =>
  POST(piURL, "/v1/proposals/batchvotesummary", { tokens }).then(function (response) {
    cb(response);
  }).catch(function (error) {
    cb(null, error);
  });
