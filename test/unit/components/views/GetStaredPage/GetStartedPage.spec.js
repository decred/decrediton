import GetStartedPage from "components/views/GetStartedPage/GetStartedPage";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";

import { screen, wait } from "@testing-library/react";
import * as sel from "selectors";
import * as wla from "actions/WalletLoaderActions";
import * as da from "actions/DaemonActions";

//todo: remove debugs

test("render empty wallet chooser view and click around", async () => {
  const mockGetDaemonSynced = (sel.getDaemonSynced = jest.fn(() => true));
  const mockMaxWalletCount = (sel.maxWalletCount = jest.fn(() => 3));
  const mockIsSPV = (sel.isSPV = jest.fn(() => false));
  const mockGetSelectedWallet = (wla.getSelectedWallet = jest.fn(() => () =>
    null
  ));
  const mockGetAvailableWallets = (da.getAvailableWallets = jest.fn(() => () =>
    Promise.resolve({ availableWallets: [], previousWallet: null })
  ));

  const { debug } = render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));

  expect(screen.getByText(/logs/i)).toBeInTheDocument();
  expect(screen.getByText(/settings/i)).toBeInTheDocument();

  expect(screen.getByText(/about decrediton/i)).toBeInTheDocument();
  expect(screen.getByText(/learn the basics/i)).toBeInTheDocument();
  
  // check if releasNotes reachable
  user.click(screen.getByText(/what's new in/i));
  await wait(() => screen.getByText(/newer version/i));
  // todo test realase page
  user.click(screen.getByText(/go back/i).previousSibling);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));

  expect(screen.getByText(/choose a wallet to open/i)).toBeInTheDocument();
  expect(screen.getByText(/create a new wallet/i)).toBeInTheDocument();
  expect(screen.getByText(/restore existing wallet/i)).toBeInTheDocument();
  expect(screen.getByText(/edit wallets/i)).toBeInTheDocument();
  debug();

  expect(mockGetDaemonSynced).toHaveBeenCalled();
  expect(mockIsSPV).toHaveBeenCalled();
  expect(mockGetSelectedWallet).toHaveBeenCalled();
  expect(mockGetAvailableWallets).toHaveBeenCalled();
  expect(mockMaxWalletCount).toHaveBeenCalled();
  mockGetDaemonSynced.mockRestore();
  mockIsSPV.mockRestore();
  mockGetSelectedWallet.mockRestore();
  mockGetAvailableWallets.mockRestore();
  mockMaxWalletCount.mockRestore();
});

test("render empty wallet chooser view in SPV mode", async () => {
  const mockGetDaemonSynced = (sel.getDaemonSynced = jest.fn(() => true));
  const mockMaxWalletCount = (sel.maxWalletCount = jest.fn(() => 3));
  const mockIsSPV = (sel.isSPV = jest.fn(() => true));
  const mockGetSelectedWallet = (wla.getSelectedWallet = jest.fn(() => () =>
    null
  ));
  const mockGetAvailableWallets = (da.getAvailableWallets = jest.fn(() => () =>
    Promise.resolve({ availableWallets: [], previousWallet: null })
  ));

  const { debug } = render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));

  expect(
    screen.getByText(/choose a wallet to open in spv mode/i)
  ).toBeInTheDocument();
  debug();

  expect(mockGetDaemonSynced).toHaveBeenCalled();
  expect(mockIsSPV).toHaveBeenCalled();
  expect(mockGetSelectedWallet).toHaveBeenCalled();
  expect(mockGetAvailableWallets).toHaveBeenCalled();
  expect(mockMaxWalletCount).toHaveBeenCalled();
  mockGetDaemonSynced.mockRestore();
  mockIsSPV.mockRestore();
  mockGetSelectedWallet.mockRestore();
  mockGetAvailableWallets.mockRestore();
  mockMaxWalletCount.mockRestore();
});

test("render empty wallet chooser view in testnet mode", async () => {
  const mockIsTestNet = (sel.isTestNet = jest.fn(() => true));

  const { debug } = render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));
  // todo: check testnet logo
  debug();

  expect(mockIsTestNet).toHaveBeenCalled();
  mockIsTestNet.mockRestore();
});
