import SettingsPage from "components/views/SettingsPage";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen, fireEvent, wait } from "@testing-library/react";

import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import * as sa from "actions/SettingsActions";
import * as wla from "actions/WalletLoaderActions";
import * as ta from "actions/TransactionActions";
import { PROXYTYPE_HTTP, PROXYTYPE_PAC } from "constants";
import * as wl from "wallet";
import { DEFAULT_DARK_THEME_NAME, DEFAULT_LIGHT_THEME_NAME } from "pi-ui";
import {
  EXTERNALREQUEST_NETWORK_STATUS,
  EXTERNALREQUEST_STAKEPOOL_LISTING,
  EXTERNALREQUEST_UPDATE_CHECK,
  EXTERNALREQUEST_POLITEIA,
  EXTERNALREQUEST_DCRDATA,
  VSP_FEE_PROCESS_ERRORED
} from "constants";
import { en as enLocale } from "i18n/locales";
import * as vspa from "actions/VSPActions";
import { DCR, ATOMS } from "constants";
import { mockStakeTransactions } from "../TransactionPage/mocks";

const ENABLED = "Enabled";
const DISABLED = "Disabled";

const testWalletName = "test-wallet-name";
const testDefaultNetwork = "Mainnet";
const testDefaultLocale = enLocale;
const testLocale = "de";
const testDefaultLocaleLabel = "English (US)";
const testLocaleLabel = "Deutsch";
const testDefaultSpvMode = DISABLED;
const testDefaultDaemonStartAdvanced = DISABLED;
const testDefaultProxyType = PROXYTYPE_HTTP;
const testDefaultProxyLocation = "test-default-proxy-location";
const testProxyLocation = "test-proxy-location";
const testDefaultSpvConnectValue = [
  "test-default-spv-connect-value-1",
  "test-default-spv-connect-value-2"
];
const testSpvConnectValue = [
  "test-spv-connect-value-1",
  "test-spv-connect-value-2"
];
const testDefaultTheme = DEFAULT_LIGHT_THEME_NAME;
const testTheme = DEFAULT_DARK_THEME_NAME;
const testDefaultThemeLabel = "Light";
const testThemeLabel = "Dark";
const testDefaultCurrencyDisplay = DCR;
const testCurrencyDisplay = ATOMS;
const testDefaultGapLimit = "20";
const testDefaultTimezone = "utc";
const testDefaultAllowedExternalRequests = [
  EXTERNALREQUEST_NETWORK_STATUS,
  EXTERNALREQUEST_POLITEIA
];
const testDefaultUIAnimationsLabel = "Enabled";
const testUIAnimationsLabel = "Disabled";

const testCurrentSettings = {
  locale: testDefaultLocale.key,
  theme: testDefaultTheme,
  network: testDefaultNetwork.toLowerCase(),
  needNetworkReset: false,
  spvMode: testDefaultSpvMode == ENABLED,
  daemonStartAdvanced: testDefaultDaemonStartAdvanced == ENABLED,
  proxyType: testDefaultProxyType,
  proxyLocation: testDefaultProxyLocation,
  spvConnect: testDefaultSpvConnectValue,
  currencyDisplay: testDefaultCurrencyDisplay,
  gapLimit: testDefaultGapLimit,
  timezone: testDefaultTimezone,
  uiAnimations: testDefaultUIAnimationsLabel,
  allowedExternalRequests: testDefaultAllowedExternalRequests
};
const testSettings = {
  currentSettings: testCurrentSettings,
  tempSettings: testCurrentSettings,
  settingsChanged: false
};

let mockIsTestNet;
let mockIsMainNet;
let mockWalletService;
let mockTicketBuyerService;
let mockSaveSettings;
let mockChangePassphrase;
let mockIsChangePassPhraseDisabled;
let mockIsTicketAutoBuyerEnabled;
let mockGetAccountMixerRunning;
let mockPurchaseTicketsRequestAttempt;
let mockManualImportScriptAttempt;

const wallet = wl;
const selectors = sel;
const controlActions = ca;
const wlActions = wla;
const settingsActions = sa;
const vspActions = vspa;
const transactionActions = ta;

beforeEach(() => {
  wallet.getGlobalCfg = jest.fn(() => {
    return {
      get: () => DEFAULT_LIGHT_THEME_NAME,
      set: () => {}
    };
  });
  mockIsTestNet = selectors.isTestNet = jest.fn(() => true);
  mockIsMainNet = selectors.isMainNet = jest.fn(() => false);
  selectors.rescanRequest = jest.fn(() => false);
  mockIsChangePassPhraseDisabled = selectors.isChangePassPhraseDisabled = jest.fn(
    () => false
  );
  mockWalletService = selectors.walletService = jest.fn(() => {
    return {};
  });
  mockTicketBuyerService = selectors.ticketBuyerService = jest.fn(() => {
    return {};
  });
  selectors.changePassphraseRequestAttempt = jest.fn(() => false);
  selectors.getWalletName = jest.fn(() => testWalletName);
  selectors.getWalletReady = jest.fn(() => true);
  controlActions.changePassphraseAttempt = jest.fn(() => true);
  mockSaveSettings = settingsActions.saveSettings = jest.fn(() => () => {});
  wlActions.closeWalletRequest = jest.fn(() => () => {});
  settingsActions.addAllowedExternalRequest = jest.fn(() => true);
  settingsActions.toggleTheme = jest.fn(() => true);
  mockChangePassphrase = controlActions.changePassphraseAttempt = jest.fn(
    () => () => {}
  );

  mockIsTicketAutoBuyerEnabled = selectors.isTicketAutoBuyerEnabled = jest.fn(
    () => false
  );
  selectors.getTicketAutoBuyerRunning = jest.fn(() => false);
  mockGetAccountMixerRunning = selectors.getAccountMixerRunning = jest.fn(
    () => false
  );
  mockPurchaseTicketsRequestAttempt = selectors.purchaseTicketsRequestAttempt = jest.fn(
    () => false
  );
  vspActions.discoverAvailableVSPs = jest.fn(() => () => {});
  mockManualImportScriptAttempt = controlActions.manualImportScriptAttempt = jest.fn(
    () => () => {}
  );
  wallet.getVSPTicketsByFeeStatus = jest.fn(() =>
    Promise.resolve({
      ticketHashes: []
    })
  );
  transactionActions.toggleGetTransactions = jest.fn(() => () => {});
  selectors.stakeTransactions = jest.fn(() => {});
  selectors.getVSPTicketsHashes = jest.fn(() => {});
});

test("show error when there is no walletService", () => {
  mockWalletService = selectors.walletService = jest.fn(() => {});
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  expect(
    screen.getByText("Something went wrong, please go back")
  ).toBeInTheDocument();
  expect(screen.getByText(/back to home/i)).toBeInTheDocument();

  expect(mockIsTestNet).toHaveBeenCalled();
  expect(mockIsMainNet).toHaveBeenCalled();
  expect(mockWalletService).toHaveBeenCalled();
  expect(mockTicketBuyerService).toHaveBeenCalled();
});

test("test close wallet button (there is no ongoing process) ", async () => {
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  const changeFn = () => {
    user.click(screen.getByRole("button", { name: "Close Wallet" }));
  };
  changeFn();
  await testConfirmModal(
    changeFn,
    "Confirmation Required",
    `Are you sure you want to close ${testWalletName} and return to the launcher?`
  );
});

test("test close wallet button (ticket autobuyer is running) ", async () => {
  mockIsTicketAutoBuyerEnabled = selectors.isTicketAutoBuyerEnabled = jest.fn(
    () => true
  );
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  expect(mockIsTicketAutoBuyerEnabled).toHaveBeenCalled();
  const changeFn = () => {
    user.click(screen.getByRole("button", { name: "Close Wallet" }));
  };
  changeFn();
  await testConfirmModal(
    changeFn,
    "Auto Ticket Buyer Still Running",
    "If you proceed, it will be closed and no more tickets will be purchased.",
    "Close Anyway"
  );
});

const testCloseWalletButtonUnpaidTicketFee = async (
  status,
  expectDefaultModal = false
) => {
  selectors.stakeTransactions = jest.fn(() => mockStakeTransactions);
  selectors.getVSPTicketsHashes = jest.fn(() => {
    return {
      [VSP_FEE_PROCESS_ERRORED]: [
        Object.keys(mockStakeTransactions).find(
          (hash) => mockStakeTransactions[hash].status === status
        )
      ]
    };
  });
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  const changeFn = () => {
    user.click(screen.getByRole("button", { name: "Close Wallet" }));
  };
  changeFn();
  if (expectDefaultModal) {
    await testConfirmModal(
      changeFn,
      "Confirmation Required",
      `Are you sure you want to close ${testWalletName} and return to the launcher?`
    );
  } else {
    await testConfirmModal(
      changeFn,
      "VSP Tickets Fee Error",
      /You have outstanding tickets that are not properly registered with a VSP/i,
      "Close Anyway"
    );
  }
};

test.each([
  ["live"],
  ["unmined"],
  ["immature"],
  ["missed", true],
  ["revoked", true]
])(
  "test close wallet button (has unpaid %s ticket fee)",
  testCloseWalletButtonUnpaidTicketFee
);

test("test close wallet button (account mixer is running) ", async () => {
  mockGetAccountMixerRunning = selectors.getAccountMixerRunning = jest.fn(
    () => true
  );
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  expect(mockGetAccountMixerRunning).toHaveBeenCalled();
  const changeFn = () => {
    user.click(screen.getByRole("button", { name: "Close Wallet" }));
  };
  changeFn();
  await testConfirmModal(
    changeFn,
    "Account mixer is running",
    "Account mixer is currently running. Ongoing mixes will be cancelled and no more Decred will be mixed if you proceed.",
    "Close Anyway"
  );
});

test("test close wallet button (still finalizing ticket purchases) ", async () => {
  mockPurchaseTicketsRequestAttempt = selectors.purchaseTicketsRequestAttempt = jest.fn(
    () => true
  );
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  expect(mockPurchaseTicketsRequestAttempt).toHaveBeenCalled();
  const changeFn = () => {
    user.click(screen.getByRole("button", { name: "Close Wallet" }));
  };
  changeFn();
  await testConfirmModal(
    changeFn,
    "Purchasing Tickets",
    "Decrediton is still finalizing ticket purchases. Tickets may not be registered with the VSP if you proceed now, which can result in missed votes.",
    "Close Anyway"
  );
});

test("test close wallet button (legacy auto ticket buyer still running) ", async () => {
  selectors.getTicketAutoBuyerRunning = jest.fn(() => true);
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  expect(mockPurchaseTicketsRequestAttempt).toHaveBeenCalled();
  const changeFn = () => {
    user.click(screen.getByRole("button", { name: "Close Wallet" }));
  };
  changeFn();
  await testConfirmModal(
    changeFn,
    "Auto Ticket Buyer Still Running",
    "If you proceed, it will be closed and no more tickets will be purchased.",
    "Close Anyway"
  );
});

test("test cli tooltips", () => {
  const settingsWithAlreadySetCli = Object.assign({}, testSettings);
  settingsWithAlreadySetCli.tempSettings = {
    ...testCurrentSettings,
    networkFromCli: true,
    spvModeFromCli: true,
    spvConnectFromCli: true,
    daemonStartAdvancedFromCli: true
  };
  render(<SettingsPage />, {
    initialState: {
      settings: settingsWithAlreadySetCli
    }
  });
  const tooltips = screen.getAllByText(
    /This was set as a command-line option/i
  );
  expect(tooltips.length).toBe(4);
});

const getOptionByNameAndType = (name, type) => {
  const regex = new RegExp(type, "g");
  const options = screen
    .getAllByText(name)
    .filter((option) => option.className.match(regex));
  return options[0];
};

const testConfirmModal = async (
  changeFn,
  confirmHeaderText,
  confirmContent,
  confirmButtonLabel = "Confirm"
) => {
  // wait for the confirm modal and cancel
  await wait(() => screen.getByText(confirmHeaderText));
  if (confirmContent) {
    expect(screen.getByText(confirmContent)).toBeInTheDocument();
  }
  user.click(screen.getByText("Cancel"));
  expect(screen.queryByText(confirmHeaderText)).not.toBeInTheDocument();
  // wait for the confirm modal and confirm
  changeFn();
  await wait(() => screen.getByText(confirmHeaderText));
  user.click(screen.getByRole("button", { name: confirmButtonLabel }));
};

const testComboxBoxInput = async (
  labelName,
  oldValue,
  option,
  expectedChange,
  needsConfirm,
  tabLabel = null
) => {
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  if (tabLabel) {
    // go to the specified tab
    user.click(screen.getAllByText(tabLabel)[0]);
  }
  const inputControl = screen.getByLabelText(labelName);
  const inputValueSpan = getOptionByNameAndType(oldValue, "singleValue");
  expect(inputValueSpan.textContent).toMatch(oldValue);
  const changeFn = () => {
    user.click(inputControl);
    user.click(getOptionByNameAndType(option, "option"));
  };
  changeFn();

  if (needsConfirm) {
    await testConfirmModal(changeFn, "Reset required");
  }

  await wait(() =>
    expect(mockSaveSettings).toHaveBeenCalledWith({
      ...testCurrentSettings,
      ...expectedChange
    })
  );
};

test.each([
  ["Network", testDefaultNetwork, "Testnet", { network: "testnet" }, true],
  ["SPV", testDefaultSpvMode, ENABLED, { spvMode: true }, true],
  [
    "Adv. Daemon Startup",
    testDefaultDaemonStartAdvanced,
    ENABLED,
    { daemonStartAdvanced: true },
    true
  ],
  ["Proxy Type", "HTTP", "PAC", { proxyType: PROXYTYPE_PAC }, false],
  [
    "Locale",
    testDefaultLocaleLabel,
    testLocaleLabel,
    { locale: testLocale },
    false,
    "General"
  ],
  [
    "Displayed Units",
    testDefaultCurrencyDisplay,
    testCurrencyDisplay,
    { currencyDisplay: testCurrencyDisplay },
    false,
    "General"
  ],
  [
    "Tonality",
    testDefaultThemeLabel,
    testThemeLabel,
    { theme: testTheme },
    false,
    "General"
  ],
  [
    "UI Animations",
    testDefaultUIAnimationsLabel,
    testUIAnimationsLabel,
    { uiAnimations: false },
    false,
    "General"
  ]
])("change '%s' ComboBox from '%s' to '%s' expeced %s", testComboxBoxInput);

const testTextFieldInput = async (
  labelName,
  oldValue,
  newValue,
  expectedChange,
  needsConfirm
) => {
  render(<SettingsPage />, {
    initialState: { settings: testSettings }
  });

  const inputControl = screen.getByLabelText(labelName);
  expect(inputControl.value).toMatch(oldValue);
  user.clear(inputControl);
  user.type(inputControl, newValue);
  // press enter
  fireEvent.keyDown(inputControl, {
    key: "enter",
    keyCode: 13
  });

  if (needsConfirm) {
    testConfirmModal("Save", "Reset required");
  }

  await wait(() =>
    expect(mockSaveSettings).toHaveBeenCalledWith({
      ...testCurrentSettings,
      ...expectedChange
    })
  );
};

test.each([
  [
    "SPV Connect",
    testDefaultSpvConnectValue.join(","),
    testSpvConnectValue.join(","),
    { spvConnect: testSpvConnectValue },
    false
  ],
  [
    "Proxy Location",
    testDefaultProxyLocation,
    testProxyLocation,
    { proxyLocation: testProxyLocation },
    false
  ]
])("change '%s' TextInput from '%s' to '%s' expeced %s", testTextFieldInput);

const testRadioButtonGroupInput = (configKey, options, defaultValue) => {
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  user.click(screen.getByText("General"));

  options.forEach((option) =>
    expect(screen.getByLabelText(option.label).checked).toBe(
      option.value == defaultValue
    )
  );

  //select other radio button
  const otherOption = options.filter(
    (option) => option.value != defaultValue
  )[0];
  user.click(screen.getByLabelText(otherOption.label));
  options.forEach((option) =>
    expect(screen.getByLabelText(option.label).checked).toBe(
      option.value == otherOption.value
    )
  );

  const expectedChange = { ...testCurrentSettings };
  expectedChange[configKey] = otherOption.value;
  expect(mockSaveSettings).toHaveBeenCalledWith(expectedChange);

  //select default radio button again
  const defaultOption = options.filter(
    (option) => option.value == defaultValue
  )[0];
  user.click(screen.getByLabelText(defaultOption.label));
  options.forEach((option) =>
    expect(screen.getByLabelText(option.label).checked).toBe(
      option.value == defaultOption.value
    )
  );
};

test.each([
  [
    "timezone",
    [
      { label: "Local", value: "local" },
      { label: "UTC", value: "utc" }
    ],
    testDefaultTimezone
  ]
])("test '%s' RadioButtonGroup", testRadioButtonGroupInput);

const testCheckBoxInput = (label, configKey) => {
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  user.click(screen.getByText("Privacy and Security"));

  const checkbox = screen.getByLabelText(label);
  const defaultCheckedValue = testDefaultAllowedExternalRequests.includes(
    configKey
  );

  expect(checkbox.checked).toBe(defaultCheckedValue);

  user.click(checkbox);
  expect(checkbox.checked).toBe(!defaultCheckedValue);

  const expectedChange = { ...testCurrentSettings };

  if (defaultCheckedValue) {
    const index = expectedChange.allowedExternalRequests.indexOf(configKey);
    if (index !== -1) {
      expectedChange.allowedExternalRequests.splice(index, 1);
    }
  } else {
    expectedChange.allowedExternalRequests.push(configKey);
  }
  expect(mockSaveSettings).toHaveBeenCalledWith(expectedChange);
};

test.each([
  ["Network Information", EXTERNALREQUEST_NETWORK_STATUS],
  ["VSP Listing", EXTERNALREQUEST_STAKEPOOL_LISTING],
  ["Update Check", EXTERNALREQUEST_UPDATE_CHECK],
  ["Politeia", EXTERNALREQUEST_POLITEIA],
  ["Decred Block Explorer", EXTERNALREQUEST_DCRDATA]
])("test '%s' Checkbox", testCheckBoxInput);

const getFieldRequiredErrorCount = () => {
  const inputErrorString = "This field is required";
  const inputErrors = screen.queryAllByText(inputErrorString);
  return inputErrors ? inputErrors.length : 0;
};

const testPassphraseInputRequiedErrorMsg = (label) => {
  const testString = "test-string";

  const inputErrorsCount = getFieldRequiredErrorCount();
  const input = screen.getByLabelText(label);
  user.type(input, testString);
  expect(input.value).toMatch(testString);
  user.clear(input);

  expect(getFieldRequiredErrorCount()).toBe(inputErrorsCount + 1);

  // type again, error message should disappear
  user.type(input, testString);
  expect(getFieldRequiredErrorCount()).toBe(inputErrorsCount);

  // clean up
  user.clear(input);
  expect(getFieldRequiredErrorCount()).toBe(inputErrorsCount + 1);
};

test("test update private passphrase", () => {
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  user.click(screen.getByText("Privacy and Security"));
  const updateButton = screen.getByRole("button", {
    name: "Update Private Passphrase"
  });
  const modalHeaderText = "Change your passphrase";
  // click and cancel
  user.click(updateButton);
  expect(screen.getByText(modalHeaderText)).toBeInTheDocument();
  user.click(screen.getByText("Cancel"));
  expect(screen.queryByText(modalHeaderText)).not.toBeInTheDocument();

  user.click(updateButton);
  expect(screen.getByText(modalHeaderText)).toBeInTheDocument();

  const continueButton = screen.getByText("Continue");
  expect(continueButton.disabled).toBe(true);
  // test 'This Field is required' error message
  testPassphraseInputRequiedErrorMsg("Private Passphrase");
  testPassphraseInputRequiedErrorMsg("New Private Passphrase");
  testPassphraseInputRequiedErrorMsg("Confirm");
  expect(continueButton.disabled).toBe(true);

  // fill input fields
  const testPassphrase = "test-passphrase";
  const testNewPassphrase = "test-new-passphrase";
  const testConfirmPassphrase = "test-confirm-passphrase";
  user.type(screen.getByLabelText(/^private passphrase/i), testPassphrase);
  user.type(
    screen.getByLabelText(/^new private passphrase/i),
    testNewPassphrase
  );
  expect(continueButton.disabled).toBe(true);
  user.type(screen.getByLabelText(/^confirm/i), testConfirmPassphrase);
  expect(screen.getByText("Passwords does not match.")).toBeInTheDocument();

  // fix confirm passphrase
  user.clear(screen.getByLabelText(/^confirm/i));
  user.type(screen.getByLabelText(/^confirm/i), testNewPassphrase);
  expect(
    screen.queryByText("Passwords does not match.")
  ).not.toBeInTheDocument();
  expect(continueButton.disabled).toBe(false);

  // clear confirm and new passphrases. should get an error message
  user.clear(screen.getByLabelText(/^confirm/i));
  user.clear(screen.getByLabelText(/^new private passphrase/i));
  expect(screen.getByText("Fill all fields.")).toBeInTheDocument();
  expect(continueButton.disabled).toBe(true);

  //refill inputs
  user.type(
    screen.getByLabelText(/^new private passphrase/i),
    testNewPassphrase
  );
  user.type(screen.getByLabelText(/^confirm/i), testNewPassphrase);
  expect(screen.queryByText("Fill all fields.")).not.toBeInTheDocument();
  expect(continueButton.disabled).toBe(false);

  user.click(screen.getByText("Continue"));
  expect(mockChangePassphrase).toHaveBeenCalledWith(
    testPassphrase,
    testNewPassphrase,
    true
  );
});

test("update private passphrase is disabled", () => {
  mockIsChangePassPhraseDisabled = selectors.isChangePassPhraseDisabled = jest.fn(
    () => true
  );
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  user.click(screen.getByText("Privacy and Security"));
  expect(mockIsChangePassPhraseDisabled).toHaveBeenCalled();
  user.click(screen.getByRole("button", { name: "Update Private Passphrase" }));
  expect(screen.queryByText("Change your passphrase")).not.toBeInTheDocument();
});

test("test import script button", async () => {
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  user.click(screen.getAllByText("General")[0]);

  await wait(() => screen.getByText("Import script"));
  expect(
    screen.getByText("Manually import a redeem script for tickets.")
  ).toBeInTheDocument();
  const importScriptButton = screen.getByRole("button", {
    name: "Import script button"
  });
  user.click(importScriptButton);

  // modal has been shown
  expect(screen.getByText("Import Redeem Script")).toBeInTheDocument();
  // cancel first
  user.click(screen.getByRole("button", { name: "Cancel" }));
  expect(screen.queryByText("Import Redeem Script")).not.toBeInTheDocument();

  //open again
  user.click(importScriptButton);
  const testScript = "test-script";
  user.type(screen.getByLabelText("Script:"), testScript);

  user.click(screen.getByRole("button", { name: "Continue" }));

  expect(mockManualImportScriptAttempt).toHaveBeenCalledWith(testScript);

  expect(screen.queryByText("Import Redeem Script")).not.toBeInTheDocument();
});

test("import script button should be disabled during rescan process", async () => {
  selectors.rescanRequest = jest.fn(() => true);
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  user.click(screen.getAllByText("General")[0]);

  await wait(() => screen.getByText("Import script"));
  expect(
    screen.queryByText("Manually import a redeem script for tickets.")
  ).not.toBeInTheDocument();
  expect(
    screen.getByText("Importing scripts is disabled during a rescan.")
  ).toBeInTheDocument();

  expect(
    screen.getByRole("button", {
      name: "Import script button"
    }).disabled
  ).toBeTruthy();
});
