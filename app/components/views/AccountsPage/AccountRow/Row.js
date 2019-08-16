import { FormattedMessage as T } from "react-intl";
import { Balance, VerticalAccordion } from "shared";
import "style/Fonts.less";
import "style/AccountRow.less";

const Header = ({
  account,
  hidden
}) => (
  <div className={"account-row-details-top" + (hidden ? " account-hidden" : "") + (account.accountName == "imported" ? " imported" : "")} >
    <div className="account-row-top-account-name">{account.accountName}{
      hidden
        ? <span> (hidden)</span>
        : <span></span>
    }</div>
    <div className="account-row-top-account-funds">
      <div className="account-row-top-total-value">
        <Balance amount={account.total} />
      </div>
      <div className="account-row-top-spendable">
        <T id="accounts.row.spendable" m="Spendable" />
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
}) => (
  <VerticalAccordion
    header={<Header {...{ account, hidden }} />}
    height={isShowingRenameAccount ? 175 : 280}
    onToggleAccordion={onToggleShowDetails}
    show={isShowingDetails}
    className={"account-row-details-bottom"}
  >
    {isShowingRenameAccount
      ? getRenameAccountStyles()
      : getAccountDetailsStyles()
    }
  </VerticalAccordion>
);

export default Row;
