
import Balance from "Balance";
import { FormattedMessage as T } from "react-intl";
import TransitionMotionWrapper from "TransitionMotionWrapper";
import "style/Fonts.less";
import "style/AccountRow.less";

const wrapperComponent = props => <div className="output-row" { ...props } />;

const Row = ({
  account,
  hideAccountDetails,
  showAccountDetails,
  isShowingAccountDetails,
  isShowingRenameAccount,
  hidden,
  willEnter,
  getRenameAccountStyles,
  willLeave,
  getAccountDetailsStyles,
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
            <div className="account-row-top-spendable"><T id="accounts.spendable" m="Spendable" /> <Balance amount={account.spendable} /></div>
          </div>
        </div>
      </div>
      {!isShowingAccountDetails ?
        <TransitionMotionWrapper
          {...{ styles: getNullStyles(), wrapperComponent }}
        /> :
        isShowingRenameAccount
          ? (
            <TransitionMotionWrapper
              {...{ styles: getRenameAccountStyles(), wrapperComponent }}
            />
          )
          : (
            <TransitionMotionWrapper {...{ styles: getAccountDetailsStyles(), defaultStyles: getDefaultStyles(), wrapperComponent, willEnter, willLeave }} />
          )
      }
    </div>
  );

export default Row;
