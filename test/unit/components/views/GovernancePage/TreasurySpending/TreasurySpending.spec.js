import TreasurySpendingTab from "components/views/GovernancePage/TreasurySpendingTab";
import { render } from "test-utils.js";
import { screen, wait } from "@testing-library/react";
import user from "@testing-library/user-event";
import { within } from "@testing-library/dom";
import * as sel from "selectors";
import * as wal from "wallet";
import { MainNetParams, TestNetParams } from "constants";

const selectors = sel;
const wallet = wal;

const PiKey_mainnet = MainNetParams.PiKeys[0];
const PiKey_testnet = TestNetParams.PiKeys[0];
const testTSpendHash = "test-tspend-hash";
const testPassphrase = "test-passphrase";

const testTreasuryPolicies = [
  { key: "k1", policy: "p1" },
  {
    key: PiKey_mainnet,
    policy: "yes"
  },
  { key: "k3", policy: "p3" }
];
const testTSpendPolicies = [
  {
    hash: testTSpendHash,
    policy: ""
  }
];

let mockSetTreasuryPolicy;
let mockSetTSpendPolicy;
const testBalances = [
  {
    accountNumber: 0,
    accountName: "default",
    hidden: false,
    encrypted: true,
    total: 143506029948
  }
];

beforeEach(() => {
  selectors.treasuryPolicies = jest.fn(() => testTreasuryPolicies);
  selectors.tspendPolicies = jest.fn(() => testTSpendPolicies);
  selectors.balances = jest.fn(() => testBalances);
  selectors.unlockableAccounts = jest.fn(() => testBalances);
  mockSetTreasuryPolicy = wallet.setTreasuryPolicy = jest.fn(() =>
    Promise.resolve()
  );
  mockSetTSpendPolicy = wallet.setTSpendPolicy = jest.fn(() =>
    Promise.resolve()
  );
  wallet.unlockAccount = jest.fn(() => Promise.resolve(true));
  wallet.lockAccount = jest.fn(() => Promise.resolve(true));
});

const expectedPiKeyResult = async (
  policy,
  expectPassphraseError,
  expectedPiKey
) => {
  if (!expectPassphraseError) {
    await wait(() =>
      expect(mockSetTreasuryPolicy).toHaveBeenCalledWith(
        undefined, // votingService
        expectedPiKey,
        policy
      )
    );
  } else {
    expect(mockSetTreasuryPolicy).not.toHaveBeenCalled();
  }
};

const expectedTSpendResult = async (policy, expectPassphraseError) => {
  if (!expectPassphraseError) {
    await wait(() =>
      expect(mockSetTSpendPolicy).toHaveBeenCalledWith(
        undefined, // votingService
        testTSpendHash,
        policy
      )
    );
  } else {
    expect(mockSetTSpendPolicy).not.toHaveBeenCalled();
  }
};

const vote = async (
  policy,
  container,
  expectedResult,
  expectPassphraseError = false,
  expectedPiKey
) => {
  // vote on yes
  const yesRadioBtn = within(container).getByText(policy).parentNode
    .previousSibling;
  const updatePrefBtn = within(container).getByRole("button", {
    name: "Update Preference"
  });
  user.click(yesRadioBtn);
  expect(yesRadioBtn).toBeTruthy();

  user.click(updatePrefBtn);

  expect(screen.getByText("Confirm Your Vote").parentNode.textContent).toMatch(
    `Confirm Your Vote${policy}`
  );

  // cancel first
  user.click(
    screen.getByRole("button", {
      name: "Cancel"
    })
  );
  expect(screen.queryByText("Confirm Your Vote")).not.toBeInTheDocument();

  // vote again
  user.click(updatePrefBtn);
  const continueBtn = screen.getByRole("button", {
    name: "Continue"
  });
  expect(continueBtn.disabled).toBeTruthy();
  user.type(screen.getByLabelText("Private Passphrase"), testPassphrase);
  expect(continueBtn.disabled).toBeFalsy();
  user.click(continueBtn);

  await expectedResult(policy, expectPassphraseError, expectedPiKey);
  await wait(() =>
    within(container).getByRole("button", {
      name: "Update Preference"
    })
  );
};

const getPiKeyContainer = () => screen.getByText("Pi key:").parentElement;
const getTSpendContainer = () => screen.getByText("Tx hash:").parentElement;
const queryTSpendLabel = () => screen.queryByText("Tx hash:");

/* PiKey vote tests */

test("PiKey test: treasury spending tab (not yet voted)", async () => {
  selectors.treasuryPolicies = jest.fn(() => []);
  render(<TreasurySpendingTab />);
  const container = getPiKeyContainer();
  expect(
    within(container).getByText("abstain").parentNode.previousSibling.checked
  ).toBeTruthy();

  await vote("yes", container, expectedPiKeyResult, false, PiKey_mainnet);
  await vote("abstain", container, expectedPiKeyResult, false, PiKey_mainnet);
  await vote("no", container, expectedPiKeyResult, false, PiKey_mainnet);
});

test("PiKey test: treasury spending tab (already voted yes)", () => {
  render(<TreasurySpendingTab />);
  const container = getPiKeyContainer();
  expect(
    within(container).getByText("yes").parentNode.previousSibling.checked
  ).toBeTruthy();
});

test("PiKey test: treasury spending tab (already voted no)", () => {
  selectors.treasuryPolicies = jest.fn(() => [
    { key: PiKey_mainnet, policy: "no" }
  ]);
  render(<TreasurySpendingTab />);
  const container = getPiKeyContainer();

  expect(
    within(container).getByText("no").parentNode.previousSibling.checked
  ).toBeTruthy();
});

test("PiKey test: treasury spending tab (already voted abstain)", () => {
  selectors.treasuryPolicies = jest.fn(() => [
    { key: PiKey_mainnet, policy: "abstain" }
  ]);
  render(<TreasurySpendingTab />);
  const container = getPiKeyContainer();

  expect(
    within(container).getByText("abstain").parentNode.previousSibling.checked
  ).toBeTruthy();
});

test("PiKey test: treasury spending tab (wrong passphrase entered)", async () => {
  wallet.unlockAccount = jest.fn(() => Promise.reject("error"));
  render(<TreasurySpendingTab />);
  const container = getPiKeyContainer();

  await vote("yes", container, expectedPiKeyResult, true, PiKey_mainnet);
});

test("PiKey test: treasury spending tab (treasury policy set error)", async () => {
  mockSetTreasuryPolicy = wallet.setTreasuryPolicy = jest.fn(() =>
    Promise.reject("error")
  );
  render(<TreasurySpendingTab />);
  const container = getPiKeyContainer();

  await vote("yes", container, expectedPiKeyResult, false, PiKey_mainnet);
});

test("PiKey test: treasury spending tab (testnet)", async () => {
  selectors.treasuryPolicies = jest.fn(() => [
    { key: PiKey_testnet, policy: "abstain" }
  ]);
  render(<TreasurySpendingTab />, {
    currentSettings: {
      network: "testnet"
    }
  });
  const container = getPiKeyContainer();
  await vote("yes", container, expectedPiKeyResult, false, PiKey_testnet);
});

/* TSpend vote tests */

test("TSpend test: treasury spending tab (there is no pending tspend)", () => {
  selectors.tspendPolicies = jest.fn(() => []);
  render(<TreasurySpendingTab />);
  expect(queryTSpendLabel()).not.toBeInTheDocument();
});

test("TSpend test: treasury spending tab (received invalid tspend info)", () => {
  selectors.tspendPolicies = jest.fn(() => undefined);
  render(<TreasurySpendingTab />);
  expect(queryTSpendLabel()).not.toBeInTheDocument();
});

test("Tspend test: treasury spending tab (not yet voted)", async () => {
  render(<TreasurySpendingTab />);
  const container = getTSpendContainer();
  expect(
    within(container).getByText("abstain").parentNode.previousSibling.checked
  ).toBeTruthy();

  await vote("yes", container, expectedTSpendResult);
  await vote("abstain", container, expectedTSpendResult);
  await vote("no", container, expectedTSpendResult);
});

test("TSpend test: treasury spending tab (already voted yes)", () => {
  selectors.tspendPolicies = jest.fn(() => [
    { key: testTSpendHash, policy: "yes" }
  ]);
  render(<TreasurySpendingTab />);
  const container = getTSpendContainer();
  expect(
    within(container).getByText("yes").parentNode.previousSibling.checked
  ).toBeTruthy();
});

test("TSpend test: treasury spending tab (already voted no)", () => {
  selectors.tspendPolicies = jest.fn(() => [
    { key: testTSpendHash, policy: "no" }
  ]);
  render(<TreasurySpendingTab />);
  const container = getTSpendContainer();

  expect(
    within(container).getByText("no").parentNode.previousSibling.checked
  ).toBeTruthy();
});

test("TSpend test: treasury spending tab (wrong passphrase entered)", async () => {
  wallet.unlockAccount = jest.fn(() => Promise.reject("error"));
  render(<TreasurySpendingTab />);
  const container = getTSpendContainer();

  await vote("yes", container, expectedTSpendResult, true);
});

test("Tspend test: treasury spending tab (treasury policy set error)", async () => {
  mockSetTSpendPolicy = wallet.setTSpendPolicy = jest.fn(() =>
    Promise.reject("error")
  );
  render(<TreasurySpendingTab />);
  const container = getTSpendContainer();

  await vote("yes", container, expectedTSpendResult);
});
