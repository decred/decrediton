import { AccountsSelect } from "inputs";
import { render } from "test-utils.js";
import { screen } from "@testing-library/react";
import * as sel from "selectors";
import { DCR } from "constants";

let mockMixedAccountValue = 6;

const mockDefaultAccount = {
  hidden: false,
  label: "default: 19 DCR",
  name: "default",
  spendable: 1900000000,
  spendableAndUnit: "19 DCR",
  total: 1900000000,
  value: 0
};
const mockUnmixedAccount = {
  hidden: false,
  label: "unmixed: 249.79547928 DCR",
  name: "unmixed",
  spendable: 24979547928,
  spendableAndUnit: "249.79547928 DCR",
  total: 24979547928,
  value: 1
};
const mockAccount2 = {
  hidden: false,
  label: "account-2: 7.4998063 DCR",
  name: "account-2",
  spendable: 749980630,
  spendableAndUnit: "7.4998063 DCR",
  total: 749980630,
  value: 2
};
const mockMixedAccount = {
  hidden: false,
  label: "mixed: 0 DCR",
  name: "mixed",
  spendable: 0,
  spendableAndUnit: "0 DCR",
  total: 0,
  value: mockMixedAccountValue
};
const mockSpendableAccounts = [
  mockDefaultAccount,
  mockUnmixedAccount,
  mockAccount2
];
const mockVisibleAccounts = [
  mockDefaultAccount,
  mockUnmixedAccount,
  mockAccount2,
  mockMixedAccount
];
const mockFilterAccounts = [0, 1, mockMixedAccountValue];
const selectors = sel;

selectors.spendingAccounts = jest.fn(() => mockSpendableAccounts);
selectors.visibleAccounts = jest.fn(() => mockVisibleAccounts);
selectors.getMixedAccount = jest.fn(() => mockMixedAccountValue);
selectors.currencyDisplay = jest.fn(() => DCR);
const mockOnChange = jest.fn(() => {});
const testClassName = "test-class-name";

test("render empty AccountsSelect with custom className", () => {
  render(<AccountsSelect className={testClassName} />);
  expect(screen.getByText(/select account/i)).toBeInTheDocument();
  expect(screen.getByTestId("accountsSelect").className).toMatch(testClassName);
  expect(screen.queryByText("Accounts")).not.toBeInTheDocument();
});

test("render empty AccountsSelect with accounts buttons", () => {
  render(<AccountsSelect showAccountsButton />);
  expect(screen.getByText("Accounts")).toBeInTheDocument();
});

test("render AccountsSelect (visible accounts)", async () => {
  const { user } = render(
    <AccountsSelect account={mockDefaultAccount} onChange={mockOnChange} />
  );
  expect(screen.queryByText(/select account/i)).not.toBeInTheDocument();
  const accountsSelect = screen.getByTestId("accountsSelect");
  expect(accountsSelect.className).not.toMatch(testClassName);
  await user.click(screen.getByText(mockDefaultAccount.name));
  expect(screen.getByText(mockUnmixedAccount.name)).toBeInTheDocument();
  expect(screen.getByText(mockMixedAccount.name)).toBeInTheDocument();
  expect(screen.getByText(mockAccount2.name)).toBeInTheDocument();

  await user.click(screen.getByText(mockMixedAccount.name));
  expect(mockOnChange).toHaveBeenCalledWith(mockMixedAccount);
  expect(screen.queryByText(mockUnmixedAccount.name)).not.toBeInTheDocument();
  expect(screen.queryByText(mockMixedAccount.name)).not.toBeInTheDocument();
  expect(screen.queryByText(mockAccount2.name)).not.toBeInTheDocument();
});

test("render AccountsSelect (spendable accounts)", async () => {
  mockMixedAccountValue = null;
  const { user } = render(
    <AccountsSelect account={mockDefaultAccount} onChange={mockOnChange} />
  );
  expect(screen.queryByText(/select account/i)).not.toBeInTheDocument();
  const accountsSelect = screen.getByTestId("accountsSelect");
  expect(accountsSelect.className).not.toMatch(testClassName);
  await user.click(screen.getByText(mockDefaultAccount.name));
  expect(screen.getByText(mockUnmixedAccount.name)).toBeInTheDocument();
  expect(screen.queryByText(mockMixedAccount.name)).not.toBeInTheDocument();
  expect(screen.getByText(mockAccount2.name)).toBeInTheDocument();

  await user.click(screen.getByText(mockAccount2.name));
  expect(mockOnChange).toHaveBeenCalledWith(mockAccount2);
  expect(screen.queryByText(mockUnmixedAccount.name)).not.toBeInTheDocument();
  expect(screen.queryByText(mockMixedAccount.name)).not.toBeInTheDocument();
  expect(screen.queryByText(mockAccount2.name)).not.toBeInTheDocument();
});

test("render AccountsSelect (filtered accounts)", async () => {
  const { user } = render(
    <AccountsSelect
      account={mockDefaultAccount}
      onChange={mockOnChange}
      filterAccounts={mockFilterAccounts}
    />
  );
  expect(screen.queryByText(/select account/i)).not.toBeInTheDocument();
  const accountsSelect = screen.getByTestId("accountsSelect");
  expect(accountsSelect.className).not.toMatch(testClassName);
  await user.click(screen.getByText(mockDefaultAccount.name));
  expect(screen.queryByText(mockUnmixedAccount.name)).not.toBeInTheDocument();
  expect(screen.queryByText(mockMixedAccount.name)).not.toBeInTheDocument();
  expect(screen.getByText(mockAccount2.name)).toBeInTheDocument();

  await user.click(screen.getByText(mockAccount2.name));
  expect(mockOnChange).toHaveBeenCalledWith(mockAccount2);
  expect(screen.queryByText(mockUnmixedAccount.name)).not.toBeInTheDocument();
  expect(screen.queryByText(mockMixedAccount.name)).not.toBeInTheDocument();
  expect(screen.queryByText(mockAccount2.name)).not.toBeInTheDocument();
});
