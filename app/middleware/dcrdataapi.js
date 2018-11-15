// @flow
import axios from "axios";

export const DCRDATA_URL_TESTNET = "https://testnet.dcrdata.org/api";
export const DCRDATA_URL_MAINNET = "https://explorer.dcrdata.org/api";

const GET = (path) => {
  return axios.get(path);
};

export const getTreasuryInfo = (daURL, treasuryAddress) => GET(daURL + "/address/" + treasuryAddress + "/totals");
