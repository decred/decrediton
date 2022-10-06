import AccountsPage from "components/views/AccountsPage";
import { render } from "test-utils.js";
import { screen, wait } from "@testing-library/react";
import user from "@testing-library/user-event";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import * as cla from "actions/ClientActions";
import { DCR } from "constants";
const selectors = sel;
const controlActions = ca;
const clientAction = cla;

const mockBalances = [
  {
    accountNumber: 0,
    accountName: "default",
    externalKeys: 418,
    internalKeys: 437,
    importedKeys: 0,
    encrypted: true,
    unlocked: false,
    hidden: false,
    HDPath: "m / 44' / 1' / 0'",
    total: 9551454006,
    spendable: 9551454006,
    immatureReward: 0,
    immatureStakeGeneration: 0,
    lockedByTickets: 0,
    votingAuthority: 5802257025,
    unconfirmed: 0
  },
  {
    accountNumber: 1,
    accountName: "common-account",
    externalKeys: 188,
    internalKeys: 98,
    importedKeys: 0,
    encrypted: true,
    unlocked: false,
    hidden: false,
    HDPath: "m / 44' / 1' / 7'",
    total: 48125138665,
    spendable: 35074115317,
    immatureReward: 0,
    immatureStakeGeneration: 0,
    lockedByTickets: 13051023348,
    votingAuthority: 13051020368,
    unconfirmed: 0
  },
  {
    accountNumber: 2,
    accountName: "empty-account",
    externalKeys: 2,
    internalKeys: 0,
    importedKeys: 0,
    encrypted: true,
    unlocked: true,
    hidden: false,
    HDPath: "m / 44' / 1' / 3'",
    total: 0,
    spendable: 0,
    immatureReward: 0,
    immatureStakeGeneration: 0,
    lockedByTickets: 0,
    votingAuthority: 0,
    unconfirmed: 0
  },
  {
    accountNumber: 2147483647,
    accountName: "imported",
    externalKeys: 1,
    internalKeys: 1,
    importedKeys: 8,
    encrypted: false,
    unlocked: false,
    hidden: false,
    HDPath: "m / 44' / 1' / 2147483647'",
    total: 0,
    spendable: 0,
    immatureReward: 0,
    immatureStakeGeneration: 0,
    lockedByTickets: 0,
    votingAuthority: 0,
    unconfirmed: 0
  }
];
const mockWalletName = "mock-wallet-name";
const mockPubKey = "mock-pub-key";
let mockGetAccountExtendedKeyAttempt;
let mockRenameAccountAttempt;
let mockGetNextAccountAttempt;
let mockShowAccount;
let mockHideAccount;

beforeEach(() => {
  selectors.currencyDisplay = jest.fn(() => DCR);
  selectors.sortedAccounts = jest.fn(() => mockBalances);
  selectors.hasTickets = jest.fn(() => false);
  selectors.walletService = jest.fn(() => {
    return {};
  });
  selectors.getWalletName = jest.fn(() => mockWalletName);
  mockGetAccountExtendedKeyAttempt = controlActions.getAccountExtendedKeyAttempt = jest.fn(
    (accountNumber) => (dispatch) => {
      const res = {
        accExtendedPubKey: `${mockPubKey}-${accountNumber}`,
        accountNumber
      };
      return dispatch({
        getAccountExtendedKeyResponse: res,
        type: controlActions.GETACCOUNTEXTENDEDKEY_SUCCESS
      });
    }
  );
  mockRenameAccountAttempt = controlActions.renameAccountAttempt = jest.fn(
    () => () => {}
  );
  mockGetNextAccountAttempt = controlActions.getNextAccountAttempt = jest.fn(
    () => () => {}
  );
  mockShowAccount = clientAction.showAccount = jest.fn(() => () => {});
  mockHideAccount = clientAction.hideAccount = jest.fn(() => () => {});
});

const getBalances = () => screen.getByText("Balances");
const getBalancesTextContent = () => getBalances().parentElement.textContent;
const getPropertiesTextContent = () =>
  screen.getByText("Properties").parentElement.textContent;
const getExtendedPublicKeyValue = () =>
  screen.getByText("Extended Public Key").nextElementSibling.textContent;
const getRenameAccountButton = () =>
  screen.getByText("Rename Account").nextElementSibling;
const getRevealPubkeyButton = () =>
  screen.getByText("Reveal Pubkey").nextElementSibling;
const getHidePubkeyButton = () =>
  screen.getByText("Hide Pubkey").nextElementSibling;
const queryBalances = () => screen.queryByText("Balances");
const getCreateNewAccountModalTitle = () =>
  screen.getByText("Create new account");
const queryCreateNewAccountModalTitle = () =>
  screen.queryByText("Create new account");
const getHideButton = () => screen.getByText("Hide").nextElementSibling;
const queryHideButton = () => screen.queryByText("Hide");
const getShowButton = () => screen.getByText("Show").nextElementSibling;

test("test the Primary account", async () => {
  render(<AccountsPage />);

  // default account
  const account = screen.getByText("Primary Account");
  expect(account.nextElementSibling.textContent).toMatchInlineSnapshot(
    '"95.51454006 DCRSpendable:95.51454006 DCR"'
  );

  // show account details
  user.click(account);
  await wait(() => expect(getBalances()).toBeInTheDocument());
  expect(getBalancesTextContent()).toMatchInlineSnapshot(
    '"BalancesTotal95.51454006 DCRSpendable95.51454006 DCRImmature Rewards0.00000 DCRLocked By Tickets0.00000 DCRVoting Authority58.02257025 DCRImmature Staking Rewards0.00000 DCRUnconfirmed0.00000 DCR"'
  );
  expect(getPropertiesTextContent()).toMatchInlineSnapshot(
    "\"PropertiesAccount number0HD Pathm / 44' / 1' / 0'Keys418 external, 437 internal, 0 importedLock statuslocked\""
  );
  expect(getExtendedPublicKeyValue()).toBe("Hidden");
  // reveal pubKey
  user.click(getRevealPubkeyButton());
  expect(mockGetAccountExtendedKeyAttempt).toHaveBeenCalledWith(
    mockBalances[0].accountNumber
  );
  expect(
    screen.getByText(`${mockPubKey}-${mockBalances[0].accountNumber}`)
  ).toBeInTheDocument();

  // hide pubKey
  user.click(getHidePubkeyButton());
  expect(getExtendedPublicKeyValue()).toBe("Hidden");

  // rename account, but cancel first
  user.click(getRenameAccountButton());
  user.click(screen.getByText("Cancel"));

  // try rename without giving the name
  user.click(getRenameAccountButton());
  user.click(screen.getByText("Rename"));
  expect(screen.getByText("This field is required")).toBeInTheDocument();

  const newAccountNameInput = screen.getByPlaceholderText("New Account Name");
  // try rename typing a too long name
  user.click(getRenameAccountButton());
  const tooLongAccountName = new Array(100).join("a");
  user.type(newAccountNameInput, tooLongAccountName);
  expect(newAccountNameInput.value.length).toBe(50);

  // rename account
  const testAccountName = "test-account-name";
  user.clear(newAccountNameInput);
  user.type(newAccountNameInput, testAccountName);
  expect(screen.queryByText("This field is required")).not.toBeInTheDocument();
  user.click(screen.getByText("Rename"));
  expect(mockRenameAccountAttempt).toHaveBeenCalledWith(
    mockBalances[0].accountNumber,
    testAccountName
  );

  // hide account details
  user.click(account);
  await wait(() => expect(queryBalances()).not.toBeInTheDocument());

  // default account is not hideable
  expect(queryHideButton()).not.toBeInTheDocument();
});

test("test a common account", async () => {
  render(<AccountsPage />);

  const commonAccount = screen.getByText(mockBalances[1].accountName);
  expect(commonAccount.nextElementSibling.textContent).toMatchInlineSnapshot(
    '"481.25138665 DCRSpendable:350.74115317 DCR"'
  );

  // show account details
  user.click(commonAccount);
  await wait(() => expect(getBalances()).toBeInTheDocument());
  expect(getBalancesTextContent()).toMatchInlineSnapshot(
    '"BalancesTotal481.25138665 DCRSpendable350.74115317 DCRImmature Rewards0.00000 DCRLocked By Tickets130.51023348 DCRVoting Authority130.51020368 DCRImmature Staking Rewards0.00000 DCRUnconfirmed0.00000 DCR"'
  );
  expect(getPropertiesTextContent()).toMatchInlineSnapshot(
    "\"PropertiesAccount number1HD Pathm / 44' / 1' / 7'Keys188 external, 98 internal, 0 importedLock statuslocked\""
  );

  // not empty account is not hideable
  expect(queryHideButton()).not.toBeInTheDocument();

  // hide common account details
  user.click(commonAccount);
  await wait(() => expect(queryBalances()).not.toBeInTheDocument());
});

test("test an empy account", async () => {
  render(<AccountsPage />);

  const emtpyAccount = screen.getByText(mockBalances[2].accountName);
  expect(emtpyAccount.nextElementSibling.textContent).toMatchInlineSnapshot(
    '"0.00000 DCRSpendable:0.00000 DCR"'
  );

  // show account details
  user.click(emtpyAccount);
  await wait(() => expect(getBalances()).toBeInTheDocument());
  expect(getBalancesTextContent()).toMatchInlineSnapshot(
    '"BalancesTotal0.00000 DCRSpendable0.00000 DCRImmature Rewards0.00000 DCRLocked By Tickets0.00000 DCRVoting Authority0.00000 DCRImmature Staking Rewards0.00000 DCRUnconfirmed0.00000 DCR"'
  );
  expect(getPropertiesTextContent()).toMatchInlineSnapshot(
    "\"PropertiesAccount number2HD Pathm / 44' / 1' / 3'Keys2 external, 0 internal, 0 importedLock statusunlocked\""
  );

  // test hide button
  user.click(getHideButton());
  expect(mockHideAccount).toHaveBeenCalledWith(mockBalances[2].accountNumber);

  // test show button
  user.click(getShowButton());
  expect(mockShowAccount).toHaveBeenCalledWith(mockBalances[2].accountNumber);
});

test("test imported account", () => {
  render(<AccountsPage />);

  // default account
  const account = screen.getByText("imported");
  expect(account.nextElementSibling.textContent).toMatchInlineSnapshot(
    '"0.00000 DCRSpendable:0.00000 DCR"'
  );
  user.click(account);

  expect(queryBalances()).not.toBeInTheDocument();
});

test("test add new account", () => {
  render(<AccountsPage />);
  const addNewButton = screen.getByText("Add New");
  user.click(addNewButton);

  expect(getCreateNewAccountModalTitle()).toBeInTheDocument();
  // cancel first
  user.click(screen.getByText("Cancel"));
  expect(queryCreateNewAccountModalTitle()).not.toBeInTheDocument();

  user.click(addNewButton);
  expect(getCreateNewAccountModalTitle()).toBeInTheDocument();

  const testPrivatePassphrase = "test-priv-pass";
  const testAccountName = "test-account-name";
  user.type(screen.getByLabelText("Private Passphrase"), testPrivatePassphrase);
  user.type(screen.getByLabelText("New Account Name"), testAccountName);
  user.click(screen.getByText("Continue"));
  expect(mockGetNextAccountAttempt).toHaveBeenCalledWith(
    testPrivatePassphrase,
    testAccountName
  );
});
