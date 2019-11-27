import { FormattedMessage as T } from "react-intl";
import { Balance, VerticalAccordion } from "shared";
import "style/Fonts.less";
import "style/AccountRow.less";

// default account's number equals 2^31-1.
// source https://github.com/decred/dcrwallet/blob/master/wallet/udb/addressmanager.go#L43
const isImported = ({ accountNumber }) => accountNumber === Math.pow(2, 31)-1;
const Header = ({
  account,
  hidden,
  hasTickets
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
        { isImported(account) ?
          <Balance amount={account.votingAuthority} /> :
          <Balance amount={account.total} />
        }
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
  hasTickets
}) => (<VerticalAccordion
  header={<Header {...{ account, hidden, hasTickets }} />}
  disabled={isImported(account) && !hasTickets}
  onToggleAccordion={onToggleShowDetails}
  show={isShowingDetails}
  className={"account-row-details-bottom"}
>
  {isShowingDetails ?
    isShowingRenameAccount ?  getRenameAccountStyles() : getAccountDetailsStyles() :
    <></>}
</VerticalAccordion>
);

export default Row;
