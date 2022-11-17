import * as sel from "selectors";
import * as wal from "wallet";
import * as vspa from "actions/VSPActions";
import * as ca from "actions/ControlActions";
import { createStore } from "test-utils.js";
import * as arrs from "../../../app/helpers/arrays";
import { cloneDeep } from "fp";
import {
  mockVspInfo,
  defaultMockAvailableMainnetVsps,
  defaultMockAvailableTestnetVsps,
  defaultMockAvailableInvalidVsps,
  mockTickets
} from "./vspMocks.js";
import { mockNormalizedStakeTransactions } from "../components/views/TransactionPage/mocks.js";
import {
  mockMixedAccountValue,
  mockChangeAccountValue,
  mockMixedAccount
} from "../components/views/TicketsPage/PurchaseTab/mocks";

let mockAvailableMainnetVsps = cloneDeep(defaultMockAvailableMainnetVsps);
const mockAvailableMainnetVspsPubkeys = cloneDeep(
  defaultMockAvailableMainnetVsps
).map((v) => ({ ...v, pubkey: `${v.host}-pubkey` }));

const selectors = sel;
const vspActions = vspa;
const wallet = wal;
const arrays = arrs;
const controlActions = ca;

let mockSignMessageAttempt;
let mockGetVSPTicketStatus;
let mockProcessManagedTickets;

const mockSig = "test-sig";
const mockVSPTicketInfoResponse = {
  data: {
    timestamp: 1651855899,
    ticketconfirmed: true,
    feetxstatus: "confirmed",
    feetxhash: "test-feetxhash",
    altsignaddress: "",
    votechoices: {
      autorevocations: "abstain",
      changesubsidysplit: "abstain",
      explicitverupgrades: "abstain",
      reverttreasurypolicy: "abstain"
    },
    tspendpolicy: {},
    treasurypolicy: {},
    request: "test-request"
  }
};

beforeEach(() => {
  selectors.getVSPInfoTimeoutTime = jest.fn(() => 100);
  selectors.isTestNet = jest.fn(() => false);
  selectors.getAvailableVSPs = jest.fn(() => mockAvailableMainnetVsps);
  selectors.spendingAccounts = jest.fn(() => [mockMixedAccount]);
  selectors.visibleAccounts = jest.fn(() => [mockMixedAccount]);
  selectors.getMixedAccount = jest.fn(() => mockMixedAccountValue);
  selectors.getChangeAccount = jest.fn(() => mockChangeAccountValue);
  selectors.defaultSpendingAccount = jest.fn(() => mockMixedAccount);
  selectors.getAvailableVSPsPubkeys = jest.fn(
    () => mockAvailableMainnetVspsPubkeys
  );
  arrays.shuffle = jest.fn((arr) => arr);
  wallet.getVSPInfo = jest.fn(() => {});
  wallet.getAllVSPs = jest.fn(() => [
    ...mockAvailableMainnetVsps,
    ...cloneDeep(defaultMockAvailableTestnetVsps),
    ...cloneDeep(defaultMockAvailableInvalidVsps)
  ]);
  wallet.getTickets = jest.fn(() => Promise.resolve(mockTickets));
  mockSignMessageAttempt = controlActions.signMessageAttempt = jest.fn(
    () => () => mockSig
  );
  mockGetVSPTicketStatus = wallet.getVSPTicketStatus = jest.fn(() =>
    Promise.resolve(mockVSPTicketInfoResponse)
  );

  mockProcessManagedTickets = wallet.processManagedTickets = jest.fn(
    () => () => {}
  );
  wallet.getVSPTicketsByFeeStatus = jest.fn(() =>
    Promise.resolve({ ticketHashes: [] })
  );
  wallet.getVSPTrackedTickets = jest.fn(() => Promise.resolve());
});

const testRandomVSP = async (
  maxFee,
  expectedVspResponse,
  expectedErrorResponse
) => {
  const store = createStore({});

  let errorResponse;
  let vspResponse;
  try {
    vspResponse = await store.dispatch(vspActions.getRandomVSP(maxFee));
  } catch (error) {
    errorResponse = error.message;
  }

  mockAvailableMainnetVsps = cloneDeep(defaultMockAvailableMainnetVsps);
  expect(vspResponse).toEqual(expectedVspResponse);
  expect(errorResponse).toEqual(expectedErrorResponse);
};

test("test getRandomVSP", async () => {
  // no availableVSPs
  mockAvailableMainnetVsps = [];
  wallet.getVSPInfo = jest.fn(() => Promise.resolve(mockVspInfo));
  await testRandomVSP(5, undefined, "The available VSPs list is empty.");

  // high maxFee
  wallet.getVSPInfo = jest.fn(() => Promise.resolve(mockVspInfo));
  await testRandomVSP(
    5,
    {
      ...mockAvailableMainnetVsps[2],
      host: mockAvailableMainnetVsps[2].host,
      pubkey: mockVspInfo.data.pubkey
    },
    undefined
  );

  // "constraint maxFee",
  await testRandomVSP(
    3,
    {
      ...mockAvailableMainnetVsps[1],
      host: mockAvailableMainnetVsps[1].host,
      pubkey: mockVspInfo.data.pubkey
    },
    undefined
  );

  // "lowest valid maxFee",
  await testRandomVSP(
    2,
    {
      ...mockAvailableMainnetVsps[0],
      host: mockAvailableMainnetVsps[0].host,
      pubkey: mockVspInfo.data.pubkey
    },
    undefined
  );

  // "too low maxFee, expect to receive error",
  await testRandomVSP(
    1,
    undefined,
    "No VSPs available for that fee rate. (Minimum is currently 2%)"
  );

  // high max feee, but can't fetch any VSP info. Expect fetch error
  wallet.getVSPInfo = jest.fn(() => Promise.reject());
  await testRandomVSP(5, undefined, "Fetching VSP info failed.");

  // high max feee. The first unsuccessful VSP info fetch
  // the second returns
  let i = 0;
  wallet.getVSPInfo = jest.fn(() =>
    i++ > 1 ? Promise.resolve(mockVspInfo) : Promise.reject()
  );
  await testRandomVSP(
    10,
    {
      ...mockAvailableMainnetVsps[0],
      host: mockAvailableMainnetVsps[0].host,
      pubkey: mockVspInfo.data.pubkey
    },
    undefined
  );
});

test("test discoverAvailableVSPs (mainnet)", async () => {
  const store = createStore({});

  const response = await store.dispatch(vspActions.discoverAvailableVSPs());
  const expectedAvailableVsps = cloneDeep(defaultMockAvailableMainnetVsps).map(
    (vsp) => ({
      ...vsp,
      label: vsp.host,
      value: vsp.host
    })
  );

  expect(response).toEqual(expectedAvailableVsps);
  expect(store.getState().vsp.availableVSPs).toEqual(expectedAvailableVsps);
  expect(store.getState().vsp.availableVSPsError).toEqual(undefined);
});

test("test discoverAvailableVSPs (testnet)", async () => {
  selectors.isTestNet = jest.fn(() => true);
  const store = createStore({});

  const response = await store.dispatch(vspActions.discoverAvailableVSPs());
  const expectedAvailableVsps = cloneDeep(defaultMockAvailableTestnetVsps).map(
    (vsp) => ({
      ...vsp,
      label: vsp.host,
      value: vsp.host
    })
  );

  expect(response).toEqual(expectedAvailableVsps);
  expect(store.getState().vsp.availableVSPs).toEqual(expectedAvailableVsps);
  expect(store.getState().vsp.availableVSPsError).toEqual(undefined);
});

test("test discoverAvailableVSPs (error)", async () => {
  const testErrorMessage = "test-error-message";
  wallet.getAllVSPs = jest.fn(() => Promise.reject(testErrorMessage));
  const store = createStore({});

  const response = await store.dispatch(vspActions.discoverAvailableVSPs());

  expect(response).toEqual(undefined);
  expect(store.getState().vsp.availableVSPs).toEqual(null);
  expect(store.getState().vsp.availableVSPsError).toEqual(testErrorMessage);
});

test("test getVSPsPubkeys", async () => {
  const mockPubkeys = {
    [`https://${mockAvailableMainnetVsps[0].host}`]: "test-pubkey1",
    [`https://${mockAvailableMainnetVsps[1].host}`]: null, // will be rejected
    [`https://${mockAvailableMainnetVsps[2].host}`]: "invalid",
    [`https://${mockAvailableMainnetVsps[3].host}`]: "test-pubkey3",
    [`https://${mockAvailableMainnetVsps[4].host}`]: "test-pubkey4",
    [`https://${mockAvailableMainnetVsps[5].host}`]: "test-pubkey5"
  };

  const fetchTimes = {
    [`https://${mockAvailableMainnetVsps[0].host}`]: 20,
    [`https://${mockAvailableMainnetVsps[1].host}`]: 10,
    [`https://${mockAvailableMainnetVsps[2].host}`]: 5,
    [`https://${mockAvailableMainnetVsps[3].host}`]: 0,
    [`https://${mockAvailableMainnetVsps[4].host}`]: 1000, // will timeout
    [`https://${mockAvailableMainnetVsps[5].host}`]: 0
  };

  wallet.getVSPInfo = jest.fn((host) => {
    if (!mockPubkeys[host]) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        mockPubkeys[host] !== "invalid"
          ? resolve({ data: { pubkey: mockPubkeys[host] } })
          : mockPubkeys[host]
          ? resolve({ data: {} })
          : reject();
      }, fetchTimes[host]);
    });
  });

  const store = createStore({});
  await store.dispatch(vspActions.getVSPsPubkeys());

  expect(store.getState().vsp.availableVSPsPubkeys).toMatchInlineSnapshot(`
    Array [
      Object {
        "host": "test-stakepool1.eu",
        "label": "test-stakepool1.eu",
        "outdated": false,
        "pubkey": "test-pubkey1",
        "value": "test-stakepool1.eu",
        "vspData": Object {
          "feepercentage": 2,
          "network": "mainnet",
          "vspdversion": "1.1.0",
        },
      },
      Object {
        "host": "test-stakepool4.eu",
        "label": "test-stakepool4.eu",
        "outdated": false,
        "pubkey": "test-pubkey3",
        "value": "test-stakepool4.eu",
        "vspData": Object {
          "network": "mainnet",
          "vspdversion": "1.1.0",
        },
      },
      Object {
        "host": "test-stakepool6.eu",
        "label": "test-stakepool6.eu",
        "outdated": true,
        "pubkey": "test-pubkey5",
        "value": "test-stakepool6.eu",
        "vspData": Object {
          "feepercentage": 1,
          "network": "mainnet",
          "vspdversion": "1.0.0",
        },
      },
    ]
  `);
  expect(store.getState().vsp.availableVSPsPubkeysError).toEqual(null);
});

test("test getVSPsPubkeys (error)", async () => {
  const testErrorMessage = "test-error-message";
  wallet.getAllVSPs = jest.fn(() => Promise.reject(testErrorMessage));
  const store = createStore({});
  await store.dispatch(vspActions.getVSPsPubkeys());

  expect(store.getState().vsp.availableVSPsPubkeys).toEqual(undefined);
  expect(store.getState().vsp.availableVSPsPubkeysError).toEqual(
    "Error: INVALID_VSPS"
  );
});

test("test isVSPOutdated function", () => {
  const minVersion = "1.1.0";
  expect(vspActions.isVSPOutdated("1.1.0", minVersion)).toBeFalsy();
  expect(vspActions.isVSPOutdated("2.2.0", minVersion)).toBeFalsy();
  expect(vspActions.isVSPOutdated("1.2.0", minVersion)).toBeFalsy();
  expect(vspActions.isVSPOutdated("1.1.1", minVersion)).toBeFalsy();
  expect(vspActions.isVSPOutdated("1.2.1", minVersion)).toBeFalsy();
  expect(vspActions.isVSPOutdated("1.2.1-pre", minVersion)).toBeFalsy();
  expect(vspActions.isVSPOutdated("1.2.1-alpha", minVersion)).toBeFalsy();
  expect(vspActions.isVSPOutdated("1.2.1-beta", minVersion)).toBeFalsy();

  expect(vspActions.isVSPOutdated("1.0.0", minVersion)).toBeTruthy();
  expect(vspActions.isVSPOutdated("1.0.0-pre", minVersion)).toBeTruthy();
  expect(vspActions.isVSPOutdated("1.1.0-pre", minVersion)).toBeTruthy();
  expect(vspActions.isVSPOutdated("1.1.0-alpha", minVersion)).toBeTruthy();
  expect(vspActions.isVSPOutdated("1.1.0-beta", minVersion)).toBeTruthy();
  expect(vspActions.isVSPOutdated(null, minVersion)).toBeTruthy();
  expect(vspActions.isVSPOutdated(undefined, minVersion)).toBeTruthy();
});

test("test getUnspentUnexpiredVspTickets", async () => {
  const store = createStore({});
  await store.dispatch(vspActions.getUnspentUnexpiredVspTickets());
  expect(store.getState().vsp.getUnspentUnexpiredVspTicketsAttempt).toBeFalsy();
  expect(store.getState().vsp.unspentUnexpiredVspTickets).toStrictEqual([
    {
      host: `https://${defaultMockAvailableMainnetVsps[0].host}`,
      tickets: ["tx-hash-1"]
    },
    {
      host: `https://${defaultMockAvailableMainnetVsps[1].host}`,
      tickets: ["tx-hash-2", "tx-hash-3"]
    },
    {
      host: `https://${defaultMockAvailableMainnetVsps[5].host}`,
      tickets: ["tx-hash-4"]
    }
  ]);
});

test("test getUnspentUnexpiredVspTickets", async () => {
  const testError = "test-error-message";
  wallet.getTickets = jest.fn(() => Promise.reject(testError));
  const store = createStore({});
  await store.dispatch(vspActions.getUnspentUnexpiredVspTickets());
  expect(store.getState().vsp.getUnspentUnexpiredVspTicketsAttempt).toBeFalsy();
  expect(store.getState().vsp.unspentUnexpiredVspTickets).toBe(undefined);
  expect(store.getState().vsp.getUnspentUnexpiredVspTicketsError).toBe(
    testError
  );
});

const mockPassphrase = "test-passphrase";
const mockTx =
  mockNormalizedStakeTransactions[
    "05fba7101e0d038bad81777f221189eebce9461d1181d961a284f32ed3664e07"
  ];
const mockTxImmature =
  mockNormalizedStakeTransactions[
    "f0085fbc5f7476dc4907618262ae6e8a967ab1ac21c55465ed1dc31369dec530"
  ];
const mockVspHost = "mock-vsp-host";
const mockCommitmentAddress = "test-commitment-address";
const mockDecodedTx = {
  outputs: [
    {},
    {
      decodedScript: {
        address: mockCommitmentAddress
      }
    }
  ]
};

test("test getVSPTicketStatus", async () => {
  const mockTxCopy = cloneDeep(mockTx);
  mockTxCopy.ticketTx = { vspHost: mockVspHost };
  const store = createStore({});
  const res = await store.dispatch(
    vspActions.getVSPTicketStatus(mockPassphrase, mockTxCopy, mockDecodedTx)
  );

  expect(res).toStrictEqual(mockVSPTicketInfoResponse.data);
  expect(res).toHaveProperty(
    "feetxUrl",
    `https://dcrdata.decred.org/tx/${mockVSPTicketInfoResponse.data.feetxhash}`
  );

  expect(mockSignMessageAttempt).toHaveBeenCalledWith(
    mockCommitmentAddress,
    `{"tickethash":"${mockTx["txHash"]}"}`,
    mockPassphrase
  );

  expect(mockGetVSPTicketStatus).toHaveBeenCalledWith({
    host: mockVspHost,
    json: { tickethash: mockTx["txHash"] },
    sig: mockSig
  });

  expect(store.getState().vsp.getVSPTicketStatusError).toEqual(undefined);
  expect(mockProcessManagedTickets).toHaveBeenCalled();
});

test("test getVSPTicketStatus (immature ticket)", async () => {
  const mockTxCopy = cloneDeep(mockTxImmature);
  mockTxCopy.ticketTx = { vspHost: mockVspHost };
  const store = createStore({});
  const res = await store.dispatch(
    vspActions.getVSPTicketStatus(mockPassphrase, mockTxCopy, mockDecodedTx)
  );

  expect(res).toStrictEqual(mockVSPTicketInfoResponse.data);
  expect(res).toHaveProperty(
    "feetxUrl",
    `https://dcrdata.decred.org/tx/${mockVSPTicketInfoResponse.data.feetxhash}`
  );

  expect(mockSignMessageAttempt).toHaveBeenCalledWith(
    mockCommitmentAddress,
    `{"tickethash":"${mockTxImmature["txHash"]}"}`,
    mockPassphrase
  );

  expect(mockGetVSPTicketStatus).toHaveBeenCalledWith({
    host: mockVspHost,
    json: { tickethash: mockTxImmature["txHash"] },
    sig: mockSig
  });

  expect(store.getState().vsp.getVSPTicketStatusError).toEqual(undefined);
  expect(mockProcessManagedTickets).toHaveBeenCalled();
});

test("test getVSPTicketStatus (in testnet mode the fee tx hash url should point to testnet)", async () => {
  const mockTxCopy = cloneDeep(mockTx);
  mockTxCopy.ticketTx = { vspHost: mockVspHost };
  const store = createStore({
    settings: { currentSettings: { network: "testnet" } }
  });
  const res = await store.dispatch(
    vspActions.getVSPTicketStatus(mockPassphrase, mockTxCopy, mockDecodedTx)
  );

  expect(res).toStrictEqual(mockVSPTicketInfoResponse.data);
  expect(res).toHaveProperty(
    "feetxUrl",
    `https://testnet.decred.org/tx/${mockVSPTicketInfoResponse.data.feetxhash}`
  );
});

const testGetVSPTicketStatusFailing = async (
  _,
  errorMsg,
  getInvalidMockTx,
  mockInvalidDecodedTx
) => {
  const mockTxCopy = getInvalidMockTx();
  const store = createStore({});
  const res = await store.dispatch(
    vspActions.getVSPTicketStatus(
      mockPassphrase,
      mockTxCopy,
      mockInvalidDecodedTx
    )
  );

  expect(res).toStrictEqual(undefined);
  expect(mockSignMessageAttempt).not.toHaveBeenCalled();
  expect(mockGetVSPTicketStatus).not.toHaveBeenCalled();
  expect(store.getState().vsp.getVSPTicketStatusError).toEqual(errorMsg);
};

const mockValidMockTxCopy = cloneDeep(mockTx);
mockValidMockTxCopy.ticketTx = { vspHost: mockVspHost };

test.each([
  [
    "invalid tx parameter",
    "Error: Invalid tx parameter",
    () => null,
    cloneDeep(mockDecodedTx)
  ],
  [
    "invalid tx.ticketTx parameter",
    "Error: Invalid tx parameter",
    () => {
      const res = cloneDeep(mockValidMockTxCopy);
      res.ticketTx = null;
      return res;
    },
    cloneDeep(mockDecodedTx)
  ],
  [
    "invalid tx.ticketTx.vspHost parameter",
    "Error: Invalid tx parameter",
    () => {
      const res = cloneDeep(mockTx);
      res.ticketTx.vspHost = null;
      return res;
    },
    cloneDeep(mockDecodedTx)
  ],
  [
    "invalid tx.txHash",
    "Error: Invalid tx parameter",
    () => {
      const res = cloneDeep(mockValidMockTxCopy);
      res.txHash = null;
      return res;
    },
    cloneDeep(mockDecodedTx)
  ],
  [
    "invalid decodedTx",
    "Error: Invalid decodedTx parameter",
    () => cloneDeep(mockValidMockTxCopy),
    null
  ],
  [
    "empy decodedTx",
    "Error: Invalid decodedTx parameter",
    () => cloneDeep(mockValidMockTxCopy),
    {}
  ],
  [
    "decodedTx.output empty",
    "Error: Invalid decodedTx parameter",
    () => cloneDeep(mockValidMockTxCopy),
    {
      output: []
    }
  ],
  [
    "decodedTx.output has only one element",
    "Error: Invalid decodedTx parameter",
    () => cloneDeep(mockValidMockTxCopy),
    {
      output: [{}]
    }
  ],
  [
    "decodedTx.output first odd output has not decodedScript prop",
    "Error: Invalid decodedTx parameter",
    () => cloneDeep(mockValidMockTxCopy),
    {
      output: [{}, {}]
    }
  ],
  [
    "decodedTx.output.decodedScript has no address prop",
    "Error: Invalid decodedTx parameter",
    () => cloneDeep(mockValidMockTxCopy),
    {
      output: [{}, { decodedScript: {} }]
    }
  ]
])("test failing getVSPTicketStatus (%s)", testGetVSPTicketStatusFailing);

test("test getVSPTicketStatus (getVSPTicketStatus error)", async () => {
  const mockErrorMessage = "mockErrorMessage";
  mockGetVSPTicketStatus = wallet.getVSPTicketStatus = jest.fn(() =>
    Promise.reject(mockErrorMessage)
  );
  const mockTxCopy = cloneDeep(mockTx);
  mockTxCopy.ticketTx = { vspHost: mockVspHost };
  const store = createStore({});
  const res = await store.dispatch(
    vspActions.getVSPTicketStatus(mockPassphrase, mockTxCopy, mockDecodedTx)
  );

  expect(res).toStrictEqual(undefined);
  expect(mockSignMessageAttempt).toHaveBeenCalled();
  expect(mockGetVSPTicketStatus).toHaveBeenCalled();
  // the error message is shown by snackbar
  expect(store.getState().vsp.getVSPTicketStatusError).toEqual(
    mockErrorMessage
  );
});

test("test getVSPTicketStatus (getVSPTicketStatus invalid response)", async () => {
  mockGetVSPTicketStatus = wallet.getVSPTicketStatus = jest.fn(() =>
    Promise.resolve({})
  );
  const mockTxCopy = cloneDeep(mockTx);
  mockTxCopy.ticketTx = { vspHost: mockVspHost };
  const store = createStore({});
  const res = await store.dispatch(
    vspActions.getVSPTicketStatus(mockPassphrase, mockTxCopy, mockDecodedTx)
  );

  expect(res).toStrictEqual(undefined);
  expect(mockSignMessageAttempt).toHaveBeenCalled();
  expect(mockGetVSPTicketStatus).toHaveBeenCalled();
  // the error message is shown by snackbar
  expect(store.getState().vsp.getVSPTicketStatusError).toEqual(
    "Error: Invalid response from the VSP"
  );
});

test("test getVSPTicketStatus (getVSPTicketStatus response error)", async () => {
  mockGetVSPTicketStatus = wallet.getVSPTicketStatus = jest.fn(() =>
    Promise.resolve({ data: { code: 10, message: "test-message" } })
  );
  const mockTxCopy = cloneDeep(mockTx);
  mockTxCopy.ticketTx = { vspHost: mockVspHost };
  const store = createStore({});
  const res = await store.dispatch(
    vspActions.getVSPTicketStatus(mockPassphrase, mockTxCopy, mockDecodedTx)
  );

  expect(res).toStrictEqual(undefined);
  expect(mockSignMessageAttempt).toHaveBeenCalled();
  expect(mockGetVSPTicketStatus).toHaveBeenCalled();
  // the error message is shown by snackbar
  expect(store.getState().vsp.getVSPTicketStatusError).toEqual(
    "Error: test-message (code: 10)"
  );
});

test("test getVSPTicketStatus (signMessage error)", async () => {
  mockSignMessageAttempt = controlActions.signMessageAttempt = jest.fn(
    () => () => null
  );
  const mockTxCopy = cloneDeep(mockTx);
  mockTxCopy.ticketTx = { vspHost: mockVspHost };
  const store = createStore({});
  const res = await store.dispatch(
    vspActions.getVSPTicketStatus(mockPassphrase, mockTxCopy, mockDecodedTx)
  );

  expect(res).toStrictEqual(undefined);
  expect(mockSignMessageAttempt).toHaveBeenCalled();
  expect(mockGetVSPTicketStatus).not.toHaveBeenCalled();
  expect(store.getState().vsp.getVSPTicketStatusError).toEqual(undefined);
});

test("test getVSPTicketStatus (signMessage error)", async () => {
  mockSignMessageAttempt = controlActions.signMessageAttempt = jest.fn(
    () => () => null
  );
  const mockTxCopy = cloneDeep(mockTx);
  mockTxCopy.ticketTx = { vspHost: mockVspHost };
  const store = createStore({});
  const res = await store.dispatch(
    vspActions.getVSPTicketStatus(mockPassphrase, mockTxCopy, mockDecodedTx)
  );

  expect(res).toStrictEqual(undefined);
  expect(mockSignMessageAttempt).toHaveBeenCalled();
  expect(mockGetVSPTicketStatus).not.toHaveBeenCalled();
  expect(store.getState().vsp.getVSPTicketStatusError).toEqual(undefined);
});
