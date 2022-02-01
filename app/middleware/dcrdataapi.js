import { getJSON } from "helpers/fetch";

export const DCRDATA_URL_TESTNET = "https://testnet.decred.org/api";
export const DCRDATA_URL_MAINNET = "https://dcrdata.decred.org/api";

const GET = (path) => getJSON(path);

export const getLegacyTreasuryInfo = (daURL, treasuryAddress) =>
  GET(`${daURL}/address/${treasuryAddress}/totals`);

export const getAdendasInfo = (daURL) => GET(`${daURL}/agendas`);

export const getTreasuryInfo = (daURL) => GET(`${daURL}/treasury/balance`);
