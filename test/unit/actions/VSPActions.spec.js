import * as sel from "selectors";
import * as wal from "wallet";
import * as vspa from "actions/VSPActions";
import { createStore } from "test-utils.js";
import * as arrs from "../../../app/helpers/arrays";
import { cloneDeep } from "fp";

const selectors = sel;
const vspActions = vspa;
const wallet = wal;
const arrays = arrs;

const mockVspInfo = {
  data: {
    pubkey: "test-pubkey"
  }
};

const defaultMockAvailableMainnetVsps = [
  {
    host: "test-stakepool1.eu",
    label: "test-stakepool1.eu",
    outdated: false,
    vspData: {
      feepercentage: 2,
      network: "mainnet",
      vspdversion: "1.1.0"
    }
  },
  {
    host: "test-stakepool2.eu",
    label: "test-stakepool2.eu",
    outdated: false,
    vspData: {
      feepercentage: 3,
      network: "mainnet",
      vspdversion: "1.1.0"
    }
  },
  {
    host: "test-stakepool3.eu",
    label: "test-stakepool3.eu",
    outdated: false,
    vspData: {
      feepercentage: 4,
      network: "mainnet",
      vspdversion: "1.1.0"
    }
  },
  {
    host: "test-stakepool4.eu",
    label: "test-stakepool4.eu",
    outdated: false,
    vspData: {
      network: "mainnet",
      vspdversion: "1.1.0"
    }
  },
  {
    host: "test-stakepool5.eu",
    label: "test-stakepool5.eu",
    outdated: false,
    vspData: {
      network: "mainnet",
      vspdversion: "1.1.0"
    }
  },
  {
    host: "test-stakepool6.eu",
    label: "test-stakepool6.eu",
    outdated: true,
    vspData: {
      feepercentage: 1, // this vsp is outdated, so it's not going to be
      // chosen in randomVSP despite the low fee percentage
      network: "mainnet",
      vspdversion: "1.0.0"
    }
  }
];
const defaultMockAvailableTestnetVsps = [
  {
    host: "test-stakepool6.eu",
    label: "test-stakepool6.eu",
    outdated: false,
    vspData: {
      feepercentage: 4,
      network: "testnet",
      vspdversion: "1.1.0"
    }
  },
  {
    host: "test-stakepool7.eu",
    label: "test-stakepool7.eu",
    outdated: false,
    vspData: {
      feepercentage: 5,
      network: "testnet",
      vspdversion: "1.1.0"
    }
  }
];
const defaultMockAvailableInvalidVsps = [
  {
    host: "test-stakepool8.eu",
    label: "test-stakepool8.eu"
  }
];
let mockAvailableMainnetVsps = cloneDeep(defaultMockAvailableMainnetVsps);

beforeEach(() => {
  selectors.getVSPInfoTimeoutTime = jest.fn(() => 100);
  selectors.isTestNet = jest.fn(() => false);
  selectors.getAvailableVSPs = jest.fn(() => mockAvailableMainnetVsps);
  arrays.shuffle = jest.fn((arr) => arr);
  wallet.getVSPInfo = jest.fn(() => {});
  wallet.getAllVSPs = jest.fn(() => [
    ...mockAvailableMainnetVsps,
    ...cloneDeep(defaultMockAvailableTestnetVsps),
    ...cloneDeep(defaultMockAvailableInvalidVsps)
  ]);
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
