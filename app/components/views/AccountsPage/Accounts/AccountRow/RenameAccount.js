import { FormattedMessage as T, defineMessages } from "react-intl";
import { KeyBlueButton, SlateGrayButton } from "buttons";
import { TextInput } from "inputs";

const messages = defineMessages({
  newNamePlaceholder: {
    id: "accounts.rename.newNamePlaceholder",
    defaultMessage: "New Account Name"
  },
});

const RenameAccount = ({
  account,
  updateRenameAccountName,
  renameAccountName,
  renameAccount,
  hideRenameAccount,
  intl,
  renameAccountNameError,
}) => (
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
            autoFocus={true}
            key={"rename" + account.accountNumber}
            type="text"
            className="address-content-nest-address-hash-to"
            placeholder={intl.formatMessage(messages.newNamePlaceholder)}
            maxLength="50"
            value={renameAccountName}
            onChange={(e) => updateRenameAccountName(e.target.value)}
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
);

RenameAccount.propTypes = {
  account: PropTypes.object.isRequired,
  updateRenameAccountName: PropTypes.func.isRequired,
  renameAccount: PropTypes.func.isRequired,
  hideRenameAccount: PropTypes.func.isRequired,
  renameAccountNameError: PropTypes.string,
  intl: PropTypes.object.isRequired
};

export default RenameAccount;
