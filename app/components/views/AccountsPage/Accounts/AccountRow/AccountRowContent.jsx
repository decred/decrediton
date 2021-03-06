import { FormattedMessage as T } from "react-intl";
import { Balance, VerticalAccordion } from "shared";
import styles from "../Accounts.module.css";
import { classNames } from "pi-ui";
import { DEFAULT_ACCOUNT } from "constants";

// default account's number equals 2^31-1.
// source https://github.com/decred/dcrwallet/blob/master/wallet/udb/addressmanager.go#L43
const isImported = ({ accountNumber }) => accountNumber === Math.pow(2, 31) - 1;

// hasTickets shows if the account had ticket EVER. When the account had no tickets
// we deactivate the imported account.
const Header = React.memo(
  ({ account, mixedAccount, changeAccount, hidden, hasTickets }) => {
    const isMixed = account.accountNumber === mixedAccount;
    const isChange = account.accountNumber === changeAccount;
    return (
      <div
        className={classNames(
          styles.detailsTop,
          hidden && styles.hidden,
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
          <div className={styles.topTotalValue}>
            {isImported(account) ? (
              <Balance amount={account.votingAuthority} />
            ) : (
              <Balance amount={account.total} />
            )}
          </div>
          <div className={classNames(styles.topSpendable, styles.isRow)}>
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

const Row = ({
  account,
  mixedAccount,
  changeAccount,
  hidden,
  isShowingRenameAccount,
  onToggleShowDetails,
  getAccountDetailsStyles,
  getRenameAccountStyles,
  isShowingDetails,
  hasTickets
}) => (
  <VerticalAccordion
    header={
      <Header
        {...{ account, mixedAccount, changeAccount, hidden, hasTickets }}
      />
    }
    disabled={isImported(account) && !hasTickets}
    onToggleAccordion={onToggleShowDetails}
    show={isShowingDetails}
    arrowClassName={styles.accordionArrow}
    activeArrowClassName={styles.activeAccordionArrow}
    className={styles.detailsBottom}>
    {isShowingDetails ? (
      isShowingRenameAccount ? (
        getRenameAccountStyles()
      ) : (
        getAccountDetailsStyles()
      )
    ) : (
      <></>
    )}
  </VerticalAccordion>
);

export default Row;
