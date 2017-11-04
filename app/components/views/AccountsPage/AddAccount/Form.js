import { TabbedHeader } from "shared";
import KeyBlueButton from "KeyBlueButton";
import SlateGrayButton from "SlateGrayButton";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { TextInput, PasswordInput } from "inputs";
import "style/Layout.less";
import "style/AccountsPage.less";

const messages = defineMessages({
  newNamePlaceholder: {
    id: "accounts.formNew.namePlaceholder",
    defaultMessage: "New Account Name"
  },
  passphrasePlaceholder: {
    id: "accounts.formNew.passphrasePlaceholder",
    defaultMessage: "Private Password"
  }
});

const AddAccountForm = ({
  routes,
  name,
  passPhrase,
  hasAttemptedSave,
  setName,
  setPassPhrase,
  intl,
  onSave,
  onCancel
}) => (
  <div className="page-view">
    <TabbedHeader {...{ routes }}/>
    <div className="page-content">
      <div className="account-flex-height">
        <div className="account-form-row">
          <div className="account-form-label">
            <T id="accounts.formNew.name" m="Account Name" />
            :</div>
          <div className="account-form-input">
            <div className="account-input-form">
              <TextInput
                type="text"
                className="account-nest-address-hash-to"
                placeholder={intl.formatMessage(messages.newNamePlaceholder)}
                maxLength="50"
                value={name}
                onChange={(e) => setName(e.target.value)}/>
            </div>
          </div>
          {(hasAttemptedSave && !name) ? (
            <div className="account-form-input-error">
              <T id="accounts.formNew.errors.noName" m="*You must enter an account name" />
            </div>
          ) : null}
        </div>
        <div className="account-form-row" key="privatePassPhrase">
          <div className="account-form-label"><T id="accounts.formNew.privatePassphrase" m="Private Passphrase" />:</div>
          <div className="account-form-input">
            <div className="account-input-form">
              <PasswordInput
                id="privpass"
                className="account-nest-address-hash-to"
                placeholder={intl.formatMessage(messages.passphrasePlaceholder)}
                value={passPhrase}
                onChange={(e) => setPassPhrase(e.target.value)}/>
            </div>
          </div>
          {(hasAttemptedSave && !passPhrase) ? (
            <div className="account-form-input-error">
              <T id="accounts.formNew.errors.noPassphrase" m="*Please enter your private passphrase" />
            </div>
          ) : null}

        </div>
      </div>
      <div className="account-form-buttons">
        <KeyBlueButton
          className="confirm-new-account-button"
          onClick={onSave}
        ><T id="accounts.formNew.confirmBtn" m="Confirm" /></KeyBlueButton>
        <SlateGrayButton
          className="hide-new-account-button"
          onClick={onCancel}
        ><T id="accounts.formNew.cancelBtn" m="Cancel" /></SlateGrayButton>
      </div>
    </div>
  </div>
);

export default injectIntl(AddAccountForm);
