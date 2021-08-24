import SettingsPage from "components/views/SettingsPage/SettingsPage";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { screen } from "@testing-library/react";

import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import * as sa from "actions/SettingsActions";
import * as wla from "actions/WalletLoaderActions";
import { PROXYTYPE_HTTP, PROXYTYPE_PAC } from "constants";
import * as wl from "wallet";
import { DEFAULT_DARK_THEME_NAME, DEFAULT_LIGHT_THEME_NAME } from "pi-ui";
import {
  EXTERNALREQUEST_NETWORK_STATUS,
  EXTERNALREQUEST_STAKEPOOL_LISTING,
  EXTERNALREQUEST_UPDATE_CHECK,
  EXTERNALREQUEST_POLITEIA,
  EXTERNALREQUEST_DCRDATA
} from "constants";
import { en as enLocale } from "i18n/locales";
import * as vspa from "actions/VSPActions";
import { DCR, ATOMS } from "constants";

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

const testCurrentSettings = {
  locale: testDefaultLocale,
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
let mockGetGlobalCfg;
let mockChangePassphrase;
let mockIsChangePassPhraseDisabled;
let mockIsTicketAutoBuyerEnabled;
let mockGetHasUnpaidFee;
let mockGetAccountMixerRunning;
let mockPurchaseTicketsRequestAttempt;

const wallet = wl;
const selectors = sel;
const controlActions = ca;
const wlActions = wla;
const settingsActions = sa;
const vspActions = vspa;

beforeEach(() => {
  mockGetGlobalCfg = wallet.getGlobalCfg = jest.fn(() => {
    return {
      get: () => DEFAULT_LIGHT_THEME_NAME,
      set: () => {}
    };
  });
  mockIsTestNet = selectors.isTestNet = jest.fn(() => true);
  mockIsMainNet = selectors.isMainNet = jest.fn(() => false);
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
  mockGetHasUnpaidFee = selectors.getHasTicketFeeError = jest.fn(() => false);
  mockGetAccountMixerRunning = selectors.getAccountMixerRunning = jest.fn(
    () => false
  );
  mockPurchaseTicketsRequestAttempt = selectors.purchaseTicketsRequestAttempt = jest.fn(
    () => false
  );
  vspActions.discoverAvailableVSPs = jest.fn(() => () => {});
});

test("show error when there is no walletService", () => {
  mockWalletService = selectors.walletService = jest.fn(() => {});
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  user.click(screen.getByRole("link", { name: "Settings" }));
  expect(
    screen.getByText("Something went wrong, please go back")
  ).toBeInTheDocument();
  expect(screen.getByText(/back to home/i)).toBeInTheDocument();

  expect(mockIsTestNet).toHaveBeenCalled();
  expect(mockIsMainNet).toHaveBeenCalled();
  expect(mockWalletService).toHaveBeenCalled();
  expect(mockTicketBuyerService).toHaveBeenCalled();
});

test("test close wallet button (there is no ongoing process) ", () => {
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  testConfirmModal("Close Wallet", "Confirmation Required");
});

test("test close wallet button (ticket autobuyer is running) ", () => {
  mockIsTicketAutoBuyerEnabled = selectors.isTicketAutoBuyerEnabled = jest.fn(
    () => true
  );
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  expect(mockIsTicketAutoBuyerEnabled).toHaveBeenCalled();
  testConfirmModal(
    "Close Wallet",
    "Auto Ticket Buyer Still Running",
    "If you proceed, it will be closed and no more tickets will be purchased.",
    "Close Anyway"
  );
});

test("test close wallet button (has unpaid fee) ", () => {
  mockGetHasUnpaidFee = selectors.getHasTicketFeeError = jest.fn(() => true);
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  expect(mockGetHasUnpaidFee).toHaveBeenCalled();
  testConfirmModal(
    "Close Wallet",
    "VSP Tickets Fee Error",
    /You have outstanding tickets that are not properly registered with a VSP/i,
    "Close Anyway"
  );
});

test("test close wallet button (account mixer is running) ", () => {
  mockGetAccountMixerRunning = selectors.getAccountMixerRunning = jest.fn(
    () => true
  );
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  expect(mockGetAccountMixerRunning).toHaveBeenCalled();
  testConfirmModal(
    "Close Wallet",
    "Account mixer is running",
    "Account mixer is currently running. Ongoing mixes will be cancelled and no more Decred will be mixed if you proceed.",
    "Close Anyway"
  );
});

test("test close wallet button (still finalizing ticket purchases) ", () => {
  mockPurchaseTicketsRequestAttempt = selectors.purchaseTicketsRequestAttempt = jest.fn(
    () => true
  );
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  expect(mockPurchaseTicketsRequestAttempt).toHaveBeenCalled();
  testConfirmModal(
    "Close Wallet",
    "Purchasing Tickets",
    "Decrediton is still finalizing ticket purchases. Tickets may not be registered with the VSP if you proceed now, which can result in missed votes.",
    "Close Anyway"
  );
});

test("test close wallet button (legacy auto ticket buyer still running) ", () => {
  selectors.getTicketAutoBuyerRunning = jest.fn(() => true);
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  expect(mockPurchaseTicketsRequestAttempt).toHaveBeenCalled();
  testConfirmModal(
    "Close Wallet",
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
  user.click(screen.getByRole("link", { name: "Settings" }));
  const tooltips = screen.getAllByText(
    /This was set as a command-line option/i
  );
  expect(tooltips.length).toBe(4);
});

const getOptionByNameAndType = (name, type) => {
  const regex = new RegExp(type, "g");
  const options = screen
    .getAllByRole("option", { name: name })
    .filter((option) => option.className.match(regex));
  return options[0];
};

const testConfirmModal = (
  submitButtonText,
  confirmHeaderText,
  confirmContent,
  confirmButtonLabel = "Confirm"
) => {
  const submitButton = screen.getByText(submitButtonText);
  // submit and cancel
  user.click(submitButton);
  expect(screen.getByText(confirmHeaderText)).toBeInTheDocument();
  if (confirmContent) {
    expect(screen.getByText(confirmContent)).toBeInTheDocument();
  }
  user.click(screen.getByText("Cancel"));
  expect(screen.queryByText(confirmHeaderText)).not.toBeInTheDocument();
  // submit and confirm
  user.click(submitButton);
  expect(screen.getByText(confirmHeaderText)).toBeInTheDocument();
  user.click(screen.getByText(confirmButtonLabel));
};

const testComboxBoxInput = (
  labelName,
  oldValue,
  option,
  expectedChange,
  needsConfirm
) => {
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  user.click(screen.getByRole("link", { name: "Settings" }));
  const saveButton = screen.getByText("Save");
  expect(saveButton.disabled).toBe(true);
  const inputControl = screen.getByLabelText(labelName);
  const inputValueSpan = getOptionByNameAndType(oldValue, "value");
  expect(inputValueSpan.textContent).toMatch(oldValue);
  user.click(inputControl.parentNode);
  user.click(getOptionByNameAndType(option, "option"));

  expect(screen.getByText("Save").disabled).toBe(false);

  if (needsConfirm) {
    testConfirmModal("Save", "Reset required");
  } else {
    user.click(saveButton);
  }

  expect(mockSaveSettings).toHaveBeenCalledWith({
    ...testCurrentSettings,
    ...expectedChange
  });
  expect(mockGetGlobalCfg).toHaveBeenCalled();
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
    false
  ],
  [
    "Displayed Units",
    testDefaultCurrencyDisplay,
    testCurrencyDisplay,
    { currencyDisplay: testCurrencyDisplay },
    false
  ],
  [
    "Tonality",
    testDefaultThemeLabel,
    testThemeLabel,
    { theme: testTheme },
    false
  ]
])("change '%s' ComboBox from '%s' to '%s' expeced %s", testComboxBoxInput);

const testTextFieldInput = (
  labelName,
  oldValue,
  newValue,
  expectedChange,
  needsConfirm
) => {
  render(<SettingsPage />, {
    initialState: { settings: testSettings }
  });
  user.click(screen.getByRole("link", { name: "Settings" }));
  const saveButton = screen.getByText("Save");
  expect(saveButton.disabled).toBe(true);

  const inputControl = screen.getByLabelText(labelName);
  expect(inputControl.value).toMatch(oldValue);
  user.clear(inputControl);
  user.type(inputControl, newValue);

  expect(saveButton.disabled).toBe(false);
  if (needsConfirm) {
    testConfirmModal("Save", "Reset required");
  } else {
    user.click(saveButton);
  }
  expect(mockSaveSettings).toHaveBeenCalledWith({
    ...testCurrentSettings,
    ...expectedChange
  });
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
  user.click(screen.getByRole("link", { name: "Settings" }));
  const saveButton = screen.getByText("Save");
  expect(saveButton.disabled).toBe(true);

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

  expect(saveButton.disabled).toBe(false);
  user.click(saveButton);
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

  expect(saveButton.disabled).toBe(true);
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
  user.click(screen.getByRole("link", { name: "Settings" }));

  const checkbox = screen.getByLabelText(label);
  const defaultCheckedValue = testDefaultAllowedExternalRequests.includes(
    configKey
  );
  const saveButton = screen.getByText("Save");

  expect(checkbox.checked).toBe(defaultCheckedValue);

  expect(saveButton.disabled).toBe(true);
  user.click(checkbox);
  expect(checkbox.checked).toBe(!defaultCheckedValue);
  expect(saveButton.disabled).toBe(false);

  user.click(saveButton);
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
  user.click(screen.getByRole("link", { name: "Settings" }));
  const updateButton = screen.getByLabelText("Update Private Passphrase");
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
  testPassphraseInputRequiedErrorMsg("Private Passphrase:");
  testPassphraseInputRequiedErrorMsg("New Private Passphrase:");
  testPassphraseInputRequiedErrorMsg("Confirm:");
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
  user.click(screen.getByRole("link", { name: "Settings" }));
  expect(mockIsChangePassPhraseDisabled).toHaveBeenCalled();
  user.click(screen.getByLabelText("Update Private Passphrase"));
  expect(screen.queryByText("Change your passphrase")).not.toBeInTheDocument();
});
