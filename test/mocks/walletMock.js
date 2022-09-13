import MockElectronStore from "./electronStore.js";
import { decodeRawTransaction as drt } from "../../app/wallet/service.js";

export { TRANSACTION_TYPES } from "../../app/wallet/index.js";

export const getRemoteCredentials = () => null;
export const getCLIOptions = jest.fn(() => ({}));
export const allowVSPHost = () => null;
export const getVSPInfo = () => null;
export const getDcrdLogs = () => "";
export const getDcrwalletLogs = () => "";
export const getDcrlndLogs = () => "";
export const getDecreditonLogs = () => "";
export const reloadAllowedExternalRequests = () => null;
export const setupProxy = () => null;
export const readFromClipboard = jest.fn(() => "");
export const showOpenDialog = jest.fn(() => null);
export const showSaveDialog = jest.fn(() => null);
export const getGlobalCfg = jest.fn(() => new MockElectronStore());
export const getWalletCfg = jest.fn(() => new MockElectronStore());
export const getDcrwalletLastLogLine = jest.fn(() =>
  Promise.resolve("last dcrwallet log line")
);
export const getDcrdLastLogLine = jest.fn(() =>
  Promise.resolve("last dcrd log line")
);
export const getAvailableWallets = jest.fn(() => []);
export const getPreviousWallet = jest.fn(() => null);

export const decodeRawTransaction = jest.fn((...args) => drt(...args));
