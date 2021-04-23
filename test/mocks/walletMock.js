export { TRANSACTION_TYPES } from "../../app/wallet/index.js";

export const getRemoteCredentials = () => null;
export const getCLIOptions = () => ({});
export const allowVSPHost = () => null;
export const getVSPInfo = () => (null);
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
