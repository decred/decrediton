import { useSelector } from "react-redux";
import * as sel from "selectors";
import { usePrevious } from "hooks";
import { useIntl } from "react-intl";
import { defineMessages } from "react-intl";
import { useState, useEffect, useCallback } from "react";
import { isArray } from "lodash";
import { isEqual } from "lodash/fp";

const messages = defineMessages({
  placeholder: {
    id: "accountsSelect.placeholder",
    defaultMessage: "Select account"
  }
});

export const useAccountsSelect = ({
  accountProp,
  accountsType,
  filterAccounts,
  onChange
}) => {
  const spendingAccounts = useSelector(sel.spendingAccounts);
  const visibleAccounts = useSelector(sel.visibleAccounts);
  const mixedAccount = useSelector(sel.getMixedAccount);

  const previousSpendingAccounts = usePrevious(spendingAccounts);
  const previousVisibleAccounts = usePrevious(visibleAccounts);
  const previousAccountProp = usePrevious(accountProp);
  const previousAccountsType = usePrevious(accountsType);

  const getAccountsToShow = useCallback(() => {
    const accountsPerType = {
      spending: spendingAccounts,
      visible: visibleAccounts
    };
    // If we have a mixed account, we show visible accounts as default instead
    // of spending, because our mixed account can be empty, but still desired
    // to be spent.
    const type = mixedAccount ? "visible" : "spending";
    let filteredAccounts = accountsPerType[accountsType || type];
    // filterAccounts remove accounts if needed. This is usefull to remove accounts
    // which are not supposed to be shown, for example, mixed accounts in privacy wallets
    if (isArray(filterAccounts)) {
      filteredAccounts = filteredAccounts.filter(
        ({ value }) => !filterAccounts.includes(value)
      );
    }
    return filteredAccounts;
  }, [
    spendingAccounts,
    visibleAccounts,
    mixedAccount,
    filterAccounts,
    accountsType
  ]);

  const [account, setAccount] = useState(accountProp);
  const [accounts, setAccounts] = useState(() => getAccountsToShow());

  useEffect(() => {
    const newAccounts = getAccountsToShow();
    if (!isEqual(newAccounts, accounts)) {
      if (!newAccounts.find((a) => isEqual(a.value, account.value))) {
        setAccount(newAccounts[0]);
        onChange(newAccounts[0]);
      }
      setAccounts(newAccounts);
    }
  }, [filterAccounts, getAccountsToShow, account, accounts, onChange]);

  useEffect(() => {
    let newAccount = null;

    if (!isEqual(previousAccountProp, accountProp)) {
      newAccount = accountProp;
    }

    if (
      !isEqual(previousSpendingAccounts, spendingAccounts) ||
      !isEqual(previousVisibleAccounts, visibleAccounts) ||
      !isEqual(previousAccountsType, accountsType)
    ) {
      const newAccounts = getAccountsToShow();
      if (accountProp && !newAccount) {
        newAccount = newAccounts.find((a) =>
          isEqual(a.value, accountProp.value)
        );
      }
      setAccounts(newAccounts);
    }
    if (newAccount) {
      setAccount(newAccount);
    }
  }, [
    accountProp,
    previousAccountProp,
    previousSpendingAccounts,
    previousVisibleAccounts,
    previousAccountsType,
    spendingAccounts,
    visibleAccounts,
    accountsType,
    getAccountsToShow
  ]);

  const intl = useIntl();
  const placeholder = intl.formatMessage(messages.placeholder);

  return {
    account,
    accounts,
    placeholder
  };
};
