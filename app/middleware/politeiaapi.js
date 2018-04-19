// @flow
import axios from "axios";

export const POLITEIA_URL_TESTNET = "https://test-proposals.decred.org/api";
export const POLITEIA_URL_MAINNET = "https://politeia.org/api"; // FIXME: set to production URL

export function getActiveVotes(piURL) {
  const url = piURL + "/v1/proposals/activevote";
  return axios.get(url);
}

export function getVetted(piURL) {
  const url = piURL + "/v1/proposals/vetted";
  return axios.get(url);
}

export function getProposal(piURL, token) {
  const url = piURL + "/v1/proposals/" + token;
  return axios.get(url);
}

export function Vote(token, ticket, voteBitInt, signature) {
  const voteBit = voteBitInt.toString(16);
  return { token, ticket, voteBit, signature };
}

// votes must be an array of Vote()-produced objects.
export function castVotes(piURL, votes) {
  const url = piURL + "/v1/proposals/castvotes";
  return axios.post(url, { votes });
}

export function getVoteResults(piURL, token) {
  const url = piURL + "/v1/proposals/voteresults";
  const data = { vote: { token } };
  return axios.post(url, data);
}
