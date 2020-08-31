import GetStartedPage from "components/views/GetStartedPage/GetStartedPage";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";

import { screen, wait } from "@testing-library/react";
import * as sel from "selectors";
import * as wla from "actions/WalletLoaderActions";
import * as da from "actions/DaemonActions";

const testAppVersion = "0.test-version.0";

let mockGetDaemonSynced;
let mockMaxWalletCount;
let mockIsSPV;
let mockAppVersion;
let mockGetSelectedWallet;
let mockGetAvailableWallets;
let mockIsTestNet;

beforeEach(() => {
  mockGetDaemonSynced = sel.getDaemonSynced = jest.fn(() => true);
  mockMaxWalletCount = sel.maxWalletCount = jest.fn(() => 3);
  mockIsSPV = sel.isSPV = jest.fn(() => false);
  mockAppVersion = sel.appVersion = jest.fn(() => testAppVersion);
  mockGetSelectedWallet = wla.getSelectedWallet = jest.fn(() => () => null);
  mockGetAvailableWallets = da.getAvailableWallets = jest.fn(() => () =>
    Promise.resolve({ availableWallets: [], previousWallet: null })
  );
  mockIsTestNet = sel.isTestNet = jest.fn(() => false);
});

afterEach(() => {
  mockGetDaemonSynced.mockRestore();
  mockMaxWalletCount.mockRestore();
  mockIsSPV.mockRestore();
  mockAppVersion.mockRestore();
  mockGetSelectedWallet.mockRestore();
  mockGetAvailableWallets.mockRestore();
});

//todo: remove debugs

test("render empty wallet chooser view", async () => {
  render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));

  expect(screen.getByText(/logs/i)).toBeInTheDocument();
  expect(screen.getByText(/settings/i)).toBeInTheDocument();
  expect(
    screen.getByText(`What's New in v${testAppVersion}`)
  ).toBeInTheDocument();
  expect(screen.getByText(/create a new wallet/i)).toBeInTheDocument();
  expect(screen.getByText(/restore existing wallet/i)).toBeInTheDocument();
  expect(screen.getByText(/about decrediton/i)).toBeInTheDocument();
  expect(screen.getByText(/choose a wallet to open/i)).toBeInTheDocument();
  expect(screen.getByText(/learn the basics/i)).toBeInTheDocument();
  expect(screen.getByText(/edit wallets/i)).toBeInTheDocument();
  expect(screen.getByTestId("getstarted-pagebody").className).not.toMatch(
    /testnetBody/
  );

  expect(mockGetDaemonSynced).toHaveBeenCalled();
  expect(mockIsSPV).toHaveBeenCalled();
  expect(mockAppVersion).toHaveBeenCalled();
  expect(mockGetSelectedWallet).toHaveBeenCalled();
  expect(mockGetAvailableWallets).toHaveBeenCalled();
  expect(mockMaxWalletCount).toHaveBeenCalled();
  expect(mockIsTestNet).toHaveBeenCalled();
});

test("render empty wallet chooser view in SPV mode", async () => {
  mockIsSPV = sel.isSPV = jest.fn(() => true);

  const { debug } = render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));

  expect(
    screen.getByText(/choose a wallet to open in spv mode/i)
  ).toBeInTheDocument();
  debug();
});

test("render empty wallet chooser view in testnet mode", async () => {
  mockIsTestNet = sel.isTestNet = jest.fn(() => true);

  render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));
  expect(screen.getByTestId("getstarted-pagebody").className).toMatch(
    /testnetBody/
  );
  expect(mockIsTestNet).toHaveBeenCalled();
});

test("render empty wallet chooser view and click-on&test release notes", async () => {
  const readRenderedVersionNumber = (headerText) => {
    return /Decrediton v(.*) Released/i.exec(headerText)[1].replace(/\D/g, "");
  };

  const oldestVersionNumber = 130;
  render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));

  user.click(screen.getByText(/what's new in/i));
  await wait(() => screen.getByText(/newer version/i));
  const header = screen.getByText(/Decrediton (.*) Released/i);
  expect(header).toBeInTheDocument();
  const newestVersionNumber = readRenderedVersionNumber(header.textContent);

  // click on `newer version` button in vain
  user.click(screen.getByText(/newer version/i));
  expect(+readRenderedVersionNumber(header.textContent)).toBe(
    +newestVersionNumber
  );

  // click on `older version` button until the oldest version reached
  const olderVersionButton = screen.getByText(/older version/i);
  user.click(olderVersionButton);
  let olderVersionNumber = readRenderedVersionNumber(header.textContent);
  expect(+olderVersionNumber).toBeLessThan(+newestVersionNumber);
  do {
    user.click(olderVersionButton);
    olderVersionNumber = readRenderedVersionNumber(header.textContent);
    console.log("older",olderVersionNumber);
    expect(+olderVersionNumber).toBeLessThan(+newestVersionNumber);
  } while (+olderVersionNumber > +oldestVersionNumber);

  // click on `older version` button in vain
  user.click(olderVersionButton);
  expect(+readRenderedVersionNumber(header.textContent)).toBe(
    +oldestVersionNumber
  );

  // go back to the newer versions view
  user.click(screen.getByText(/newer version/i));
  expect(+readRenderedVersionNumber(header.textContent)).toBeGreaterThan(
    +oldestVersionNumber
  );

  // go back to the wallet chooser view
  user.click(screen.getByText(/go back/i).previousSibling);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));
});

test("render empty wallet chooser view and click on create wallet", async () => {
  const { debug } = render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));

  user.click(screen.getByText(/create a new wallet/i));
  await wait(() => screen.getByText(/wallet name/i));
  debug();
  // todo test create wallet
  user.click(screen.getByText(/cancel/i));
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));
});

test("render empty wallet chooser view and click on restore wallet", async () => {
  const { debug } = render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));

  user.click(screen.getByText(/restore existing wallet/i));
  await wait(() => screen.getByText(/wallet name/i));
  debug();
  // todo test create wallet
  user.click(screen.getByText(/cancel/i));
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));
});
