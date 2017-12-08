import SlateGrayButton from "SlateGrayButton";
import KeyBlueButton from "KeyBlueButton";
import Balance from "Balance";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { TextInput } from "inputs";
import TransitionMotionWrapper from "TransitionMotionWrapper";
import "style/Fonts.less";
import "style/AccountRow.less";

const messages = defineMessages({
  newNamePlaceholder: {
    id: "accounts.rename.newNamePlaceholder",
    defaultMessage: "New Account Name"
  },
});

const wrapperComponent = props => <div className="output-row" { ...props } />;

const Row = ({
  account,
  hideAccountDetails,
  showAccountDetails,
  isShowingAccountDetails,
  isShowingRenameAccount,
  renameAccountNameError,
  hidden,
  updateRenameAccountName,
  renameAccount,
  hideRenameAccount,
  intl,
  willEnter,
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
            <div className="account-row-details-bottom" key={"details" + account.accountNumber}>
              <div className="account-row-details-bottom-title">
                <div className="account-row-details-bottom-title-name">
                  <T id="accounts.rename" m="Rename Account" />
                </div>
              </div>
              <div className="account-row-details-bottom-rename">
                <div className="account-row-details-bottom-rename-name">
                  <T id="accounts.newName" m="New Account Name" />:
              </div>
                <div className="account-row-details-bottom-spec-value">
                  <div className="account-input-form">
                    <TextInput
                      key={"rename" + account.accountNumber}
                      type="text"
                      className="address-content-nest-address-hash-to"
                      placeholder={intl.formatMessage(messages.newNamePlaceholder)}
                      maxLength="50"
                      onBlur={(e) => updateRenameAccountName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="account-form-input-error">
                  {renameAccountNameError}
                </div>
              </div>
              <div className="account-form-buttons">
                <KeyBlueButton
                  className="content-confirm-new-account"
                  onClick={renameAccount}>
                  <T id="accounts.renameBtn" m="Rename" />
                </KeyBlueButton>
                <SlateGrayButton
                  className="content-confirm-new-account"
                  onClick={hideRenameAccount}>
                  <T id="accounts.cancelRenameBtn" m="Cancel" />
                </SlateGrayButton>
              </div>
            </div>
          )
          : (
            <TransitionMotionWrapper {...{ styles: getAccountDetailsStyles(), defaultStyles: getDefaultStyles(), wrapperComponent, willEnter, willLeave }} />
          )
      }
    </div>
  );

export default injectIntl(Row);
