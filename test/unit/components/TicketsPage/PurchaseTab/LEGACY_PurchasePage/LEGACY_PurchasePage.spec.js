import Purchase from "../../../../../../app/components/views/TicketsPage/PurchaseTab/PurchaseTab.jsx";
import TicketAutoBuyer from "../../../../../../app/components/views/TicketsPage/PurchaseTab/LEGACY_PurchasePage/LEGACY_TicketAutoBuyer";
import { render } from "test-utils.js";
import user from "@testing-library/user-event";
import { fireEvent } from "@testing-library/react";
import { screen } from "@testing-library/react";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import * as spa from "actions/VSPActions";
import { DCR } from "constants";
import { MIN_RELAY_FEE } from "constants";

const mockVotedTicketsCount = 3;
const mockOwnMempoolTicketsCount = 5;
const mockRevokedTicketsCount = 7;
const mockImmatureTicketsCount = 6;
const mockLiveTicketsCount = 7;
const mockUnspentTicketsCount = 2;
const mockTotalSubsidy = 400000000;
const mockIsSPV = false;
const mockLastVotedTicket = null;
const mockCurrencyDisplay = DCR;
const mockUnconfiguredStakePools = [
  {
    APIVersionsSupported: [1, 2],
    Host: "https://test-stakepool.eu",
    Network: "testnet",
    isVersionValid: true,
    label: "https://test-stakepool.eu",
    value: {
      APIVersionsSupported: [1, 2],
      Host: "https://test-stakepool.eu",
      Network: "testnet"
    }
  },
  {
    APIVersionsSupported: [1, 2],
    Host: "https://test-stakepool2.eu",
    Network: "testnet",
    isVersionValid: true,
    label: "https://test-stakepool2.eu",
    value: {
      APIVersionsSupported: [1, 2],
      Host: "https://test-stakepool2.eu",
      Network: "testnet"
    }
  },
  {
    APIVersionsSupported: [1, 2],
    Host: "https://test-stakepool3.eu",
    Network: "testnet",
    isVersionValid: true,
    label: "https://test-stakepool3.eu",
    value: {
      APIVersionsSupported: [1, 2],
      Host: "https://test-stakepool3.eu",
      Network: "testnet"
    }
  }
];
const mockConfiguredStakePools = [
  {
    APIVersionsSupported: [1, 2],
    ApiKey: "test-api-key1",
    Host: "https://test-stakepool1.eu",
    Network: "testnet",
    PoolAddress: "test-address-1",
    PoolFees: 2,
    Script: "test-script-1",
    TicketAddress: "test-ticket-address-1",
    VoteBits: 5,
    VoteBitsVersion: 0,
    VoteChoices: [{ agendaId: "treasury", choiceId: "yes" }],
    isVersionValid: true,
    label: "https://test-stakepool1.eu",
    value: {
      APIVersionsSupported: [1, 2],
      ApiKey: "test-api-key1",
      Host: "https://test-stakepool1.eu",
      Network: "testnet",
      PoolAddress: "test-address-1",
      PoolFees: 2,
      Script: "test-script-1",
      TicketAddress: "test-ticket-address-1",
      VoteBits: 5,
      VoteBitsVersion: 0,
      VoteChoices: [{ agendaId: "treasury", choiceId: "yes" }]
    }
  },
  {
    APIVersionsSupported: [1, 2],
    ApiKey: "test-api-key2",
    Host: "https://test-stakepool2.eu",
    Network: "testnet",
    PoolAddress: "test-address2",
    PoolFees: 4,
    Script: "test-script-2",
    TicketAddress: "test-ticket-address-2",
    VoteBits: 5,
    VoteBitsVersion: 0,
    VoteChoices: [{ agendaId: "treasury", choiceId: "yes" }],
    isVersionValid: true,
    label: "https://test-stakepool2.eu",
    value: {
      APIVersionsSupported: [1, 2],
      ApiKey: "test-api-key2",
      Host: "https://test-stakepool2.eu",
      Network: "testnet",
      PoolAddress: "test-address-2",
      PoolFees: 4,
      Script: "test-script-2",
      TicketAddress: "test-ticket-address-2",
      VoteBits: 5,
      VoteBitsVersion: 0,
      VoteChoices: [{ agendaId: "treasury", choiceId: "yes" }]
    }
  }
];
const mockMixedAccountValue = 6;
const mockMixedAccount = {
  hidden: false,
  label: "mixed: 249.79547928 DCR",
  name: "mixed",
  spendable: 24979547928,
  spendableAndUnit: "249.79547928 DCR",
  total: 24979547928,
  value: mockMixedAccountValue
};
const mockPassphrase = "test-passphrase";
const initialState = {
  initialState: {
    stakepool: {
      selectedStakePool: mockConfiguredStakePools[0]
    },
    control: {
      numTicketsToBuy: 1
    }
  }
};
const selectors = sel;
const controlActions = ca;
const spActions = spa;

let mockPurchaseTicketsAttempt;
let mockDismissBackupRedeemScript;
let mockRevokeTicketsAttempt;
let mockStartTicketBuyerV2Attempt;
let mockIsTicketAutoBuyerEnabled;
let mockTicketBuyerV2Cancel;
let mockGetRunningIndicator;
let mockAddCustomStakePool;

beforeEach(() => {
  sel.getIsLegacy = jest.fn(() => true);
  sel.stakePoolListingEnabled = jest.fn(() => true);
  sel.unconfiguredStakePools = jest.fn(() => mockUnconfiguredStakePools);
  sel.spendingAccounts = jest.fn(() => [mockMixedAccount]);
  sel.visibleAccounts = jest.fn(() => [mockMixedAccount]);
  sel.getMixedAccount = jest.fn(() => mockMixedAccountValue);
  sel.configuredStakePools = jest.fn(() => mockConfiguredStakePools);
  sel.defaultSpendingAccount = jest.fn(() => mockMixedAccount);
  //stakeInfo
  selectors.votedTicketsCount = jest.fn(() => mockVotedTicketsCount);
  selectors.ownMempoolTicketsCount = jest.fn(() => mockOwnMempoolTicketsCount);
  selectors.revokedTicketsCount = jest.fn(() => mockRevokedTicketsCount);
  selectors.immatureTicketsCount = jest.fn(() => mockImmatureTicketsCount);
  selectors.liveTicketsCount = jest.fn(() => mockLiveTicketsCount);
  selectors.unspentTicketsCount = jest.fn(() => mockUnspentTicketsCount);
  selectors.totalSubsidy = jest.fn(() => mockTotalSubsidy);
  selectors.isSPV = jest.fn(() => mockIsSPV);
  selectors.lastVotedTicket = jest.fn(() => mockLastVotedTicket);
  selectors.currencyDisplay = jest.fn(() => mockCurrencyDisplay);

  mockPurchaseTicketsAttempt = controlActions.purchaseTicketsAttempt = jest.fn(
    () => () => {}
  );
  mockDismissBackupRedeemScript = spActions.dismissBackupRedeemScript = jest.fn(
    () => () => {}
  );
  mockAddCustomStakePool = spActions.addCustomStakePool = jest.fn(() => () =>
    Promise.resolve()
  );
  mockRevokeTicketsAttempt = controlActions.revokeTicketsAttempt = jest.fn(
    () => () => {}
  );
  mockStartTicketBuyerV2Attempt = controlActions.startTicketBuyerV2Attempt = jest.fn(
    () => () => {}
  );
  mockIsTicketAutoBuyerEnabled = selectors.isTicketAutoBuyerEnabled = jest.fn(
    () => false
  );
  mockTicketBuyerV2Cancel = controlActions.ticketBuyerV2Cancel = jest.fn(
    () => () => {}
  );
  mockGetRunningIndicator = selectors.getRunningIndicator = jest.fn(
    () => false
  );
});

test("render LEGACY_PurchasePage", () => {
  render(<Purchase />, initialState);
  expect(
    screen.getByText("Current VSP").nextElementSibling.textContent
  ).toMatch(mockConfiguredStakePools[0].Host);
  expect(screen.getByText("Ticket Fee").nextElementSibling.textContent).toMatch(
    `${MIN_RELAY_FEE} DCR/KB`
  );
  expect(screen.getByText("Tx Fee").nextElementSibling.textContent).toMatch(
    `${MIN_RELAY_FEE} DCR/KB`
  );
  expect(screen.getByText("Expiry").nextElementSibling.textContent).toMatch(
    "16 Blocks"
  );
  expect(screen.getByText("VSP Fee").nextElementSibling.textContent).toMatch(
    `${mockConfiguredStakePools[0].value.PoolFees}%`
  );
  expect(
    screen.getByText("VSP Address").nextElementSibling.textContent
  ).toMatch(mockConfiguredStakePools[0].value.PoolAddress);
  expect(
    screen.getByText("Ticket Address").nextElementSibling.textContent
  ).toMatch(mockConfiguredStakePools[0].value.TicketAddress);

  // test advanced settings
  const ticketCogsButton = screen.getByRole("button", {
    name: "Show advanced settings"
  });
  expect(ticketCogsButton.className).toMatch(/opened/i);
  user.click(ticketCogsButton);
  expect(ticketCogsButton.className).toMatch(/closed/i);

  const ticketFeeInput = screen.getByLabelText("Ticket Fee:");
  const txFeeInput = screen.getByLabelText("Tx Fee:");
  const expiryInput = screen.getByLabelText("Expiry:");
  expect(ticketFeeInput.value).toMatch(`${MIN_RELAY_FEE}`);
  expect(txFeeInput.value).toMatch(`${MIN_RELAY_FEE}`);
  expect(expiryInput.value).toMatch("16");
  expect(screen.getByLabelText("Ticket Address:").value).toMatch(
    mockConfiguredStakePools[0].value.TicketAddress
  );
  expect(screen.getByLabelText("VSP Address:").value).toMatch(
    mockConfiguredStakePools[0].value.PoolAddress
  );
  expect(screen.getByLabelText("VSP Fees:").value).toMatch(
    `${mockConfiguredStakePools[0].value.PoolFees}`
  );

  // change stakepool
  const stakePoolSelectOption = screen.getAllByRole("option", {
    name: mockConfiguredStakePools[0].Host
  })[0];

  user.click(stakePoolSelectOption);
  user.click(
    screen.getByRole("option", { name: mockConfiguredStakePools[1].Host })
  );

  // changed values
  expect(screen.getByLabelText("Ticket Address:").value).toMatch(
    mockConfiguredStakePools[1].value.TicketAddress
  );
  expect(screen.getByLabelText("VSP Address:").value).toMatch(
    mockConfiguredStakePools[1].value.PoolAddress
  );
  expect(screen.getByLabelText("VSP Fees:").value).toMatch(
    `${mockConfiguredStakePools[1].value.PoolFees}`
  );

  // change ticket fee
  const mockValidTicketFee = "0.0002";
  user.type(ticketFeeInput, "invalid-string-value");
  expect(screen.getByText("Invalid ticket fee")).toBeInTheDocument();
  user.clear(ticketFeeInput);
  expect(screen.getByText("This field is required")).toBeInTheDocument();
  user.type(ticketFeeInput, mockValidTicketFee);
  expect(screen.queryByText("Invalid ticket fee")).not.toBeInTheDocument();
  expect(screen.queryByText("This field is required")).not.toBeInTheDocument();

  // change tx fee
  const mockValidTxFee = "0.0003";
  user.type(txFeeInput, "invalid-string-value");
  expect(screen.getByText("Invalid tx fee")).toBeInTheDocument();
  user.clear(txFeeInput);
  expect(screen.getByText("This field is required")).toBeInTheDocument();
  user.type(txFeeInput, mockValidTxFee);
  expect(screen.queryByText("Invalid tx fee")).not.toBeInTheDocument();
  expect(screen.queryByText("This field is required")).not.toBeInTheDocument();

  // change exipry fee
  const mockExpiry = "30";
  user.clear(expiryInput);
  expect(screen.getByText("This field is required")).toBeInTheDocument();
  user.type(expiryInput, mockExpiry);
  expect(screen.queryByText("This field is required")).not.toBeInTheDocument();

  const purchaseButton = screen.getByText("Purchase");
  user.click(purchaseButton);
  user.type(screen.getByLabelText("Private Passphrase:"), mockPassphrase);
  user.click(screen.getByText("Continue"));
  expect(mockPurchaseTicketsAttempt).toHaveBeenCalledWith(
    mockPassphrase,
    mockMixedAccount.value,
    mockMixedAccount.spendable,
    0,
    1,
    mockExpiry,
    mockValidTicketFee,
    mockValidTxFee,
    mockConfiguredStakePools[1].value
  );

  // test amount input
  const inputTag = screen.getByLabelText("Amount:");

  const moreButton = screen.getByRole("button", { name: "more" });
  user.click(moreButton);
  expect(inputTag.value).toBe("2");

  const lessButton = screen.getByRole("button", { name: "less" });
  user.click(lessButton);
  expect(inputTag.value).toBe("1");
  // remain 1
  user.click(lessButton);
  expect(inputTag.value).toBe("1");

  /* test arrow key */
  fireEvent.keyDown(inputTag, { keyCode: 38 });
  expect(inputTag.value).toBe("2");
  fireEvent.keyDown(inputTag, { keyCode: 40 });
  expect(inputTag.value).toBe("1");

  user.clear(inputTag);
  expect(inputTag.value).toBe("");

  // "" => 1
  user.click(moreButton);
  expect(inputTag.value).toBe("1");

  // not enough funds
  mockPurchaseTicketsAttempt.mockReset();
  user.type(inputTag, "100000000");
  user.click(purchaseButton);
  expect(mockPurchaseTicketsAttempt).not.toHaveBeenCalled();

  //close advanced panel
  user.click(ticketCogsButton);
  expect(ticketCogsButton.className).toMatch(/opened/i);

  // backup redeem script
  user.click(screen.getByText("Backup Redeem Scripts"));
  expect(screen.getByText("Configured VSPs")).toBeInTheDocument();

  // try to add add custom VSP
  user.click(screen.getByText("Add VSP"));
  const testStakePoolHost = "test-stakepool-host";
  user.type(screen.getByRole("combobox"), testStakePoolHost);
  user.click(screen.getByRole("option", { name: testStakePoolHost }));
  expect(mockAddCustomStakePool).toHaveBeenCalledWith(testStakePoolHost);

  user.click(screen.getByText("Cancel"));
  expect(screen.getByText("Purchase Tickets")).toBeInTheDocument();

  // dismiss backup redeem script message
  user.click(screen.getByText("Dismiss Message"));
  expect(
    screen.getByText(/are you sure you want to dismiss/i)
  ).toBeInTheDocument();
  // cancel first
  user.click(screen.getByText("Cancel"));
  // try again
  user.click(screen.getByText("Dismiss Message"));
  user.click(screen.getByText("Confirm"));
  expect(mockDismissBackupRedeemScript).toHaveBeenCalled();

  // revoke
  user.click(screen.getByText("Revoke"));
  expect(screen.getByText(/revoke tickets confirmation/i)).toBeInTheDocument();
  // cancel first
  user.click(screen.getByText("Cancel"));
  // try again
  user.click(screen.getByText("Revoke"));
  user.type(screen.getByLabelText("Private Passphrase:"), mockPassphrase);
  user.click(screen.getByText("Continue"));
  expect(mockRevokeTicketsAttempt).toHaveBeenCalledWith(mockPassphrase);
});

test("test legacy autobuyer", () => {
  render(<TicketAutoBuyer />, initialState);
  const settingsButton = screen.getByRole("button", {
    name: "Ticket Autobuyer Settings"
  });
  user.click(settingsButton);
  const saveButton = screen.getByRole("button", { name: "Save" });
  user.click(saveButton);
  expect(screen.getByText("Fill all fields.")).toBeInTheDocument();
  const mockBalanceToMaintain = 14;
  user.type(
    screen.getByLabelText(/Balance to Maintain/i),
    `${mockBalanceToMaintain}`
  );

  user.click(saveButton);
  expect(screen.getByText("Fill all fields.")).toBeInTheDocument();
  // set stakepool
  user.click(screen.getByText("Select VSP..."));
  user.click(
    screen.getByRole("option", { name: mockConfiguredStakePools[1].Host })
  );

  user.click(saveButton);
  expect(screen.getByText("Fill all fields.")).toBeInTheDocument();

  // set account
  user.click(screen.getByText("Select account"));
  user.click(screen.getByText(mockMixedAccount.name));

  user.click(saveButton);
  user.click(screen.getByTestId("toggleSwitch"));

  expect(
    screen.getByText(/start ticket buyer confirmation/i)
  ).toBeInTheDocument();
  expect(
    screen.getByText(mockConfiguredStakePools[1].Host)
  ).toBeInTheDocument();
  expect(screen.getByText(`${mockBalanceToMaintain}.00`)).toBeInTheDocument();
  // cancel first
  user.click(screen.getByText("Cancel"));
  // try again
  user.click(screen.getByTestId("toggleSwitch"));
  user.type(screen.getByLabelText("Private Passphrase:"), mockPassphrase);
  user.click(screen.getByText("Continue"));
  expect(mockStartTicketBuyerV2Attempt).toHaveBeenCalledWith(
    mockPassphrase,
    mockMixedAccount,
    mockBalanceToMaintain * 100000000,
    mockConfiguredStakePools[1]
  );
});

test("test legacy autobuyer (autobuyer is runnning)", () => {
  mockIsTicketAutoBuyerEnabled = selectors.isTicketAutoBuyerEnabled = jest.fn(
    () => true
  );
  render(<TicketAutoBuyer />, initialState);
  expect(mockIsTicketAutoBuyerEnabled).toHaveBeenCalled();
  expect(screen.getByText(/turn off auto buyer/i)).toBeInTheDocument();
  user.click(screen.getByTestId("toggleSwitch"));
  expect(mockTicketBuyerV2Cancel).toHaveBeenCalled();
});

test("test legacy autobuyer (a process is runnning)", () => {
  mockGetRunningIndicator = selectors.getRunningIndicator = jest.fn(() => true);
  render(<TicketAutoBuyer />, initialState);
  expect(
    screen.getByText(/privacy mixer or purchase ticket attempt running/i)
  ).toBeInTheDocument();
  user.click(screen.getByTestId("toggleSwitch"));

  expect(
    screen.queryByText(/start ticket buyer confirmation/i)
  ).not.toBeInTheDocument();
  expect(mockGetRunningIndicator).toHaveBeenCalled();
});
