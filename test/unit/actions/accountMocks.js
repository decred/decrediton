import * as cla from "actions/ClientActions";
import * as wal from "wallet";

const wallet = wal;
const clientActions = cla;

export const selectedAccountNumberForTicketPurchase = 1;
export const selectedAccountForTicketPurchaseName =
  "ticket-purchase-account-name";

export const ticketBuyerAccountNumber = 2;
export const ticketBuyerAccountName = "ticket-buyer-account-name";

export const changeAccountNumber = 3;
export const mixedAccountNumber = 4;
export const mixedAccountName = "mixed";
export const mixedAccount = {
  value: mixedAccountNumber,
  encrypted: true,
  name: mixedAccountName
};
export const defaultAccountNumber = 0;
export const defaultAccount = { value: defaultAccountNumber, encrypted: true };
export const dexAccountNumber = 5;
export const dexAccountName = "dex";

export const commitmentAccountNumber = 6;
export const unencryptedAccount = 7;

export const testBalances = [
  { accountNumber: 0, accountName: "default", encrypted: true },
  {
    accountNumber: selectedAccountNumberForTicketPurchase,
    accountName: selectedAccountForTicketPurchaseName,
    encrypted: true
  },
  {
    accountNumber: ticketBuyerAccountNumber,
    accountName: ticketBuyerAccountName,
    encrypted: true
  },
  {
    accountNumber: changeAccountNumber,
    accountName: "test-account3",
    encrypted: true
  },
  {
    accountNumber: mixedAccountNumber,
    accountName: mixedAccountName,
    encrypted: true
  },
  {
    accountNumber: dexAccountNumber,
    accountName: dexAccountName,
    encrypted: true
  },
  {
    accountNumber: commitmentAccountNumber,
    accountName: "test-account5",
    encrypted: true
  },
  {
    accountNumber: unencryptedAccount,
    accountName: "test-account6",
    encrypted: false
  },
  { accountNumber: 2147483647, accountName: "imported", encrypted: false }
];

export const mockUnlockLockAndGetAccountsAttempt = () => {
  let unlockedAccounts = [];
  const addUnlockedAccount = (accountNumber) =>
    unlockedAccounts.push(accountNumber);
  const mockLockAccount = (wallet.lockAccount = jest.fn((_, accountNumber) => {
    if (!unlockedAccounts.includes(accountNumber)) {
      console.error(`${accountNumber} is not unlocked`);
    } else {
      unlockedAccounts = unlockedAccounts.filter((an) => an != accountNumber);
    }
  }));
  const mockUnlockAccount = (wallet.unlockAccount = jest.fn(
    (_, passphrase, accountNumber) => {
      if (unlockedAccounts.includes(accountNumber)) {
        console.error(`${accountNumber} is already unlocked (${passphrase})`);
      } else {
        unlockedAccounts.push(accountNumber);
      }
    }
  ));
  const mockGetAccountsAttempt = (clientActions.getAccountsAttempt = jest.fn(
    () => async (dispatch) => {
      const updatedBalances = testBalances.map((b) =>
        unlockedAccounts.includes(b.accountNumber)
          ? { ...b, unlocked: true }
          : b
      );
      await dispatch({
        balances: updatedBalances,
        type: cla.GETBALANCE_SUCCESS
      });
    }
  ));

  return {
    addUnlockedAccount,
    mockLockAccount,
    mockUnlockAccount,
    mockGetAccountsAttempt
  };
};
