import { FormattedMessage as T } from "react-intl";
import { Balance } from "shared";
import style from "./AccountsList.module.css";
import { classNames } from "pi-ui";

const isImported = (accountNumber) => accountNumber === Math.pow(2, 31) - 1;

const AccountsList = ({ isShowingAccounts, balances }) => (
  <div
    data-testid="account-list"
    className={classNames(
      style.extended,
      isShowingAccounts && style.showingAccounts
    )}>
    <div className={style.extendedBottom}>
      {balances.map(
        ({ hidden, total, accountName, accountNumber }) =>
          !hidden && (
            <div
              className={classNames(
                style.extendedBottomAccount,
                isImported(accountNumber) && style.imported
              )}
              key={accountName}>
              <div className={style.extendedBottomAccountName}>
                {accountName === "default" ? (
                  <T id="sidebar.accounts.name.default" m="Primary Account" />
                ) : (
                  accountName
                )}
              </div>
              <div className={style.extendedBottomAccountNumber}>
                {total ? <Balance hideCurrency amount={total} /> : 0}
              </div>
            </div>
          )
      )}
    </div>
  </div>
);

export default AccountsList;
