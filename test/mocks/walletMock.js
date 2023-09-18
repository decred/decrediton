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

const vaMap = {
  TsVRPhzyuvCuxPipBx2YeLarrTPPEAsv4Bh: {
    isValid: true,
    isMine: true,
    accountNumber: 0,
    pubKeyAddr: "TkQ4CFL6gY6iF87MnP1a2hrFZeZ9wmR7uU1aaiVPBiVEE8iaMCXyK",
    pubKey: "A20UfEkHp8ZG4WZc24AQ4c0gYrkkwGOKeeW9LDG75yij",
    isScript: false,
    pkScriptAddrsList: [],
    scriptType: 2,
    payToAddrScript: "dqkUMEbI+i8hd+yvj70Ll1XrcOkp0peIrA==",
    sigsRequired: 0,
    isInternal: true,
    index: 71
  },
  TsiHcAi5c2CpMSmQm8BasAoYgMr91y6Pq3h: {
    isValid: true,
    isMine: true,
    accountNumber: 0,
    pubKeyAddr: "TkQ3bghS4na8dL6kuXwTVvE3Jhe7LH2NbxPbVMkFYZtz412vsk8Qu",
    pubKey: "Ax6Z8n4/KE0W0bKpdqksPg0KIDxv8sXXRFStW8sgFz/V",
    isScript: false,
    pkScriptAddrsList: [],
    scriptType: 2,
    payToAddrScript: "dqkUvWd+epUkLC1UIn45KM7Yicw6rqeIrA==",
    sigsRequired: 0,
    isInternal: true,
    index: 72
  }
};

const dtlReturn = {
  version: 1,
  serType: 0,
  numInputs: 1,
  inputs: [
    {
      prevTxId:
        "d29e701778f726ca5f1b50dddb9529f61911732586fa032eee9c2418f617ce89",
      outputIndex: 0,
      outputTree: 0,
      sequence: 4294967295,
      index: 0,
      valueIn: 106606220,
      blockHeight: 0,
      blockIndex: 4294967295,
      sigScript: {}
    }
  ],
  numOutputs: 2,
  outputs: [
    {
      value: 105373690,
      version: 0,
      script: Buffer.from([
        118, 169, 20, 189, 103, 126, 122, 149, 36, 44, 45, 84, 34, 126, 57, 40,
        206, 216, 137, 204, 58, 174, 167, 136, 172
      ]),
      index: 0,
      decodedScript: {
        scriptClass: 2,
        address: "TsiHcAi5c2CpMSmQm8BasAoYgMr91y6Pq3h",
        requiredSig: 1,
        asm: "OP_DUP OP_HASH160 OP_DATA_20 bd677e7a95242c2d54227e3928ced889cc3aaea7 OP_EQUALVERIFY OP_CHECKSIG"
      }
    },
    {
      value: 1230000,
      version: 0,
      script: Buffer.from([
        118, 169, 20, 210, 81, 146, 28, 152, 87, 121, 24, 21, 233, 119, 80, 175,
        206, 164, 143, 189, 48, 86, 138, 136, 172
      ]),
      index: 1,
      decodedScript: {
        scriptClass: 2,
        address: "TskCC6UkcKfBRsrJVPhSjwGjn7ptD34HA4T",
        requiredSig: 1,
        asm: "OP_DUP OP_HASH160 OP_DATA_20 d251921c9857791815e97750afcea48fbd30568a OP_EQUALVERIFY OP_CHECKSIG"
      }
    }
  ],
  lockTime: 0,
  expiry: 0
};

export const decodeTransactionLocal = jest.fn(() => {
  return dtlReturn;
});
export const validateAddress = jest.fn((...args) => {
  return vaMap[args[1]];
});
export const getTxFromInputs = jest.fn(() => null);
