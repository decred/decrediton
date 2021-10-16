import GetStartedPage from "components/views/GetStartedPage/GetStartedPage";
import { render } from "test-utils.js";
import { fireEvent } from "@testing-library/react";
import user from "@testing-library/user-event";
import { screen, wait } from "@testing-library/react";
import * as sel from "selectors";
import * as wla from "actions/WalletLoaderActions";
import * as da from "actions/DaemonActions";
import * as trza from "actions/TrezorActions";
import * as ca from "actions/ControlActions";

const testWalletName = "test-wallet-name";
const invalidCharacters = "/\\.:;#[]$%~";
const testWalletCreateErrorMsg = "test-error-msg";
const usedTestWalletName = "usedTestWalletName";
const testWalletCreationMasterPubKey = "test-wallet-creation-master-pubkey";
const testSelectedWallet = {
  label: testWalletName,
  value: {
    isNew: true,
    isTrezor: false,
    isWatchingOnly: false,
    network: "mainnet",
    wallet: testWalletName,
    gapLimit: null,
    disableCoinTypeUpgrades: false
  }
};
const selectors = sel;
const wlActions = wla;
const daemonActions = da;
const trezorActions = trza;
const controlActions = ca;

let mockCreateWallet;
let mockGenerateSeed;
let mockEnableTrezor;
let mockDisableTrezor;
let mockValidateMasterPubKey;
let mockAlertNoConnectedDevice;
let mockTrezorDevice;
let mockGetWalletCreationMasterPubKey;
let mockIsTestNet;
let mockTrezorConnect;
let mockCreateWatchOnlyWalletRequest;

beforeEach(() => {
  selectors.getDaemonSynced = jest.fn(() => true);
  selectors.isSPV = jest.fn(() => false);
  wlActions.getSelectedWallet = jest.fn(() => () => null);
  mockIsTestNet = selectors.isTestNet = jest.fn(() => false);
  mockCreateWallet = daemonActions.createWallet = jest.fn(() => () =>
    Promise.reject(testWalletCreateErrorMsg)
  );
  mockGenerateSeed = wlActions.generateSeed = jest.fn(() => () =>
    Promise.resolve({
      seedMnemonic: ""
    })
  );
  selectors.maxWalletCount = jest.fn(() => 3);
  selectors.sortedAvailableWallets = jest.fn(() => {
    return [
      {
        label: `label-${usedTestWalletName}`,
        value: {
          wallet: usedTestWalletName
        }
      }
    ];
  });
  mockEnableTrezor = trezorActions.enableTrezor = jest.fn(() => () => {});
  mockDisableTrezor = trezorActions.disableTrezor = jest.fn(() => () => {});
  mockGetWalletCreationMasterPubKey = trezorActions.getWalletCreationMasterPubKey = jest.fn(
    () => () => Promise.resolve(testWalletCreationMasterPubKey)
  );
  mockAlertNoConnectedDevice = trezorActions.alertNoConnectedDevice = jest.fn(
    () => () => {}
  );
  mockValidateMasterPubKey = controlActions.validateMasterPubKey = jest.fn(
    () => () => {
      return { isValid: false, error: "" };
    }
  );
  mockTrezorDevice = selectors.trezorDevice = jest.fn(() => null);
  mockTrezorConnect = trezorActions.connect = jest.fn(() => () => {});
  mockCreateWatchOnlyWalletRequest = wlActions.createWatchOnlyWalletRequest = jest.fn(
    () => () => Promise.reject("rejecting mock createWatchOnlyWalletRequest")
  );
  selectors.stakeTransactions = jest.fn(() => []);
});

const goToGetStartedView = async () => {
  render(<GetStartedPage />);
  return await wait(() => screen.getByText(/welcome to decrediton/i));
};

const goToCreateNewWalletView = async () => {
  await goToGetStartedView();
  user.click(screen.getByText(/create a new wallet/i));
  return await wait(() => screen.getByText("Wallet Name"));
};

const goToRestoreWalletView = async () => {
  await goToGetStartedView();
  user.click(screen.getByText(/restore existing wallet/i));
  return await wait(() => screen.getByText("Wallet Name"));
};

test("test when createWallet has been rejected", async () => {
  await goToCreateNewWalletView();
  user.type(screen.getByPlaceholderText(/choose a name/i), testWalletName);

  user.click(screen.getByText(/continue/i));
  await wait(() => screen.getByText(testWalletCreateErrorMsg));
  expect(mockCreateWallet).toHaveBeenCalledWith(testSelectedWallet);

  user.click(screen.getByText(/cancel/i));
  await wait(() => screen.getByText(/welcome to decrediton/i));
});

test("daemon response success through createWallet function and createWalletPage has been reached", async () => {
  mockCreateWallet = daemonActions.createWallet = jest.fn(() => () =>
    Promise.resolve(testSelectedWallet)
  );
  await goToCreateNewWalletView();
  user.type(screen.getByPlaceholderText(/choose a name/i), testWalletName);

  user.click(screen.getByText(/continue/i));
  await wait(() => screen.getByText(/copy seed words to clipboard/i));
  expect(mockCreateWallet).toHaveBeenCalledWith(testSelectedWallet);
  expect(mockGenerateSeed).toHaveBeenCalled();
});

test("test wallet name input on creating new wallet view", async () => {
  await goToCreateNewWalletView();

  const continueButton = screen.getByText(/continue/i);
  const walletNameInput = screen.getByPlaceholderText(/choose a name/i);

  user.click(continueButton);
  // walletNameInput is requiered
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
  await wait(() =>
    expect(mockCreateWallet).toHaveBeenCalledWith(testSelectedWallet)
  );
});

test("test wallet name input on restore wallet", async () => {
  const testRestoreSelectedWallet = {
    ...testSelectedWallet,
    value: { ...testSelectedWallet.value, isNew: false }
  };

  await goToRestoreWalletView();
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
  await wait(() =>
    expect(mockCreateWallet).toHaveBeenCalledWith(testRestoreSelectedWallet)
  );
});

test("test watch only control on restore wallet", async () => {
  const testRestoreSelectedWallet = {
    ...testSelectedWallet,
    value: { ...testSelectedWallet.value, isNew: false, isWatchingOnly: true }
  };
  await goToRestoreWalletView();

  const continueButton = screen.getByText(/continue/i);
  user.type(screen.getByPlaceholderText(/choose a name/i), testWalletName);
  user.click(screen.getByText("Advanced Options"));

  // toggle Watch only switch
  const watchOnlySwitch = screen.getByLabelText(/watch only/i);
  user.click(watchOnlySwitch);
  expect(watchOnlySwitch.checked).toBe(true);
  const masterPubKeyInput = screen.getByPlaceholderText(/master pub key/i);
  expect(masterPubKeyInput).toBeInTheDocument();
  // master pub key is required
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
  mockValidateMasterPubKey = controlActions.validateMasterPubKey = jest.fn(
    () => () => {
      return { isValid: true, error: null };
    }
  );
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

  fireEvent.change(masterPubKeyInput, {
    target: { value: testValidMasterPubKey }
  });
  await wait(() =>
    expect(mockValidateMasterPubKey).toHaveBeenCalledWith(testValidMasterPubKey)
  );
  mockCreateWallet = daemonActions.createWallet = jest.fn(() => () =>
    Promise.resolve(true)
  );

  mockCreateWatchOnlyWalletRequest = wlActions.createWatchOnlyWalletRequest = jest.fn(
    () => () => Promise.resolve()
  );
  user.click(continueButton);
  await wait(() =>
    expect(mockCreateWallet).toHaveBeenCalledWith(testRestoreSelectedWallet)
  );
  await wait(() =>
    expect(mockCreateWatchOnlyWalletRequest).toHaveBeenCalledWith(
      testValidMasterPubKey,
      ""
    )
  );
}, 30000);

test("test trezor switch toggling and setup device page", async () => {
  await goToRestoreWalletView();

  const continueButton = screen.getByText(/continue/i);
  user.type(screen.getByPlaceholderText(/choose a name/i), testWalletName);
  user.click(screen.getByText("Advanced Options"));

  // toggle Trezor switch
  const trezorSwitch = screen.getByLabelText(/trezor/i);
  const watchOnlySwitch = screen.getByLabelText(/watch only/i);
  user.click(trezorSwitch);
  expect(mockEnableTrezor).toHaveBeenCalled();
  expect(trezorSwitch.checked).toBe(true);

  // it has to disable Watch only switch and hide master pub key option
  expect(screen.queryByText(/master pub key/i)).not.toBeInTheDocument();
  expect(watchOnlySwitch.checked).toBe(false);

  mockCreateWallet.mockClear();
  user.click(continueButton);
  expect(mockAlertNoConnectedDevice).toHaveBeenCalled();
  expect(mockCreateWallet).not.toHaveBeenCalled();

  // switch off Trezor switch
  user.click(trezorSwitch);
  expect(mockDisableTrezor).toHaveBeenCalled();
  expect(trezorSwitch.checked).toBe(false);

  // go to trezor config view when device is not connected
  user.click(screen.queryByText(/setup device/i));
  await wait(() => screen.getByText(/no trezor is detected/i));
  expect(
    screen.getByText(/no trezor is detected/i).textContent
  ).toMatchInlineSnapshot(
    '"No Trezor is detected. Connect the Device and check if Trezor bridge is installed and running on latest firmware."'
  );
  user.click(screen.getByText(/connect to trezor/i));
  expect(mockTrezorConnect).toHaveBeenCalled();

  // go back
  user.click(screen.getByText(/go back/i).nextElementSibling);
  await wait(() => screen.getByText("Wallet Name"));
});

test("trezor device is connected", async () => {
  mockTrezorDevice = selectors.trezorDevice = jest.fn(() => {
    return { connected: true };
  });
  const testRestoreSelectedWallet = {
    ...testSelectedWallet,
    value: { ...testSelectedWallet.value, isNew: false, isTrezor: true },
    isWatchingOnly: true
  };

  mockCreateWatchOnlyWalletRequest = wlActions.createWatchOnlyWalletRequest = jest.fn(
    () => () => {
      return new Promise((resolve) => setTimeout(() => resolve(), 1));
    }
  );
  mockCreateWallet = daemonActions.createWallet = jest.fn(() => () => {
    return Promise.resolve(testRestoreSelectedWallet);
  });

  render(<GetStartedPage />, {
    initialState: {
      trezor: { device: { connected: true } }
    }
  });
  await wait(() => screen.getByText(/welcome to decrediton/i));
  user.click(screen.getByText(/restore existing wallet/i));
  await wait(() => screen.getByText("Wallet Name"));
  user.click(screen.getByText("Advanced Options"));

  expect(mockTrezorDevice).toHaveBeenCalled();

  // go to trezor config view when device is connected
  user.click(screen.queryByText(/setup device/i));
  await wait(() => screen.getByText("Security"));
  // go back
  user.click(screen.getByText(/go back/i).nextElementSibling);
  await wait(() => screen.getByText("Wallet Name"));

  const continueButton = screen.getByText(/continue/i);
  user.type(screen.getByPlaceholderText(/choose a name/i), testWalletName);
  user.click(screen.getByText("Advanced Options"));
  // toggle Trezor switch
  const trezorSwitch = screen.getByLabelText(/trezor/i);
  user.click(trezorSwitch);
  expect(mockEnableTrezor).toHaveBeenCalled();

  user.click(continueButton);
  await wait(() => expect(screen.getByTestId("decred-loading")));
  expect(mockGetWalletCreationMasterPubKey).toHaveBeenCalled();
  await wait(() =>
    expect(mockCreateWatchOnlyWalletRequest).toHaveBeenCalledWith(
      testWalletCreationMasterPubKey,
      ""
    )
  );
});

test("trezor has to auto-disable when step back from restore view", async () => {
  mockTrezorDevice = selectors.trezorDevice = jest.fn(() => {
    return { connected: true };
  });
  await goToRestoreWalletView();
  user.click(screen.getByText("Advanced Options"));
  // toggle Trezor switch
  const trezorSwitch = screen.getByLabelText(/trezor/i);
  user.click(trezorSwitch);
  expect(mockEnableTrezor).toHaveBeenCalled();

  user.click(screen.getByText(/cancel/i));
  await wait(() => screen.getByText(/welcome to decrediton/i));
  expect(mockDisableTrezor).toHaveBeenCalled();
});

test("test testnet logo on creating new wallet view", async () => {
  const testRestoreSelectedWallet = {
    ...testSelectedWallet,
    value: { ...testSelectedWallet.value, network: "testnet" }
  };
  mockIsTestNet = selectors.isTestNet = jest.fn(() => true);

  await goToCreateNewWalletView();
  expect(screen.getByTestId("getstarted-pagebody").className).toMatch(
    /testnetBody/
  );

  user.type(screen.getByPlaceholderText(/choose a name/i), testWalletName);
  user.click(screen.getByText(/continue/i));
  await wait(() =>
    expect(mockCreateWallet).toHaveBeenCalledWith(testRestoreSelectedWallet)
  );
});

test("test testnet logo on restore wallet view", async () => {
  const testRestoreSelectedWallet = {
    ...testSelectedWallet,
    value: { ...testSelectedWallet.value, isNew: false, network: "testnet" }
  };
  mockIsTestNet = selectors.isTestNet = jest.fn(() => true);

  await goToRestoreWalletView();
  expect(mockIsTestNet).toHaveBeenCalled();
  expect(screen.getByTestId("getstarted-pagebody").className).toMatch(
    /testnetBody/
  );

  user.type(screen.getByPlaceholderText(/choose a name/i), testWalletName);
  user.click(screen.getByText(/continue/i));
  await wait(() =>
    expect(mockCreateWallet).toHaveBeenCalledWith(testRestoreSelectedWallet)
  );
});

test("test disable coin type upgrades and gap limit inputs on restore wallet", async () => {
  const testRestoreSelectedWallet = {
    ...testSelectedWallet,
    value: {
      ...testSelectedWallet.value,
      isNew: false,
      disableCoinTypeUpgrades: true,
      gapLimit: "1001"
    }
  };

  await goToRestoreWalletView();
  user.click(screen.getByText("Advanced Options"));
  const continueButton = screen.getByText(/continue/i);
  const walletNameInput = screen.getByPlaceholderText(/choose a name/i);
  user.type(walletNameInput, testWalletName);

  const disableCoinTypeUpgradesSwitch = screen.getByLabelText(
    /disable coin type upgrades/i
  );
  user.click(disableCoinTypeUpgradesSwitch);
  expect(disableCoinTypeUpgradesSwitch.checked).toBe(true);

  const gapLimitInput = screen.getByLabelText(/gap limit:/i);
  user.type(gapLimitInput, testRestoreSelectedWallet.value.gapLimit);

  user.click(continueButton);
  await wait(() =>
    expect(mockCreateWallet).toHaveBeenCalledWith(testRestoreSelectedWallet)
  );
});
