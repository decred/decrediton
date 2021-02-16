import { FormattedMessage as T } from "react-intl";
import { Balance, VerticalAccordion } from "shared";
import "style/AccountRow.less";
import style from "../Accounts.module.css";
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
          style.detailsTop,
          hidden && style.hidden,
          isImported(account) && style.imported,
          isImported(account) && !hasTickets && style.disabled,
          isMixed && style.mixed,
          isChange && style.unmixed
        )}>
        <div className={style.topName}>
          {account.accountName === DEFAULT_ACCOUNT ? (
            <T id="accounts.name.default" m="Primary Account" />
          ) : (
            account.accountName
          )}
          {hidden ? <span>(hidden)</span> : null}
        </div>
        <div className={style.topFunds}>
          <div className={style.topTotalValue}>
            {isImported(account) ? (
              <Balance amount={account.votingAuthority} />
            ) : (
              <Balance amount={account.total} />
            )}
          </div>
          <div className={classNames(style.topSpendable, style.isRow)}>
            <T id="accounts.row.spendable" m="Spendable:" />
            <Balance
              classNameWrapper={style.topSpendableValue}
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
    //TODO: encapsulate end provide .active CSS class in shared/VerticalAccordion.jsx
    arrowClassName="vertical-accordion-arrow"
    className={classNames(style.detailsBottom, "account-row-details-bottom")}>
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
