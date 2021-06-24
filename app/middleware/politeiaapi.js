import { getJSON, postJSON } from "helpers/fetch";

// Uncomment this and comment the following definition to test locally.
// Also uncomment a code part at externalRequests.js, as politeia is a ssl-enabled
// service and decrediton will fail to fetch locally with a self signed cert.
export const POLITEIA_URL_TESTNET = "https://localhost:4443";

// Politeia doc source:
// https://github.com/decred/politeia/blob/master/politeiawww/api/www/v1/api.md

//export const POLITEIA_URL_TESTNET = "https://test-proposals.decred.org/api";
export const POLITEIA_URL_MAINNET = "https://proposals.decred.org/api";

const POST = (piURL, path, payload = {}) =>
  postJSON(`${piURL}${path}`, payload);

export const getProposalDetails = ({ piURL, token }, cb) =>
  POST(piURL, "/records/v1/details", { token })
    .then((response) => cb(response))
    .catch((error) => cb(null, error));

export const getProposalVoteDetails = ({ piURL, token }, cb) =>
  POST(piURL, "/ticketvote/v1/details", { token })
    .then((response) => cb(response))
    .catch((error) => cb(null, error));

export const getProposalVoteResults = ({ piURL, token }, cb) =>
  POST(piURL, "/ticketvote/v1/results", { token })
    .then((response) => cb(response))
    .catch((error) => cb(null, error));

export const getVotesInventory = ({ piURL }, cb) =>
  POST(piURL, "/ticketvote/v1/inventory")
    .then((response) => cb(response))
    .catch((error) => cb(null, error));

export const castBallot = ({ piURL, votes }, cb) =>
  POST(piURL, "/ticketvote/v1/castballot", { votes })
    .then((response) => cb(response))
    .catch((error) => cb(null, error));

// tokens is an array of tokens to be fetched.
export const getProposalsBatch = ({ piURL, requests }, cb) =>
  POST(piURL, "/records/v1/records", { requests })
    .then((response) => cb(response))
    .catch((error) => cb(null, error));

export const getProposalsVoteSummaryBatch = ({ piURL, tokens }, cb) =>
  POST(piURL, "/ticketvote/v1/summaries", { tokens })
    .then((response) => cb(response))
    .catch((error) => cb(null, error));
