import MockElectronStore from "./electronStore.js";

export { TRANSACTION_TYPES } from "../../app/wallet/index.js";

export const getRemoteCredentials = () => null;
export const getCLIOptions = jest.fn(() => ({}));
export const allowVSPHost = () => null;
export const getVSPInfo = () => null;
export const getStakePoolInfo = () => [
  {
    host: "https://test-stakepool1.eu",
    label: "https://test-stakepool1.eu",
    vspData: {
      feepercentage: 1
    }
  }
];
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
export const updateStakePoolConfig = jest.fn(() => null);
