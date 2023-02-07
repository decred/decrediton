import { ConnectPage } from "components/views/LNPage/ConnectPage";
import { render } from "test-utils.js";
import { screen, waitFor, fireEvent } from "@testing-library/react";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import * as lna from "actions/LNActions";
import { DCR } from "constants";
const GETNEXTADDRESS_SUCCESS = "GETNEXTADDRESS_SUCCESS";
import { mockChannels, mockPendingChannels, mockClosedChannels } from "./mocks";

const mockMixedAccountValue = 6;
const mockDefaultAccount = {
  hidden: false,
  label: "default: 19 DCR",
  name: "default",
  spendable: 1900000000,
  spendableAndUnit: "19 DCR",
  total: 1900000000,
  value: 0
};
const mockLnAccount = {
  hidden: false,
  label: "ln account: 0.0000000 DCR",
  name: "ln account",
  spendable: 0,
  spendableAndUnit: "0.00000 DCR",
  total: 0,
  value: 3
};
const mockMixedAccount = {
  hidden: false,
  label: "mixed: 249.79547928 DCR",
  name: "mixed",
  spendable: 24979547928,
  spendableAndUnit: "249.79547928 DCR",
  total: 24979547928,
  value: mockMixedAccountValue
};
const mockVisibleAccounts = [
  mockDefaultAccount,
  mockMixedAccount,
  mockLnAccount
];
const mockSpendingAccounts = [
  mockDefaultAccount,
  mockMixedAccount,
  mockLnAccount
];
const mockFilePath = "mock-file-path";
const mockPrivatePassphrase = "mock-private-passphrase";

const selectors = sel;
const lnActions = lna;
const controlActions = ca;

let mockStartDcrlnd;

beforeEach(() => {
  selectors.lnPendingChannels = jest.fn(() => mockPendingChannels);
  selectors.lnClosedChannels = jest.fn(() => mockClosedChannels);
  selectors.lnChannels = jest.fn(() => mockChannels);
  selectors.lnWalletExists = jest.fn(() => false);
  selectors.defaultSpendingAccount = jest.fn(() => mockDefaultAccount);
  selectors.visibleAccounts = jest.fn(() => mockVisibleAccounts);
  selectors.spendingAccounts = jest.fn(() => mockSpendingAccounts);
  selectors.getMixedAccount = jest.fn(() => mockMixedAccountValue);
  selectors.currencyDisplay = jest.fn(() => DCR);
  mockStartDcrlnd = lnActions.startDcrlnd = jest.fn(() => () => {});
  selectors.nextAddressAccount = jest.fn(() => mockDefaultAccount);
  selectors.nextAddress = jest.fn(() => "mock-next-address");
  controlActions.getNextAddressAttempt = jest.fn(() => (dispatch) => {
    const res = {
      address: "mock-next-address",
      accountNumber: mockLnAccount.value
    };
    dispatch({
      getNextAddressResponse: res,
      type: GETNEXTADDRESS_SUCCESS
    });
    Promise.resolve(res);
  });
});

const getUnderstandButton = () =>
  screen.getByRole("button", { name: "I understand and accept the risks" });
const queryUnderstandButton = () =>
  screen.queryByRole("button", { name: "I understand and accept the risks" });
const getCreateNewWalletAccountToggle = () =>
  screen.getByText("Create New Wallet account");
const getUseExistingWalletAccountToggle = () =>
  screen.getByText("Use Existing Wallet Account");
const queryCreateNewWalletAccountToggle = () =>
  screen.queryByText("Create New Wallet account");
const queryUseExistingWalletAccountToggle = () =>
  screen.queryByText("Use Existing Wallet Account");
const getSCBBackupFileInput = () => screen.getByLabelText("Restore SCB backup");
const querySCBBackupFileInput = () =>
  screen.queryByLabelText("Restore SCB backup");
const getSubmitButton = () =>
  screen.getByRole("button", { name: "Start and Unlock LN Wallet" });
const getPrivatePasshpraseInput = () =>
  screen.getByLabelText(/private passphrase/i);
const getContinueButton = () =>
  screen.getByRole("button", { name: "Continue" });
const getCanceButton = () => screen.getByRole("button", { name: "Cancel" });
const getAuotPilotToggleSwitch = () => screen.getByTestId("switch");

// go through the warning cards and click on understand button
const goToCreateWalletView = async (user) => {
  const nextButton = screen.getByRole("button", { name: "Next" });
  for (let i = 0; i < 5; i++) {
    await user.click(nextButton);
  }
  await user.click(getUnderstandButton());
};

test("ln wallet exists", async () => {
  selectors.lnWalletExists = jest.fn(() => true);
  const { user } = render(<ConnectPage />);
  expect(queryUnderstandButton()).not.toBeInTheDocument();
  expect(queryCreateNewWalletAccountToggle()).not.toBeInTheDocument();
  expect(queryUseExistingWalletAccountToggle()).not.toBeInTheDocument();
  expect(querySCBBackupFileInput()).not.toBeInTheDocument();

  await user.click(getSubmitButton());
  await user.type(getPrivatePasshpraseInput(), mockPrivatePassphrase);
  await user.click(getContinueButton());
  expect(mockStartDcrlnd).toHaveBeenCalledWith(
    mockPrivatePassphrase,
    false /*autopilot not enabled*/,
    null /*no account has been selected*/,
    "" /*no scb file path has been selected*/
  );
});

test("test create new new account", async () => {
  const { user } = render(<ConnectPage />);
  await goToCreateWalletView(user);

  expect(screen.getByText("Lightning Transactions")).toBeInTheDocument();
  expect(
    screen.getByText("Start, unlock and connect to the dcrlnd wallet.")
  ).toBeInTheDocument();

  await user.type(getSCBBackupFileInput(), mockFilePath);

  await user.click(getSubmitButton());
  expect(screen.getByText("Unlock LN Wallet")).toBeInTheDocument();

  //click on cancel first
  await user.click(getCanceButton());
  expect(screen.queryByText("Unlock LN Wallet")).not.toBeInTheDocument();

  await user.click(getSubmitButton());
  await user.type(getPrivatePasshpraseInput(), mockPrivatePassphrase);
  await user.click(getContinueButton());
  expect(mockStartDcrlnd).toHaveBeenCalledWith(
    mockPrivatePassphrase,
    false /*autopilot not enabled*/,
    "**create ln account**",
    mockFilePath
  );
});

test("test text toggles", async () => {
  const { user } = render(<ConnectPage />);
  await goToCreateWalletView(user);

  expect(screen.queryByText(/attention:/i)).not.toBeInTheDocument();
  await user.click(getUseExistingWalletAccountToggle());
  await waitFor(() => screen.getByText(/attention:/i));

  // go back
  await user.click(getCreateNewWalletAccountToggle());
  await waitFor(() =>
    expect(screen.queryByText(/attention:/i)).not.toBeInTheDocument()
  );
});

test("test automatic channel creation", async () => {
  const { user } = render(<ConnectPage />);
  await goToCreateWalletView(user);

  await user.click(getAuotPilotToggleSwitch());
  await user.click(getSubmitButton());
  await user.type(getPrivatePasshpraseInput(), mockPrivatePassphrase);
  await user.click(getContinueButton());
  expect(mockStartDcrlnd).toHaveBeenCalledWith(
    mockPrivatePassphrase,
    true /*autopilot enabled*/,
    "**create ln account**",
    "" /*file path*/
  );
});

test("test use existing account", async () => {
  const { user } = render(<ConnectPage />);
  await goToCreateWalletView(user);

  expect(screen.queryByText(/attention:/i)).not.toBeInTheDocument();
  fireEvent.click(getUseExistingWalletAccountToggle());
  await waitFor(() => screen.getByText(/attention:/i));

  await user.click(screen.getByText(mockDefaultAccount.name));
  await user.click(screen.getByText(mockLnAccount.name));

  fireEvent.click(getSubmitButton());
  await user.type(getPrivatePasshpraseInput(), mockPrivatePassphrase);
  fireEvent.click(getContinueButton());
  expect(mockStartDcrlnd).toHaveBeenCalledWith(
    mockPrivatePassphrase,
    false /*autopilot not enabled*/,
    mockLnAccount.value,
    "" /*file path*/
  );
});

test("test disabled submit button", async () => {
  selectors.getRunningIndicator = jest.fn(() => true);
  const { user } = render(<ConnectPage />);
  await goToCreateWalletView(user);

  expect(getSubmitButton().disabled).toBe(true);
  expect(
    screen.getByText(
      /Privacy Mixer, Autobuyer or Purchase Ticket Attempt running, please shut them off before unlock LN Wallet./i
    )
  ).toBeInTheDocument();

  await user.click(getSubmitButton());
  expect(mockStartDcrlnd).not.toHaveBeenCalled();
});

const tabShouldBeInactive = (tab) =>
  expect(tab.firstElementChild.firstElementChild.className).not.toMatch(
    "active"
  );
const tabShouldBeUnchecked = (tab) =>
  expect(tab.firstElementChild.firstElementChild.className).not.toMatch(
    "visited"
  );
const tabShouldBeActive = (tab) =>
  expect(tab.firstElementChild.firstElementChild.className).toMatch("active");
const tabShouldBeChecked = (tab) =>
  expect(tab.firstElementChild.firstElementChild.className).toMatch("visited");

test("test warning view", async () => {
  render(<ConnectPage />);

  const understandButton = getUnderstandButton();
  const nextButton = screen.getByRole("button", { name: "Next" });
  const previousButton = screen.getByRole("button", { name: "Previous" });
  const previousArrowButton = screen.getByRole("button", {
    name: "Previous arrow"
  });
  const nextArrowButton = screen.getByRole("button", { name: "Next arrow" });

  const tab1 = screen.getByTestId("tab-0");
  const tab2 = screen.getByTestId("tab-1");
  const tab3 = screen.getByTestId("tab-2");
  const tab4 = screen.getByTestId("tab-3");
  const tab5 = screen.getByTestId("tab-4");
  const tab6 = screen.getByTestId("tab-5");

  // initial state
  expect(understandButton.disabled).toBe(true);
  expect(tab1.textContent).toBe("1/6Important");
  expect(tab2.textContent).toBe("2/6Lightning is a 2nd Layer Network");
  expect(tab3.textContent).toBe("3/6Staying Online");
  expect(tab4.textContent).toBe("4/6Watchtower Service");
  expect(tab5.textContent).toBe("5/6Channels and Confirmations");
  expect(tab6.textContent).toBe("6/6Unlocked During Operations");
  expect(previousButton.className).toMatch("disabled");
  expect(previousArrowButton.className).toMatch("disabled");

  tabShouldBeActive(tab1);
  tabShouldBeUnchecked(tab1);
  tabShouldBeInactive(tab2);
  tabShouldBeUnchecked(tab2);
  tabShouldBeInactive(tab3);
  tabShouldBeUnchecked(tab3);
  tabShouldBeInactive(tab4);
  tabShouldBeUnchecked(tab4);
  tabShouldBeInactive(tab5);
  tabShouldBeUnchecked(tab5);
  tabShouldBeInactive(tab6);
  tabShouldBeUnchecked(tab6);

  // clicking on previousButton in vain
  fireEvent.click(previousButton);
  await waitFor(() => {
    tabShouldBeActive(tab1);
    tabShouldBeUnchecked(tab1);
    tabShouldBeInactive(tab2);
    tabShouldBeUnchecked(tab2);
    tabShouldBeInactive(tab3);
    tabShouldBeUnchecked(tab3);
    tabShouldBeInactive(tab4);
    tabShouldBeUnchecked(tab4);
    tabShouldBeInactive(tab5);
    tabShouldBeUnchecked(tab5);
    tabShouldBeInactive(tab6);
    tabShouldBeUnchecked(tab6);
  });

  // clicking on previousArrowButton in vain
  fireEvent.click(previousArrowButton);

  await waitFor(() => {
    tabShouldBeActive(tab1);
    tabShouldBeUnchecked(tab1);
    tabShouldBeInactive(tab2);
    tabShouldBeUnchecked(tab2);
    tabShouldBeInactive(tab3);
    tabShouldBeUnchecked(tab3);
    tabShouldBeInactive(tab4);
    tabShouldBeUnchecked(tab4);
    tabShouldBeInactive(tab5);
    tabShouldBeUnchecked(tab5);
    tabShouldBeInactive(tab6);
    tabShouldBeUnchecked(tab6);
  });

  // move on to the second tab
  fireEvent.click(nextButton);
  await waitFor(() => {
    tabShouldBeInactive(tab1);
    tabShouldBeChecked(tab1);
    tabShouldBeActive(tab2);
    tabShouldBeUnchecked(tab2);
    tabShouldBeInactive(tab3);
    tabShouldBeUnchecked(tab3);
    tabShouldBeInactive(tab4);
    tabShouldBeUnchecked(tab4);
    tabShouldBeInactive(tab5);
    tabShouldBeUnchecked(tab5);
    tabShouldBeInactive(tab6);
    tabShouldBeUnchecked(tab6);
    expect(previousButton.className).not.toMatch("disabled");
    expect(previousArrowButton.className).not.toMatch("disabled");
    expect(understandButton.disabled).toBe(true);
  });

  // move on to the third tab click on the next arrow
  fireEvent.click(nextArrowButton);
  await waitFor(() => {
    tabShouldBeInactive(tab1);
    tabShouldBeChecked(tab1);
    tabShouldBeInactive(tab2);
    tabShouldBeChecked(tab2);
    tabShouldBeActive(tab3);
    tabShouldBeUnchecked(tab3);
    tabShouldBeInactive(tab4);
    tabShouldBeUnchecked(tab4);
    tabShouldBeInactive(tab5);
    tabShouldBeUnchecked(tab5);
    tabShouldBeInactive(tab6);
    tabShouldBeUnchecked(tab6);
    expect(previousButton.className).not.toMatch("disabled");
    expect(previousArrowButton.className).not.toMatch("disabled");
    expect(understandButton.disabled).toBe(true);
  });

  // move on to the fourth tab
  fireEvent.click(nextArrowButton);
  await waitFor(() => {
    tabShouldBeInactive(tab1);
    tabShouldBeChecked(tab1);
    tabShouldBeInactive(tab2);
    tabShouldBeChecked(tab2);
    tabShouldBeInactive(tab3);
    tabShouldBeChecked(tab3);
    tabShouldBeActive(tab4);
    tabShouldBeUnchecked(tab4);
    tabShouldBeInactive(tab5);
    tabShouldBeUnchecked(tab5);
    tabShouldBeInactive(tab6);
    tabShouldBeUnchecked(tab6);
    expect(previousButton.className).not.toMatch("disabled");
    expect(previousArrowButton.className).not.toMatch("disabled");
    expect(understandButton.disabled).toBe(true);
  });

  // move on to the fifth tab
  fireEvent.click(nextButton);
  await waitFor(() => {
    tabShouldBeInactive(tab1);
    tabShouldBeChecked(tab1);
    tabShouldBeInactive(tab2);
    tabShouldBeChecked(tab2);
    tabShouldBeInactive(tab3);
    tabShouldBeChecked(tab3);
    tabShouldBeInactive(tab4);
    tabShouldBeChecked(tab4);
    tabShouldBeActive(tab5);
    tabShouldBeUnchecked(tab5);
    tabShouldBeInactive(tab6);
    tabShouldBeUnchecked(tab6);
    expect(previousButton.className).not.toMatch("disabled");
    expect(previousArrowButton.className).not.toMatch("disabled");
    expect(understandButton.disabled).toBe(true);
  });

  // move on to the final tab
  fireEvent.click(nextButton);
  await waitFor(() => {
    tabShouldBeInactive(tab1);
    tabShouldBeChecked(tab1);
    tabShouldBeInactive(tab2);
    tabShouldBeChecked(tab2);
    tabShouldBeInactive(tab3);
    tabShouldBeChecked(tab3);
    tabShouldBeInactive(tab4);
    tabShouldBeChecked(tab4);
    tabShouldBeInactive(tab5);
    tabShouldBeChecked(tab5);
    tabShouldBeActive(tab6);
    tabShouldBeChecked(tab6);
    expect(previousButton.className).not.toMatch("disabled");
    expect(previousArrowButton.className).not.toMatch("disabled");
    expect(understandButton.disabled).toBe(false);
    expect(nextButton.className).toMatch("disabled");
    expect(nextArrowButton.className).toMatch("disabled");
  });
  // clicking on nextButton in vain
  fireEvent.click(nextButton);
  await waitFor(() => {
    tabShouldBeInactive(tab1);
    tabShouldBeChecked(tab1);
    tabShouldBeInactive(tab2);
    tabShouldBeChecked(tab2);
    tabShouldBeInactive(tab3);
    tabShouldBeChecked(tab3);
    tabShouldBeInactive(tab4);
    tabShouldBeChecked(tab4);
    tabShouldBeInactive(tab5);
    tabShouldBeChecked(tab5);
    tabShouldBeActive(tab6);
    tabShouldBeChecked(tab6);
    expect(previousButton.className).not.toMatch("disabled");
    expect(previousArrowButton.className).not.toMatch("disabled");
    expect(understandButton.disabled).toBe(false);
    expect(nextButton.className).toMatch("disabled");
    expect(nextArrowButton.className).toMatch("disabled");
  });

  // clicking on nextArrowButton in vain
  fireEvent.click(nextButton);
  await waitFor(() => {
    tabShouldBeInactive(tab1);
    tabShouldBeChecked(tab1);
    tabShouldBeInactive(tab2);
    tabShouldBeChecked(tab2);
    tabShouldBeInactive(tab3);
    tabShouldBeChecked(tab3);
    tabShouldBeInactive(tab4);
    tabShouldBeChecked(tab4);
    tabShouldBeInactive(tab5);
    tabShouldBeChecked(tab5);
    tabShouldBeActive(tab6);
    tabShouldBeChecked(tab6);
    expect(previousButton.className).not.toMatch("disabled");
    expect(previousArrowButton.className).not.toMatch("disabled");
    expect(understandButton.disabled).toBe(false);
    expect(nextButton.className).toMatch("disabled");
    expect(nextArrowButton.className).toMatch("disabled");
  });

  // move back to the fifth tab
  fireEvent.click(previousButton);
  await waitFor(() => {
    tabShouldBeInactive(tab1);
    tabShouldBeChecked(tab1);
    tabShouldBeInactive(tab2);
    tabShouldBeChecked(tab2);
    tabShouldBeInactive(tab3);
    tabShouldBeChecked(tab3);
    tabShouldBeInactive(tab4);
    tabShouldBeChecked(tab4);
    tabShouldBeActive(tab5);
    tabShouldBeChecked(tab5);
    tabShouldBeInactive(tab6);
    tabShouldBeChecked(tab6);
    expect(previousButton.className).not.toMatch("disabled");
    expect(previousArrowButton.className).not.toMatch("disabled");
    expect(understandButton.disabled).toBe(false);
    expect(nextButton.className).not.toMatch("disabled");
    expect(nextArrowButton.className).not.toMatch("disabled");
  });

  // move back to the fourth tab clicking on the arrow button
  fireEvent.click(previousArrowButton);
  await waitFor(() => {
    tabShouldBeInactive(tab1);
    tabShouldBeChecked(tab1);
    tabShouldBeInactive(tab2);
    tabShouldBeChecked(tab2);
    tabShouldBeInactive(tab3);
    tabShouldBeChecked(tab3);
    tabShouldBeActive(tab4);
    tabShouldBeChecked(tab4);
    tabShouldBeInactive(tab5);
    tabShouldBeChecked(tab5);
    tabShouldBeInactive(tab6);
    tabShouldBeChecked(tab6);
    expect(previousButton.className).not.toMatch("disabled");
    expect(previousArrowButton.className).not.toMatch("disabled");
    expect(understandButton.disabled).toBe(false);
    expect(nextButton.className).not.toMatch("disabled");
    expect(nextArrowButton.className).not.toMatch("disabled");
    expect(screen.getByText(/before you continue/i)).toBeInTheDocument();
  });

  fireEvent.click(understandButton);
  await waitFor(() => {
    expect(screen.queryByText(/before you continue/i)).not.toBeInTheDocument();
    expect(screen.getByText(/create new wallet account/i)).toBeInTheDocument();
  });
});
