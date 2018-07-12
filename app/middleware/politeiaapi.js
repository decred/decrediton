// @flow
import axios from "axios";

// Uncomment this and comment the following definition to test locally.
// export const POLITEIA_URL_TESTNET = "https://localhost:4443";

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

export function getActiveVotes(piURL) {
  const url = piURL + "/v1/proposals/activevote";
  return ensureCSRF(piURL).then(() => axios.get(url));
}

export function getVetted(piURL) {
  const url = piURL + "/v1/proposals/vetted";
  return ensureCSRF(piURL).then(() => axios.get(url));
}

export function getVoteStatus(piURL) {
  const url = piURL + "/v1/proposals/votestatus";
  return ensureCSRF(piURL).then(() => axios.get(url));
}

export function getProposal(piURL, token) {
  const url = piURL + "/v1/proposals/" + token;
  return ensureCSRF(piURL).then(() => axios.get(url));
}

export function Vote(token, ticket, voteBitInt, signature) {
  const voteBit = voteBitInt.toString(16);
  return { token, ticket, voteBit, signature };
}

// votes must be an array of Vote()-produced objects.
export function castVotes(piURL, votes) {
  const url = piURL + "/v1/proposals/castvotes";
  return ensureCSRF(piURL).then(resp => {
    const cfg = {
      headers: {
        [CSRF_TOKEN_HEADER]: resp.headers[CSRF_TOKEN_HEADER]
      }
    };
    return axios.post(url, { votes }, cfg);
  });
}

export function getVoteResults(piURL, token) {
  const url = piURL + "/v1/proposals/" + token + "/votes";
  return ensureCSRF(piURL).then(() => axios.get(url));
}
