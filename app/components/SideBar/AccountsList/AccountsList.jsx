import { FormattedMessage as T } from "react-intl";
import { Balance } from "shared";
import style from "./AccountsList.module.css";
import { classNames } from "pi-ui";

const isImported = (accountNumber) => accountNumber === Math.pow(2, 31) - 1;

const AccountsList = ({
  isShowingAccounts,
  balances,
  mixedAccount,
  changeAccount,
  accountsListRef
}) => {
  const isMixed = (accountNumber) => accountNumber === mixedAccount;
  const isChange = (accountNumber) => accountNumber === changeAccount;
  return (
    <div
      data-testid="account-list"
      className={classNames(
        style.extended,
        isShowingAccounts && style.showingAccounts
      )}>
      <div className={style.extendedBottom} ref={accountsListRef}>
        {balances.map(
          ({ hidden, total, accountName, accountNumber }) =>
            !hidden && (
              <div
                className={classNames(
                  style.account,
                  isImported(accountNumber) && style.imported,
                  isMixed(accountNumber) && style.mixed,
                  isChange(accountNumber) && style.unmixed
                )}
                key={accountName}>
                <div className={style.accountName}>
                  {accountName === "default" ? (
                    <T id="sidebar.accounts.name.default" m="Primary Account" />
                  ) : (
                    accountName
                  )}
                </div>
                <div className={style.accountNumber}>
                  {total ? <Balance hideCurrency amount={total} /> : 0}
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default AccountsList;
