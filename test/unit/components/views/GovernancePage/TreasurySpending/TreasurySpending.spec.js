import TreasurySpendingTab from "components/views/GovernancePage/TreasurySpendingTab";
import { render } from "test-utils.js";
import { screen, wait } from "@testing-library/react";
import user from "@testing-library/user-event";
import * as sel from "selectors";
import * as wal from "wallet";
import { PiKeys } from "constants";

const selectors = sel;
const wallet = wal;

const testPiKey = PiKeys[0];
const testPassphrase = "test-passphrase";

const testTreasuryPolicies = [
  { key: "k1", policy: "p1" },
  {
    key: testPiKey,
    policy: "yes"
  },
  { key: "k3", policy: "p3" }
];

let mockSetTreasuryPolicy;
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
  selectors.balances = jest.fn(() => testBalances);
  selectors.unlockableAccounts = jest.fn(() => testBalances);
  mockSetTreasuryPolicy = wallet.setTreasuryPolicy = jest.fn(() =>
    Promise.resolve()
  );
  wallet.unlockAccount = jest.fn(() => Promise.resolve(true));
  wallet.lockAccount = jest.fn(() => Promise.resolve(true));
});

const vote = async (policy, expectPassphraseError = false) => {
  // vote on yes
  const yesRadioBtn = screen.getByText(policy).parentNode.previousSibling;
  const updatePrefBtn = screen.getByRole("button", {
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

  if (!expectPassphraseError) {
    await wait(() =>
      expect(mockSetTreasuryPolicy).toHaveBeenCalledWith(
        undefined, // votingService
        testPiKey,
        policy
      )
    );
  } else {
    expect(mockSetTreasuryPolicy).not.toHaveBeenCalled();
  }
  await wait(() =>
    screen.getByRole("button", {
      name: "Update Preference"
    })
  );
};

test("test treasury spending tab (not yet voted)", async () => {
  selectors.treasuryPolicies = jest.fn(() => []);
  render(<TreasurySpendingTab />);
  expect(
    screen.getByText("abstain").parentNode.previousSibling.checked
  ).toBeTruthy();

  await vote("yes");
  await vote("abstain");
  await vote("no");
});

test("test treasury spending tab (already voted yes)", () => {
  render(<TreasurySpendingTab />);
  expect(
    screen.getByText("yes").parentNode.previousSibling.checked
  ).toBeTruthy();
});

test("test treasury spending tab (already voted no)", () => {
  selectors.treasuryPolicies = jest.fn(() => [
    { key: testPiKey, policy: "no" }
  ]);
  render(<TreasurySpendingTab />);
  expect(
    screen.getByText("no").parentNode.previousSibling.checked
  ).toBeTruthy();
});

test("test treasury spending tab (already voted abstain)", () => {
  selectors.treasuryPolicies = jest.fn(() => [
    { key: testPiKey, policy: "abstain" }
  ]);
  render(<TreasurySpendingTab />);
  expect(
    screen.getByText("abstain").parentNode.previousSibling.checked
  ).toBeTruthy();
});

test("test treasury spending tab (wrong passphrase entered)", async () => {
  wallet.unlockAccount = jest.fn(() => Promise.reject("error"));
  render(<TreasurySpendingTab />);
  await vote("yes", true);
});

test("test treasury spending tab (treasury policy set error)", async () => {
  mockSetTreasuryPolicy = wallet.setTreasuryPolicy = jest.fn(() =>
    Promise.reject("error")
  );
  render(<TreasurySpendingTab />);
  await vote("yes");
});
