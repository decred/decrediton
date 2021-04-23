import { FormattedMessage as T } from "react-intl";
import { classNames } from "pi-ui";
import { DEFAULT_ACCOUNT } from "constants";
import { Balance } from "shared";
import { isImported } from "../utils";
import styles from "./Header.module.css";

// hasTickets shows if the account had ticket EVER.
// When the account had no tickets we deactivate the imported account.
const Header = React.memo(
  ({ account, mixedAccount, changeAccount, hidden, hasTickets }) => {
    const isMixed = account.accountNumber === mixedAccount;
    const isChange = account.accountNumber === changeAccount;
    return (
      <div
        className={classNames(
          styles.detailsTop,
          isImported(account) && styles.imported,
          isImported(account) && !hasTickets && styles.disabled,
          isMixed && styles.mixed,
          isChange && styles.unmixed
        )}>
        <div className={styles.topName}>
          {account.accountName === DEFAULT_ACCOUNT ? (
            <T id="accounts.name.default" m="Primary Account" />
          ) : (
            account.accountName
          )}
          {hidden ? <span>(hidden)</span> : null}
        </div>
        <div className={styles.topFunds}>
          <div>
            {isImported(account) ? (
              <Balance amount={account.votingAuthority} />
            ) : (
              <Balance amount={account.total} />
            )}
          </div>
          <div className={classNames(styles.topSpendable, "flex-row")}>
            <T id="accounts.row.spendable" m="Spendable:" />
            <Balance
              classNameWrapper={styles.topSpendableValue}
              flat
              amount={account.spendable}
            />
          </div>
        </div>
      </div>
    );
  }
);

export default Header;
