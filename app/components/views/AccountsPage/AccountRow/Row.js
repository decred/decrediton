import { FormattedMessage as T } from "react-intl";
import { Balance, VerticalAccordion } from "shared";
import "style/Fonts.less";
import "style/AccountRow.less";

// default account number equals max int number
const isImported = ({ accountNumber }) => accountNumber === 2147483647;
const Header = ({
  account,
  hidden,
  hasTickets,
}) => (
  // hasTickets shows if the account had ticket EVER. When the account had no tickets
  // we deactivate the imported account.
  <div className={[ "account-row-details-top", hidden && "account-hidden",
    isImported(account) &&  "imported",
    (isImported(account) && !hasTickets) && "disabled" ].join(" ")} >
    <div className="account-row-top-account-name">
      {account.accountName === "default" ?
        <T id="accounts.name.default" m="Primary Account" /> :
          account.accountName}
      {hidden
        ? <span>(hidden)</span>
        : null}
    </div>
    <div className="account-row-top-account-funds">
      <div className="account-row-top-total-value">
        <Balance amount={account.total} />
      </div>
      <div className="account-row-top-spendable is-row">
        <T id="accounts.row.spendable" m="Spendable:" />
        <Balance classNameWrapper="account-row-top-spendable-value" flat amount={account.spendable} />
      </div>
    </div>
  </div>
);

const Row = ({
  account,
  hidden,
  isShowingRenameAccount,
  onToggleShowDetails,
  getAccountDetailsStyles,
  getRenameAccountStyles,
  isShowingDetails,
  hasTickets,
}) => (<VerticalAccordion
  header={<Header {...{ account, hidden, hasTickets }} />}
  height={isShowingRenameAccount ? 175 : 280}
  disabled={isImported(account) && !hasTickets}
  onToggleAccordion={onToggleShowDetails}
  show={isShowingDetails}
  className={"account-row-details-bottom"}
>
  {isShowingRenameAccount ?
    getRenameAccountStyles() : getAccountDetailsStyles()}
</VerticalAccordion>
);

export default Row;
