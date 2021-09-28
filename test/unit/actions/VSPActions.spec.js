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

const defaultMockAvailableVsps = [
  {
    host: "https://test-stakepool1.eu",
    label: "https://test-stakepool1.eu",
    vspData: {
      feepercentage: 2
    }
  },
  {
    host: "https://test-stakepool2.eu",
    label: "https://test-stakepool2.eu",
    vspData: {
      feepercentage: 3
    }
  },
  {
    host: "https://test-stakepool3.eu",
    label: "https://test-stakepool3.eu",
    vspData: {
      feepercentage: 4
    }
  }
];
let mockAvailableVsps = cloneDeep(defaultMockAvailableVsps);

beforeEach(() => {
  selectors.getAvailableVSPs = jest.fn(() => mockAvailableVsps);
  arrays.shuffle = jest.fn((arr) => arr);
  wallet.getVSPInfo = jest.fn(() => {});
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

  mockAvailableVsps = cloneDeep(defaultMockAvailableVsps);
  expect(vspResponse).toEqual(expectedVspResponse);
  expect(errorResponse).toEqual(expectedErrorResponse);
};

test.only("test getRandomVSP", async () => {
  // no availableVSPs
  mockAvailableVsps = [];
  wallet.getVSPInfo = jest.fn(() => Promise.resolve(mockVspInfo));
  await testRandomVSP(5, undefined, "The available VSPs list is empty.");

  // high maxFee
  wallet.getVSPInfo = jest.fn(() => Promise.resolve(mockVspInfo));
  await testRandomVSP(
    5,
    {
      ...mockAvailableVsps[2],
      host: mockAvailableVsps[2].host,
      pubkey: mockVspInfo.data.pubkey
    },
    undefined
  );

  // "constraint maxFee",
  await testRandomVSP(
    3,
    {
      ...mockAvailableVsps[1],
      host: mockAvailableVsps[1].host,
      pubkey: mockVspInfo.data.pubkey
    },
    undefined
  );

  // "lowest valid maxFee",
  await testRandomVSP(
    2,
    {
      ...mockAvailableVsps[0],
      host: mockAvailableVsps[0].host,
      pubkey: mockVspInfo.data.pubkey
    },
    undefined
  );

  // "too low maxFee, expect to receive error",
  await testRandomVSP(1, undefined, "Max fee is too low.");

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
      ...mockAvailableVsps[0],
      host: mockAvailableVsps[0].host,
      pubkey: mockVspInfo.data.pubkey
    },
    undefined
  );
});
