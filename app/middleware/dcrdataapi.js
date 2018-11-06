// @flow
import axios from "axios";

export const DCRDATA_URL_TESTNET = "https://testnet.dcrdata.org/api";
export const DCRDATA_URL_MAINNET = "https://explorer.dcrdata.org/api";

const GET = (path) => {
  const config = {};
  return axios.get(path, config);
};

export const getTreasuryInfo = (daURL, treasuryAddress) => GET(daURL + "/address/" + treasuryAddress + "/totals");
