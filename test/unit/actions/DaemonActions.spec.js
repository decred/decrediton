import * as da from "actions/DaemonActions";
import { createStore } from "test-utils.js";
import * as wal from "wallet";
import { preDefinedGradients } from "helpers";

const daemonActions = da;
const wallet = wal;

let mockAvailableWallets = [
  {
    wallet: "wallet1",
    displayWalletGradient: preDefinedGradients[0],
    lastAccess: 10
  },
  {
    wallet: "wallet2",
    displayWalletGradient: preDefinedGradients[1],
    lastAccess: 9
  },
  {
    wallet: "missing-gradient-wallet",
    lastAccess: 8
  },
  {
    wallet: "wallet4",
    displayWalletGradient: preDefinedGradients[3],
    lastAccess: 11
  },
  {
    wallet: "missing-gradient-wallet222222222222",
    lastAccess: 12
  },
  {
    wallet: "wallet5",
    displayWalletGradient: preDefinedGradients[5]
  },
  {
    wallet: "wallet6",
    displayWalletGradient: preDefinedGradients[6]
  },
  {
    wallet: "wallet7",
    displayWalletGradient: preDefinedGradients[7]
  },
  {
    wallet: "wallet8",
    displayWalletGradient: preDefinedGradients[8]
  },
  {
    wallet: "wallet9",
    displayWalletGradient: preDefinedGradients[9]
  },
  {
    wallet: "wallet10",
    displayWalletGradient: preDefinedGradients[10]
  },
  {
    wallet: "needto-generate-random-gradient-wallet"
  }
];

const mockConfigSet = jest.fn(() => {});
let mockGetAvailableWallets;

beforeEach(() => {
  wallet.getWalletCfg = jest.fn(() => ({
    set: mockConfigSet
  }));
  mockGetAvailableWallets = wallet.getAvailableWallets = jest.fn(() => ({
    availableWallets: mockAvailableWallets
  }));
});

test("test checkDisplayWalletGradients", () => {
  const store = createStore({
    settings: { currentSettings: { network: "testnet" } }
  });

  store.dispatch(
    daemonActions.checkDisplayWalletGradients(mockAvailableWallets)
  );

  expect(mockConfigSet).toHaveBeenNthCalledWith(
    1,
    "display_wallet_gradient",
    preDefinedGradients[2]
  );
  expect(mockConfigSet).toHaveBeenNthCalledWith(
    2,
    "display_wallet_gradient",
    preDefinedGradients[4]
  );
  expect(mockConfigSet).toHaveBeenCalledTimes(3);

  expect(mockGetAvailableWallets).toHaveBeenCalledTimes(1);
});

test("checkDisplayWalletGradients (no missing gradient)", () => {
  mockAvailableWallets = [
    {
      wallet: "wallet1",
      displayWalletGradient: preDefinedGradients[0],
      lastAccess: 10
    },
    {
      wallet: "wallet2",
      displayWalletGradient: preDefinedGradients[1],
      lastAccess: 9
    },
    {
      wallet: "wallet4",
      displayWalletGradient: preDefinedGradients[3],
      lastAccess: 11
    }
  ];
  mockGetAvailableWallets = wallet.getAvailableWallets = jest.fn(() => ({
    availableWallets: mockAvailableWallets
  }));

  const store = createStore({
    settings: { currentSettings: { network: "testnet" } }
  });

  store.dispatch(
    daemonActions.checkDisplayWalletGradients(mockAvailableWallets)
  );

  expect(mockConfigSet).not.toHaveBeenCalled();
  expect(mockGetAvailableWallets).not.toHaveBeenCalled();
});
