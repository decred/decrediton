import { FormattedMessage as T } from "react-intl";
import style from "./AccountsList.module.css";
import { classNames } from "pi-ui";
import { Balance } from "shared";

const isImported = (accountNumber) => accountNumber === Math.pow(2, 31) - 1;

const AccountsList = ({
  isShowingAccounts,
  balances
}) => (
    <div
      className={style.sidebarMenuTotalBalanceExtended}
      style={{ display: isShowingAccounts ? "flex" : "none" }}>
      <div className={style.sidebarMenuTotalBalanceExtendedBottom}>
        {balances.map(({ hidden, total, accountName, accountNumber }) =>
          !hidden && (
            <div
              className={classNames(
                style.sidebarMenuTotalBalanceExtendedBottomAccount,
                isImported(accountNumber) && style.imported
              )}
              key={accountName}>
              <div className={style.sidebarMenuTotalBalanceExtendedBottomAccountName}>
                {accountName === "default" ? (
                  <T
                    id="sidebar.accounts.name.default"
                    m="Primary Account"
                  />
                ) :
                  (accountName)
                }
              </div>
              <div className={style.sidebarMenuTotalBalanceExtendedBottomAccountNumber}>
                {total ? <Balance hideCurrency amount={total} /> : 0}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );

export default AccountsList;
