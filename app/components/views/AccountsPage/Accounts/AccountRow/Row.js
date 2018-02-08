import { FormattedMessage as T } from "react-intl";
import { Balance, TransitionMotionWrapper } from "shared";
import "style/Fonts.less";
import "style/AccountRow.less";

const wrapperComponent = props => <div className="account-wrapper" { ...props } />;

const Row = ({
  account,
  hideAccountDetails,
  showAccountDetails,
  isShowingAccountDetails,
  isShowingRenameAccount,
  hidden,
  willEnter,
  willLeave,
  getAccountDetailsStyles,
  getRenameAccountStyles,
  getNullStyles,
  getDefaultStyles,
}) => (
  <div
    className={
      isShowingAccountDetails
        ? isShowingRenameAccount
          ? "account-row-rename"
          : "account-row-long"
        : "account-row-short"
    }
  >
    <div
      className={
        isShowingAccountDetails
          ? "account-row-details-top"
          : hidden
            ? "account-row-hidden"
            : "account-row"
      }
      key={"top" + account.accountNumber}
      onClick={
        isShowingAccountDetails
          ? hideAccountDetails
          : () => showAccountDetails(account.accountNumber)
      }
    >
      <div className="account-row-top-top">
        <div className="account-row-wallet-icon" />
        <div className="account-row-top-account-name">{account.accountName}{
          hidden
            ? <span> (hidden)</span>
            : <span></span>
        }</div>
        <div className="account-row-top-account-funds">
          <Balance amount={account.total} />
          <div className="account-row-top-last-tx"></div>
          <div className="account-row-top-spendable">
            <div className="account-row-top-spendable-label">
              <T id="accounts.row.spendable" m="Spendable" />
            </div>
            <Balance amount={account.spendable} />
          </div>
        </div>
      </div>
    </div>
    {
      <TransitionMotionWrapper
        {
        ...{
          styles: !isShowingAccountDetails ?
            getNullStyles() :
            isShowingRenameAccount ? getRenameAccountStyles() :
              getAccountDetailsStyles(),
          defaultStyles: getDefaultStyles(),
          wrapperComponent,
          willEnter,
          willLeave }}
      />
    }
  </div>
);

export default Row;
