// @flow
import axios from "axios";

export function getActiveVotes(piURL) {
  const url = piURL + "/v1/proposals/activevote";
  return axios.get(url);
}

export function getVetted(piURL) {
  const url = piURL + "/v1/proposals/vetted";
  return axios.get(url);
}
