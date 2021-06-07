import { getJSON, postJSON } from "helpers/fetch";

// Uncomment this and comment the following definition to test locally.
// Also uncomment a code part at externalRequests.js, as politeia is a ssl-enabled
// service and decrediton will fail to fetch locally with a self signed cert.
export const POLITEIA_URL_TESTNET = "https://localhost:4443";

// Politeia doc source:
// https://github.com/decred/politeia/blob/master/politeiawww/api/www/v1/api.md

//export const POLITEIA_URL_TESTNET = "https://test-proposals.decred.org/api";
export const POLITEIA_URL_MAINNET = "https://proposals.decred.org/api";

const GET = (piURL, path) => getJSON(`${piURL}${path}`);

const POST = (piURL, path, payload = {}) =>
  postJSON(`${piURL}${path}`, payload);

// XXX no details route anymore, we should use only records batch route.
export const getProposal = ({ piURL, token }, cb) =>
  GET(piURL, `/v1/proposals/${token}`)
    .then((response) => cb(response))
    .catch((error) => cb(null, error));

export const getProposalVotes = ({ piURL, token }, cb) =>
  GET(piURL, `/v1/proposals/${token}/votes`)
    .then((response) => cb(response))
    .catch((error) => cb(null, error));

export const getVotesInventory = ({ piURL }, cb) =>
  POST(piURL, "/ticketvote/v1/inventory")
    .then((response) => cb(response))
    .catch((error) => cb(null, error));

// votes must be an array of Vote()-produced objects.
export const castVotes = ({ piURL, votes }, cb) =>
  POST(piURL, "/v1/proposals/castvotes", { votes })
    .then((response) => cb(response))
    .catch((error) => cb(null, error));

// tokens is an array of tokens to be fetched.
export const getProposalsBatch = ({ piURL, tokens }, cb) =>
  POST(piURL, "/v1/proposals/batch", { tokens })
    .then((response) => cb(response))
    .catch((error) => cb(null, error));

export const getProposalsVoteStatusBatch = ({ piURL, tokens }, cb) =>
  POST(piURL, "/v1/proposals/batchvotesummary", { tokens })
    .then((response) => cb(response))
    .catch((error) => cb(null, error));
