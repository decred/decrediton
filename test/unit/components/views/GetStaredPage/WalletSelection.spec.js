import GetStartedPage from "components/views/GetStartedPage/GetStartedPage";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";

import { screen, wait } from "@testing-library/react";
import * as sel from "selectors";
import * as da from "actions/DaemonActions";
import * as wla from "actions/WalletLoaderActions";

let mockSortedAvailableWallets;
let mockMaxWalletCount;
let mockRemoveWallet;
let mockStartWallet;
let mockSetSelectedWallet;

const testLastAccessNow = new Date();
const testLastAccessOneHourAgo = new Date();
testLastAccessOneHourAgo.setHours(testLastAccessNow.getHours() - 1);

const testLastAccessYesterday = new Date();
testLastAccessYesterday.setHours(testLastAccessNow.getHours() - 30);

const testAvailableWallets = [
  {
    label: "test-regular-wallet",
    value: {
      wallet: "test-regular-wallet-name"
    },
    finished: true,
    lastAccess: testLastAccessOneHourAgo
  },
  {
    label: "test-unfinished-wallet",
    value: {
      wallet: "test-unfinished-wallet-name"
    },
    finished: false,
    lastAccess: testLastAccessYesterday
  },
  {
    label: "test-trezor-wallet",
    value: {
      wallet: "test-trezor-wallet-name",
      isTrezor: true
    },
    finished: true,
    lastAccess: testLastAccessNow
  },
  {
    label: "test-privacy-wallet",
    value: {
      wallet: "test-privacy-wallet-name",
      isPrivacy: true
    },
    finished: true,
    lastAccess: testLastAccessNow
  },
  {
    label: "test-watch-only-wallet",
    value: {
      wallet: "test-watch-only-wallet-name"
    },
    finished: true,
    isWatchingOnly: true,
    lastAccess: testLastAccessNow
  }
];

beforeEach(() => {
  sel.getDaemonSynced = jest.fn(() => true);
  mockRemoveWallet = da.removeWallet = jest.fn(() => () => {});
  mockSetSelectedWallet = wla.setSelectedWallet = jest.fn(() => () => {});
  mockStartWallet = da.startWallet = jest.fn(() => () => Promise.resolve());
  mockMaxWalletCount = sel.maxWalletCount = jest.fn(() => 6);
  mockSortedAvailableWallets = sel.sortedAvailableWallets = jest.fn(
    () => testAvailableWallets
  );
});

test("render wallet chooser view", async () => {
  render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));

  expect(mockSortedAvailableWallets).toHaveBeenCalled();
  expect(mockMaxWalletCount).toHaveBeenCalled();
  
  // check regular wallet
  const regularWallet = screen.getByText(testAvailableWallets[0].value.wallet);
  expect(regularWallet).toBeInTheDocument();
  expect(regularWallet.nextSibling.textContent).toMatch(
    /last accessed: 1 hour ago/i
  );
  expect(regularWallet.nextSibling.nextSibling.textContent).toMatch(
    /launch wallet/i
  );

  // check unfinished wallet
  const unfinishedWallet = screen.getByText(
    testAvailableWallets[1].value.wallet
  );
  expect(unfinishedWallet).toBeInTheDocument();
  expect(unfinishedWallet.nextSibling.textContent).toMatch(
    /last accessed: yesterday/i
  );
  expect(unfinishedWallet.previousSibling.previousSibling.textContent).toMatch(
    /setup incomplete/i
  );

  // check trezor wallet
  const trezorWallet = screen.getByText(testAvailableWallets[2].value.wallet);
  expect(trezorWallet).toBeInTheDocument();
  expect(trezorWallet.nextSibling.textContent).toMatch(/last accessed: now/i);
  expect(trezorWallet.previousSibling.previousSibling.textContent).toMatch(
    /trezor/i
  );

  // check privacy wallet
  const privacyWallet = screen.getByText(testAvailableWallets[3].value.wallet);
  expect(privacyWallet).toBeInTheDocument();
  expect(privacyWallet.nextSibling.textContent).toMatch(/Last accessed: now/i);
  expect(privacyWallet.previousSibling.previousSibling.textContent).toMatch(
    /privacy/i
  );

  // check watching only wallet
  const watchOnlyWallet = screen.getByText(
    testAvailableWallets[4].value.wallet
  );
  expect(watchOnlyWallet).toBeInTheDocument();
  expect(watchOnlyWallet.nextSibling.textContent).toMatch(
    /last accessed: now/i
  );
  expect(watchOnlyWallet.previousSibling.previousSibling.textContent).toMatch(
    /watch only/i
  );

  expect(screen.getByText("Create a New Wallet")).toBeInTheDocument();
  expect(screen.getByText("Restore Existing Wallet")).toBeInTheDocument();
});

test("test editing wallets", async () => {
  render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));

  user.click(screen.getByText(/edit wallets/i).previousSibling);
  expect(screen.getByText("Close")).toBeInTheDocument();
  expect(screen.getAllByText(/remove wallet/i).length).toBe(
    testAvailableWallets.length
  );

  // test the cancel flow
  user.click(screen.getAllByText(/remove wallet/i)[0].previousSibling);
  expect(
    screen.getByText(/warning this action/i).textContent
  ).toMatchInlineSnapshot(
    `"Warning this action is permanent! Please make sure you have backed up your wallet's seed before proceeding."`
  );
  user.click(screen.getByText(/cancel/i));
  expect(screen.queryByText(/warning this action/i)).not.toBeInTheDocument();

  // test the confirm flow
  user.click(screen.getAllByText(/remove wallet/i)[0].previousSibling);
  user.click(screen.getByText(/confirm/i));
  expect(mockRemoveWallet).toHaveBeenCalledWith(testAvailableWallets[0]);

  expect(screen.queryByText(/warning this action/i)).not.toBeInTheDocument();
  user.click(screen.getByText("Close").previousSibling);
  expect(screen.queryByText("Close")).not.toBeInTheDocument();
  expect(screen.getByText(/edit wallets/i)).toBeInTheDocument();
});

test("launch a wallet", async () => {
  render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));

  const wallet = screen.getByText(testAvailableWallets[1].value.wallet);
  user.click(wallet);
  expect(wallet.nextSibling.nextSibling.textContent).toMatch(/launch wallet/i);
  user.click(screen.getByText(/launch wallet/i));
  await wait(() =>
    expect(mockStartWallet).toHaveBeenCalledWith(testAvailableWallets[1])
  );
  expect(mockSetSelectedWallet).toHaveBeenCalled();
});
