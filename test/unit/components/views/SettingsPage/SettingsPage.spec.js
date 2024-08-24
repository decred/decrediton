import SettingsPage from "components/views/SettingsPage";
import { render } from "test-utils.js";
import userEvent from "@testing-library/user-event";
import { screen, fireEvent, waitFor } from "@testing-library/react";

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
import { mockNormalizedStakeTransactions } from "../TransactionPage/mocks.js";

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
const testDefaultAutoWalletLaunching = false;

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
  allowedExternalRequests: testDefaultAllowedExternalRequests,
  autoWalletLaunching: testDefaultAutoWalletLaunching
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
let mockGetAccountMixerRunning;
let mockPurchaseTicketsRequestAttempt;

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

  mockIsChangePassPhraseDisabled = selectors.isChangePassPhraseDisabled =
    jest.fn(() => false);
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

  selectors.getTicketAutoBuyerRunning = jest.fn(() => false);
  mockGetAccountMixerRunning = selectors.getAccountMixerRunning = jest.fn(
    () => false
  );
  mockPurchaseTicketsRequestAttempt = selectors.purchaseTicketsRequestAttempt =
    jest.fn(() => false);
  vspActions.discoverAvailableVSPs = jest.fn(() => () => {});
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
  const user = userEvent.setup();
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  const changeFn = async () => {
    await user.click(screen.getByRole("button", { name: "Close Wallet" }));
  };
  await changeFn();
  await testConfirmModal(
    user,
    changeFn,
    "Confirmation Required",
    `Are you sure you want to close ${testWalletName} and return to the launcher?`
  );
});

const testCloseWalletButtonUnpaidTicketFee = async (
  status,
  expectDefaultModal = false
) => {
  selectors.stakeTransactions = jest.fn(() => mockNormalizedStakeTransactions);
  selectors.getVSPTicketsHashes = jest.fn(() => {
    return {
      [VSP_FEE_PROCESS_ERRORED]: [
        Object.keys(mockNormalizedStakeTransactions).find(
          (hash) => mockNormalizedStakeTransactions[hash].status === status
        )
      ]
    };
  });
  const user = userEvent.setup();
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  const changeFn = async () => {
    await user.click(screen.getByRole("button", { name: "Close Wallet" }));
  };
  await changeFn();
  if (expectDefaultModal) {
    await testConfirmModal(
      user,
      changeFn,
      "Confirmation Required",
      `Are you sure you want to close ${testWalletName} and return to the launcher?`
    );
  } else {
    await testConfirmModal(
      user,
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
  const user = userEvent.setup();
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  expect(mockGetAccountMixerRunning).toHaveBeenCalled();
  const changeFn = async () => {
    await user.click(screen.getByRole("button", { name: "Close Wallet" }));
  };
  await changeFn();
  await testConfirmModal(
    user,
    changeFn,
    "Account mixer is running",
    "Account mixer is currently running. Ongoing mixes will be cancelled and no more Decred will be mixed if you proceed.",
    "Close Anyway"
  );
});

test("test close wallet button (still finalizing ticket purchases) ", async () => {
  mockPurchaseTicketsRequestAttempt = selectors.purchaseTicketsRequestAttempt =
    jest.fn(() => true);
  const user = userEvent.setup();
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  expect(mockPurchaseTicketsRequestAttempt).toHaveBeenCalled();
  const changeFn = async () => {
    await user.click(screen.getByRole("button", { name: "Close Wallet" }));
  };
  await changeFn();
  await testConfirmModal(
    user,
    changeFn,
    "Purchasing Tickets",
    "Decrediton is still finalizing ticket purchases. Tickets may not be registered with the VSP if you proceed now, which can result in missed votes.",
    "Close Anyway"
  );
});

test("test close wallet button (auto ticket buyer still running) ", async () => {
  selectors.getTicketAutoBuyerRunning = jest.fn(() => true);
  const user = userEvent.setup();
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  expect(mockPurchaseTicketsRequestAttempt).toHaveBeenCalled();
  const changeFn = async () => {
    await user.click(screen.getByRole("button", { name: "Close Wallet" }));
  };
  await changeFn();
  await testConfirmModal(
    user,
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
  user,
  changeFn,
  confirmHeaderText,
  confirmContent,
  confirmButtonLabel = "Confirm"
) => {
  // waitFor for the confirm modal and cancel
  await waitFor(() => screen.getByText(confirmHeaderText));
  if (confirmContent) {
    expect(screen.getByText(confirmContent)).toBeInTheDocument();
  }
  await user.click(screen.getByText("Cancel"));
  expect(screen.queryByText(confirmHeaderText)).not.toBeInTheDocument();
  // waitFor for the confirm modal and confirm
  await changeFn();
  await waitFor(() => screen.getByText(confirmHeaderText));
  await user.click(screen.getByRole("button", { name: confirmButtonLabel }));
};

const testComboxBoxInput = async (
  labelName,
  oldValue,
  option,
  expectedChange,
  needsConfirm,
  tabLabel = null
) => {
  const user = userEvent.setup();
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  if (tabLabel) {
    // go to the specified tab
    await user.click(screen.getAllByText(tabLabel)[0]);
  }
  const inputControl = screen.getByLabelText(labelName);
  const inputValueSpan = getOptionByNameAndType(oldValue, "singleValue");
  expect(inputValueSpan.textContent).toMatch(oldValue);
  const changeFn = async () => {
    await user.click(inputControl);
    await user.click(getOptionByNameAndType(option, "option"));
  };
  await changeFn();

  if (needsConfirm) {
    await testConfirmModal(user, changeFn, "Reset required");
  }

  await waitFor(() =>
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
  const user = userEvent.setup();
  render(<SettingsPage />, {
    initialState: { settings: testSettings }
  });

  const inputControl = screen.getByLabelText(labelName);
  expect(inputControl.value).toMatch(oldValue);
  fireEvent.change(inputControl, {
    target: { value: newValue }
  });
  // press enter
  fireEvent.keyDown(inputControl, {
    key: "enter",
    keyCode: 13
  });

  if (needsConfirm) {
    testConfirmModal(user, "Save", "Reset required");
  }

  await waitFor(() =>
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
    // clear input field
    "SPV Connect",
    testDefaultSpvConnectValue.join(","),
    "",
    { spvConnect: [] },
    false
  ]
])("change '%s' TextInput from '%s' to '%s' expeced %s", testTextFieldInput);

const testRadioButtonGroupInput = async (configKey, options, defaultValue) => {
  const user = userEvent.setup();
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  await user.click(screen.getByText("General"));

  options.forEach((option) =>
    expect(screen.getByLabelText(option.label).checked).toBe(
      option.value == defaultValue
    )
  );

  //select other radio button
  const otherOption = options.filter(
    (option) => option.value != defaultValue
  )[0];
  await user.click(screen.getByLabelText(otherOption.label));
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
  await user.click(screen.getByLabelText(defaultOption.label));
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

const testCheckBoxInputOnPrivacy = async (label, configKey) => {
  const user = userEvent.setup();
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  await user.click(screen.getByText("Privacy and Security"));

  const checkbox = screen.getByLabelText(label);
  const defaultCheckedValue =
    testDefaultAllowedExternalRequests.includes(configKey);

  expect(checkbox.checked).toBe(defaultCheckedValue);

  await user.click(checkbox);
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
])("test '%s' Checkbox", testCheckBoxInputOnPrivacy);

test("test launcer CheckBox", async () => {
  const user = userEvent.setup();
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  await user.click(screen.getByText("General"));

  const checkbox = screen.getByLabelText(
    "Launch wallet immediately after loading completes"
  );
  expect(checkbox.checked).toBe(testDefaultAutoWalletLaunching);

  await user.click(checkbox);
  expect(checkbox.checked).toBe(!testDefaultAutoWalletLaunching);

  const expectedChange = {
    ...testCurrentSettings,
    autoWalletLaunching: !testDefaultAutoWalletLaunching
  };

  expect(mockSaveSettings).toHaveBeenCalledWith(expectedChange);
});

const getFieldRequiredErrorCount = () => {
  const inputErrorString = "This field is required";
  const inputErrors = screen.queryAllByText(inputErrorString);
  return inputErrors ? inputErrors.length : 0;
};

const testPassphraseInputRequiedErrorMsg = async (user, label) => {
  const testString = "test-string";

  const inputErrorsCount = getFieldRequiredErrorCount();
  const input = screen.getByLabelText(label);
  await user.type(input, testString);
  expect(input.value).toMatch(testString);
  await user.clear(input);

  expect(getFieldRequiredErrorCount()).toBe(inputErrorsCount + 1);

  // type again, error message should disappear
  await user.type(input, testString);
  expect(getFieldRequiredErrorCount()).toBe(inputErrorsCount);

  // clean up
  await user.clear(input);
  expect(getFieldRequiredErrorCount()).toBe(inputErrorsCount + 1);
};

test("test update private passphrase", async () => {
  const user = userEvent.setup();
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  await user.click(screen.getByText("Privacy and Security"));
  const updateButton = screen.getByRole("button", {
    name: "Update Private Passphrase"
  });
  const modalHeaderText = "Change your passphrase";
  // click and cancel
  await user.click(updateButton);
  expect(screen.getByText(modalHeaderText)).toBeInTheDocument();
  await user.click(screen.getByText("Cancel"));
  expect(screen.queryByText(modalHeaderText)).not.toBeInTheDocument();

  await user.click(updateButton);
  expect(screen.getByText(modalHeaderText)).toBeInTheDocument();

  const continueButton = screen.getByText("Continue");
  expect(continueButton.disabled).toBe(true);
  // test 'This Field is required' error message
  await testPassphraseInputRequiedErrorMsg(user, "Private Passphrase");
  await testPassphraseInputRequiedErrorMsg(user, "New Private Passphrase");
  await testPassphraseInputRequiedErrorMsg(user, "Confirm");
  expect(continueButton.disabled).toBe(true);

  // fill input fields
  const testPassphrase = "test-passphrase";
  const testNewPassphrase = "test-new-passphrase";
  const testConfirmPassphrase = "test-confirm-passphrase";
  await user.type(
    screen.getByLabelText(/^private passphrase/i),
    testPassphrase
  );
  await user.type(
    screen.getByLabelText(/^new private passphrase/i),
    testNewPassphrase
  );
  expect(continueButton.disabled).toBe(true);
  await user.type(screen.getByLabelText(/^confirm/i), testConfirmPassphrase);
  expect(screen.getByText("Passwords does not match.")).toBeInTheDocument();

  // fix confirm passphrase
  await user.clear(screen.getByLabelText(/^confirm/i));
  await user.type(screen.getByLabelText(/^confirm/i), testNewPassphrase);
  expect(
    screen.queryByText("Passwords does not match.")
  ).not.toBeInTheDocument();
  expect(continueButton.disabled).toBe(false);

  // clear confirm and new passphrases. should get an error message
  await user.clear(screen.getByLabelText(/^confirm/i));
  await user.clear(screen.getByLabelText(/^new private passphrase/i));
  expect(screen.getByText("Fill all fields.")).toBeInTheDocument();
  expect(continueButton.disabled).toBe(true);

  //refill inputs
  await user.type(
    screen.getByLabelText(/^new private passphrase/i),
    testNewPassphrase
  );
  await user.type(screen.getByLabelText(/^confirm/i), testNewPassphrase);
  expect(screen.queryByText("Fill all fields.")).not.toBeInTheDocument();
  expect(continueButton.disabled).toBe(false);

  expect(
    screen.queryByLabelText(/^DEX App Passsword/i)
  ).not.toBeInTheDocument();
  await user.click(screen.getByText("Continue"));
  expect(mockChangePassphrase).toHaveBeenCalledWith(
    testPassphrase,
    testNewPassphrase,
    true,
    null
  );
});

test("test update private passphrase, DEX is active", async () => {
  const user = userEvent.setup();
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings,
      dex: {
        active: true
      },
      walletLoader: {
        dexAccount: "test-dex-account-name"
      }
    }
  });
  await user.click(screen.getByText("Privacy and Security"));
  const updateButton = screen.getByRole("button", {
    name: "Update Private Passphrase"
  });
  const modalHeaderText = "Change your passphrase";
  // click and cancel
  await user.click(updateButton);
  expect(screen.getByText(modalHeaderText)).toBeInTheDocument();
  await user.click(screen.getByText("Cancel"));
  expect(screen.queryByText(modalHeaderText)).not.toBeInTheDocument();

  await user.click(updateButton);
  expect(screen.getByText(modalHeaderText)).toBeInTheDocument();

  const continueButton = screen.getByText("Continue");
  expect(continueButton.disabled).toBe(true);
  // test 'This Field is required' error message
  await testPassphraseInputRequiedErrorMsg(user, "Private Passphrase");
  await testPassphraseInputRequiedErrorMsg(user, "New Private Passphrase");
  await testPassphraseInputRequiedErrorMsg(user, "Confirm");
  expect(continueButton.disabled).toBe(true);

  // fill input fields
  const testPassphrase = "test-passphrase";
  const testNewPassphrase = "test-new-passphrase";
  const testDEXAppPasspword = "test-dex-app-password";
  const testConfirmPassphrase = "test-confirm-passphrase";
  await user.type(
    screen.getByLabelText(/^private passphrase/i),
    testPassphrase
  );
  await user.type(
    screen.getByLabelText(/^new private passphrase/i),
    testNewPassphrase
  );
  expect(continueButton.disabled).toBe(true);
  await user.type(screen.getByLabelText(/^confirm/i), testConfirmPassphrase);
  expect(screen.getByText("Passwords does not match.")).toBeInTheDocument();

  // fix confirm passphrase
  await user.clear(screen.getByLabelText(/^confirm/i));
  await user.type(screen.getByLabelText(/^confirm/i), testNewPassphrase);
  expect(
    screen.queryByText("Passwords does not match.")
  ).not.toBeInTheDocument();
  expect(continueButton.disabled).toBe(false);

  // clear confirm and new passphrases. should get an error message
  await user.clear(screen.getByLabelText(/^confirm/i));
  await user.clear(screen.getByLabelText(/^new private passphrase/i));
  expect(screen.getByText("Fill all fields.")).toBeInTheDocument();
  expect(continueButton.disabled).toBe(true);

  //refill inputs
  await user.type(
    screen.getByLabelText(/^new private passphrase/i),
    testNewPassphrase
  );
  await user.type(screen.getByLabelText(/^confirm/i), testNewPassphrase);
  expect(screen.queryByText("Fill all fields.")).not.toBeInTheDocument();
  expect(continueButton.disabled).toBe(false);

  await user.type(
    screen.getByLabelText(/^DEX App Passsword/i),
    testDEXAppPasspword
  );
  await user.click(screen.getByText("Continue"));
  expect(mockChangePassphrase).toHaveBeenCalledWith(
    testPassphrase,
    testNewPassphrase,
    true,
    testDEXAppPasspword
  );
});

test("test update private passphrase, DEX is active, but dex account is null", async () => {
  const user = userEvent.setup();
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings,
      dex: {
        active: true
      }
    }
  });
  await user.click(screen.getByText("Privacy and Security"));
  const updateButton = screen.getByRole("button", {
    name: "Update Private Passphrase"
  });
  await user.click(updateButton);
  expect(
    screen.queryByLabelText(/^DEX App Passsword/i)
  ).not.toBeInTheDocument();
});

test("test update private passphrase, DEX is active, but dex account is empty string", async () => {
  const user = userEvent.setup();
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings,
      dex: {
        active: true
      },
      walletLoader: {
        dexAccount: ""
      }
    }
  });
  await user.click(screen.getByText("Privacy and Security"));
  const updateButton = screen.getByRole("button", {
    name: "Update Private Passphrase"
  });
  await user.click(updateButton);
  expect(
    screen.queryByLabelText(/^DEX App Passsword/i)
  ).not.toBeInTheDocument();
});

test("update private passphrase is disabled", async () => {
  const user = userEvent.setup();
  mockIsChangePassPhraseDisabled = selectors.isChangePassPhraseDisabled =
    jest.fn(() => true);
  render(<SettingsPage />, {
    initialState: {
      settings: testSettings
    }
  });
  await user.click(screen.getByText("Privacy and Security"));
  expect(mockIsChangePassPhraseDisabled).toHaveBeenCalled();
  await user.click(
    screen.getByRole("button", { name: "Update Private Passphrase" })
  );
  expect(screen.queryByText("Change your passphrase")).not.toBeInTheDocument();
});

test("renders settings with trezor enabled", () => {
  const mockIsTrezor = (selectors.isTrezor = jest.fn(() => true));
  render(<SettingsPage />);
  expect(screen.getByText("Trezor")).toBeInTheDocument();
  expect(mockIsTrezor).toHaveBeenCalled();
  mockIsTrezor.mockRestore();
});

test("renders settings with trezor is NOT enabled", () => {
  const mockIsTrezor = (selectors.isTrezor = jest.fn(() => false));
  render(<SettingsPage />);
  expect(screen.queryByText("Trezor")).not.toBeInTheDocument();
  expect(mockIsTrezor).toHaveBeenCalled();
  mockIsTrezor.mockRestore();
});

test("test proxy settings", async () => {
  const user = userEvent.setup();
  render(<SettingsPage />, { initialState: { settings: testSettings } });

  // set proxy type
  const inputControl = screen.getByLabelText("Proxy Type");
  const oldValue = "HTTP";
  const option = "PAC";
  const inputValueSpan = getOptionByNameAndType(oldValue, "singleValue");
  expect(
    screen.queryByRole("button", {
      name: "Save proxy settings"
    })
  ).not.toBeInTheDocument();
  expect(inputValueSpan.textContent).toMatch(oldValue);
  const changeFn = async () => {
    await user.click(inputControl);
    await user.click(getOptionByNameAndType(option, "option"));
  };
  await changeFn();

  // set proxy location
  const proxyLocationInputControl = screen.getByLabelText("Proxy Location");
  expect(proxyLocationInputControl.value).toMatch(testDefaultProxyLocation);
  await user.clear(proxyLocationInputControl);
  await user.type(proxyLocationInputControl, testProxyLocation);
  // press enter
  fireEvent.keyDown(proxyLocationInputControl, { key: "enter", keyCode: 13 });

  await user.click(screen.getByRole("button", { name: "Save proxy settings" }));
  await waitFor(() => screen.getByText("Reset required"));
  await user.click(screen.getByRole("button", { name: "Confirm" }));

  await waitFor(() =>
    expect(mockSaveSettings).toHaveBeenCalledWith({
      ...testCurrentSettings,
      ...{ proxyType: PROXYTYPE_PAC, proxyLocation: testProxyLocation }
    })
  );
});
