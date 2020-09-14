import GetStartedPage from "components/views/GetStartedPage/GetStartedPage";
import { render } from "test-utils.js";
import { fireEvent } from "@testing-library/react";
import user from "@testing-library/user-event";

import { screen, wait } from "@testing-library/react";
import * as sel from "selectors";
import * as wla from "actions/WalletLoaderActions";
import * as da from "actions/DaemonActions";
import * as trza from "actions/TrezorActions";
import * as ctrla from "actions/ControlActions";

const testWalletName = "test-wallet-name";
const invalidCharacters = "/.;:~";
const testWalletCreateErrorMsg = "test-error-msg";
const usedTestWalletName = "usedTestWalletName";
const testWalletCreationMasterPubKey = "test-wallet-creation-master-pubkey";
const testSelectedWallet = {
  label: testWalletName,
  value: {
    isNew: true,
    isPrivacy: false,
    isTrezor: false,
    isWatchingOnly: false,
    network: "mainnet",
    wallet: testWalletName
  }
};

let mockCreateWallet;
let mockGenerateSeed;
let mockEnableTrezor;
let mockDisableTrezor;
let mockValidateMasterPubKey;
let mockAlertNoConnectedDevice;
let mockTrezorDevice;
let mockGetWalletCreationMasterPubKey;
let mockIsTestNet;

beforeEach(() => {
  sel.getDaemonSynced = jest.fn(() => true);
  sel.isSPV = jest.fn(() => false);
  wla.getSelectedWallet = jest.fn(() => () => null);
  mockIsTestNet = sel.isTestNet = jest.fn(() => false);
  mockCreateWallet = da.createWallet = jest.fn(() => () =>
    Promise.reject(testWalletCreateErrorMsg)
  );
  mockGenerateSeed = wla.generateSeed = jest.fn(() => () =>
    Promise.resolve({
      getSeedMnemonic: () => ""
    })
  );
  sel.maxWalletCount = jest.fn(() => 3);
  sel.sortedAvailableWallets = jest.fn(() => {
    return [
      {
        label: `label-${usedTestWalletName}`,
        value: {
          wallet: usedTestWalletName
        }
      }
    ];
  });
  mockEnableTrezor = trza.enableTrezor = jest.fn(() => () => {});
  mockDisableTrezor = trza.disableTrezor = jest.fn(() => () => {});
  mockGetWalletCreationMasterPubKey = trza.getWalletCreationMasterPubKey = jest.fn(
    () => () => Promise.resolve(testWalletCreationMasterPubKey)
  );
  mockAlertNoConnectedDevice = trza.alertNoConnectedDevice = jest.fn(
    () => () => {}
  );
  mockValidateMasterPubKey = ctrla.validateMasterPubKey = jest.fn(() => () => {
    return { isValid: false, error: "" };
  });
  mockTrezorDevice = sel.trezorDevice = jest.fn(() => null);
});

test("render empty wallet chooser view and click on create wallet", async () => {
  render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));

  user.click(screen.getByText(/create a new wallet/i));
  await wait(() => screen.getByText(/wallet name/i));

  expect(screen.getByTestId("getstarted-pagebody").className).not.toMatch(
    /testnetBody/
  );
  
  const walletNameInput = screen.getByPlaceholderText(/choose a name/i);
  // enter reserved wallet name
  user.type(walletNameInput, usedTestWalletName);
  expect(
    screen.getByText(/please choose an unused wallet name/i)
  ).toBeInTheDocument();

  // invalid characters have to removed from walletNameInput's value
  user.clear(walletNameInput);
  user.type(walletNameInput, testWalletName + invalidCharacters);
  expect(walletNameInput).toHaveValue(testWalletName);

  user.click(screen.getByText(/cancel/i));
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));
});

test("test when createWallet has been rejected", async () => {
  render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));

  user.click(screen.getByText(/create a new wallet/i));
  await wait(() => screen.getByText(/wallet name/i));

  const walletNameInput = screen.getByPlaceholderText(/choose a name/i);
  user.type(walletNameInput, testWalletName);

  user.click(screen.getByText(/continue/i));
  expect(mockCreateWallet).toHaveBeenCalledWith(testSelectedWallet);
  await wait(() => screen.getByText(testWalletCreateErrorMsg));
});

// todo: move this function to a separate test file: CreateWalletPage/copySeed
test("daemon response success through createWallet fc and createWalletPage has been reached", async () => {
  mockCreateWallet = da.createWallet = jest.fn(() => () =>
    Promise.resolve(testSelectedWallet)
  );
  render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));

  user.click(screen.getByText(/create a new wallet/i));
  await wait(() => screen.getByText(/wallet name/i));

  const walletNameInput = screen.getByPlaceholderText(/choose a name/i);
  user.type(walletNameInput, testWalletName);

  user.click(screen.getByText(/continue/i));
  expect(mockCreateWallet).toHaveBeenCalledWith(testSelectedWallet);
  await wait(() => screen.getByText(/copy seed words to clipboard/i));
});

test("render empty wallet chooser view and click on restore wallet", async () => {
  const testRestoreSelectedWallet = {
    ...testSelectedWallet,
    value: { ...testSelectedWallet.value, isNew: false }
  };

  const { debug } = render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));

  expect(mockTrezorDevice).toHaveBeenCalled();
  user.click(screen.getByText(/restore existing wallet/i));
  await wait(() => screen.getByText(/wallet name/i));
  expect(screen.getByTestId("getstarted-pagebody").className).not.toMatch(
    /testnetBody/
  );
  const continueButton = screen.getByText(/continue/i);

  const walletNameInput = screen.getByPlaceholderText(/choose a name/i);
  // walletNameInput is requiered
  user.click(continueButton);
  expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
  // enter reserved wallet name
  user.type(walletNameInput, usedTestWalletName);
  expect(
    screen.getByText(/please choose an unused wallet name/i)
  ).toBeInTheDocument();

  // invalid characters have to removed from walletNameInput's value
  user.clear(walletNameInput);
  user.type(walletNameInput, testWalletName + invalidCharacters);
  expect(walletNameInput).toHaveValue(testWalletName);

  user.click(continueButton);
  expect(mockCreateWallet).toHaveBeenCalledWith(testRestoreSelectedWallet);

  // toggle Watch only switch
  const watchOnlySwitch = screen.getByText(/watch only/i).nextSibling.firstChild
    .firstChild.firstChild.firstChild;
  user.click(watchOnlySwitch);
  expect(watchOnlySwitch.className).toMatch(/enabled/i);
  const masterPubKeyInput = screen.getByPlaceholderText(/master pub key/i);
  expect(masterPubKeyInput).toBeInTheDocument();
  // master pub key is requiered
  user.click(continueButton);
  expect(screen.getByText(/this field is required/i)).toBeInTheDocument();
  // test invalid master pub key
  const testInvalidMasterPubKey = "test-invalid-master-pub-key";
  fireEvent.change(masterPubKeyInput, {
    target: { value: testInvalidMasterPubKey }
  });
  await wait(() =>
    expect(mockValidateMasterPubKey).toHaveBeenCalledWith(
      testInvalidMasterPubKey
    )
  );
  expect(screen.getByText(/invalid master pubkey/i)).toBeInTheDocument();
  // test valid master pub key
  const testValidMasterPubKey = "test-valid-master-pub-key";
  mockValidateMasterPubKey = ctrla.validateMasterPubKey = jest.fn(() => () => {
    return { isValid: true, error: null };
  });
  fireEvent.change(masterPubKeyInput, {
    target: { value: testValidMasterPubKey }
  });
  await wait(() =>
    expect(mockValidateMasterPubKey).toHaveBeenCalledWith(testValidMasterPubKey)
  );
  expect(screen.queryByText(/invalid master pubkey/i)).not.toBeInTheDocument();
  // test empty input 
  fireEvent.change(masterPubKeyInput, {
    target: { value: "" }
  });
  await wait(() =>
    expect(screen.getByText(/this field is required/i)).toBeInTheDocument()
  );
  
  user.click(continueButton);
  expect(mockCreateWallet).toHaveBeenCalledWith(testRestoreSelectedWallet);

  // toggle Trezor switch
  const trezorSwitch = screen.getByText(/trezor/i).nextSibling.firstChild
    .firstChild.firstChild.firstChild;
  user.click(trezorSwitch);
  expect(mockEnableTrezor).toHaveBeenCalled();
  expect(trezorSwitch.className).toMatch(/enabled/i);
  // it has to disable Watch only switch and hide master pub key option
  expect(screen.queryByText(/master pub key/i)).not.toBeInTheDocument();
  expect(watchOnlySwitch.className).toMatch(/disabled/i);

  mockCreateWallet.mockClear();
  user.click(continueButton);
  expect(mockAlertNoConnectedDevice).toHaveBeenCalled();
  expect(mockCreateWallet).not.toHaveBeenCalled();

  // switch off Trezor switch
  user.click(trezorSwitch);
  expect(mockDisableTrezor).toHaveBeenCalled();
  expect(trezorSwitch.className).toMatch(/disable/i);

  user.click(screen.getByText(/cancel/i));
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));
});

test("trezor device is connected", async () => {
  mockTrezorDevice = sel.trezorDevice = jest.fn(() => {
    return { connected: true };
  });
  const testRestoreSelectedWallet = {
    ...testSelectedWallet,
    value: { ...testSelectedWallet.value, isNew: false, isTrezor: true },
    watchingOnly: true
  };
  mockCreateWallet = da.createWallet = jest.fn(() => () =>
    Promise.resolve(testRestoreSelectedWallet)
  );

  render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));

  user.click(screen.getByText(/restore existing wallet/i));
  await wait(() => screen.getByText(/wallet name/i));
  expect(mockTrezorDevice).toHaveBeenCalled();

  const continueButton = screen.getByText(/continue/i);
  const walletNameInput = screen.getByPlaceholderText(/choose a name/i);
  user.type(walletNameInput, testWalletName);

  // toggle Trezor switch
  const trezorSwitch = screen.getByText(/trezor/i).nextSibling.firstChild
    .firstChild.firstChild.firstChild;
  user.click(trezorSwitch);
  expect(mockEnableTrezor).toHaveBeenCalled();

  user.click(continueButton);
  expect(mockGetWalletCreationMasterPubKey).toHaveBeenCalled();
  await wait(() => expect(mockCreateWallet).toHaveBeenCalledWith(testRestoreSelectedWallet));
  expect(mockAlertNoConnectedDevice).not.toHaveBeenCalled();
  expect(screen.getByTestId("decred-loading").style.display).toMatch(/block/i);
});

test("trezor has to auto disable when step back from restore view", async () => {
  mockTrezorDevice = sel.trezorDevice = jest.fn(() => {
    return { connected: true };
  });
  render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));

  user.click(screen.getByText(/restore existing wallet/i));
  await wait(() => screen.getByText(/wallet name/i));

  // toggle Trezor switch
  const trezorSwitch = screen.getByText(/trezor/i).nextSibling.firstChild
    .firstChild.firstChild.firstChild;
  user.click(trezorSwitch);
  expect(mockEnableTrezor).toHaveBeenCalled();

  user.click(screen.getByText(/cancel/i));
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));
  expect(mockDisableTrezor).toHaveBeenCalled();
});

test("test privacy switch on restore wallet view", async () => {
  const testRestoreSelectedWallet = {
    ...testSelectedWallet,
    value: { ...testSelectedWallet.value, isNew: false, isPrivacy: true }
  };

  mockCreateWallet = da.createWallet = jest.fn(() => () =>
    Promise.resolve(testRestoreSelectedWallet)
  );

  render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));

  user.click(screen.getByText(/restore existing wallet/i));
  await wait(() => screen.getByText(/wallet name/i));
  expect(mockTrezorDevice).toHaveBeenCalled();

  const continueButton = screen.getByText(/continue/i);
  user.type(screen.getByPlaceholderText(/choose a name/i), testWalletName);
  
  // toggle Privacy switch
  const privacySwitch = screen.getByText(/privacy/i).nextSibling.firstChild
    .firstChild.firstChild.firstChild;
  // toggle switch on
  user.click(privacySwitch);
  expect(privacySwitch.className).toMatch(/enabled/i);

  // toggle switch off
  user.click(privacySwitch);
  expect(privacySwitch.className).toMatch(/disabled/i);

  // toggle switch on again
  user.click(privacySwitch);
  expect(privacySwitch.className).toMatch(/enabled/i);

  mockCreateWallet.mockClear();
  user.click(continueButton);
  expect(mockCreateWallet).toHaveBeenCalledWith(testRestoreSelectedWallet);

  await wait(() => expect(mockCreateWallet).toHaveBeenCalledWith(testRestoreSelectedWallet));
  expect(screen.getByText(/confirm seed key/i)).toBeInTheDocument();
});

test("test testnet logo on create new wallet view", async () => {
  const testRestoreSelectedWallet = {
    ...testSelectedWallet,
    value: { ...testSelectedWallet.value, network: "testnet" }
  };
  mockIsTestNet = sel.isTestNet = jest.fn(() => true);
  render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));
  expect(mockIsTestNet).toHaveBeenCalled();

  user.click(screen.getByText(/create a new wallet/i));
  await wait(() => screen.getByText(/wallet name/i));
  expect(screen.getByTestId("getstarted-pagebody").className).toMatch(
    /testnetBody/
  );

  user.type(screen.getByPlaceholderText(/choose a name/i), testWalletName);
  user.click(screen.getByText(/continue/i));
  await wait(() => expect(mockCreateWallet).toHaveBeenCalledWith(testRestoreSelectedWallet));
});

test("test testnet logo on restore wallet view", async () => {
  const testRestoreSelectedWallet = {
    ...testSelectedWallet,
    value: { ...testSelectedWallet.value, isNew: false, network: "testnet" }
  };
  mockIsTestNet = sel.isTestNet = jest.fn(() => true);
  render(<GetStartedPage />);
  await wait(() => screen.getByText(/welcome to decrediton wallet/i));
  expect(mockIsTestNet).toHaveBeenCalled();

  user.click(screen.getByText(/restore existing wallet/i));
  await wait(() => screen.getByText(/wallet name/i));
  expect(screen.getByTestId("getstarted-pagebody").className).toMatch(
    /testnetBody/
  );

  user.type(screen.getByPlaceholderText(/choose a name/i), testWalletName);
  user.click(screen.getByText(/continue/i));
  await wait(() => expect(mockCreateWallet).toHaveBeenCalledWith(testRestoreSelectedWallet));
});

