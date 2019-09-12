import { FormattedMessage as T, defineMessages } from "react-intl";
import { KeyBlueButton, InvisibleButton } from "buttons";
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
  hasFailedAttempt
}) => (
  <div className="account-row-rename-bottom" key={"details" + account.accountNumber}>
    <div className="account-row-rename-bottom-title">
      <T id="accounts.rename" m="Rename Account" />
    </div>
    <div className="account-row-rename-bottom-fields">
      <div className="account-row-rename-bottom-label">
        <T id="accounts.newName" m="New Account Name" />:
      </div>
      <div className="account-row-rename-bottom-value">
        <TextInput
          required
          autoFocus={true}
          key={"rename" + account.accountNumber}
          placeholder={intl.formatMessage(messages.newNamePlaceholder)}
          maxLength="50"
          value={renameAccountName}
          onChange={(e) => updateRenameAccountName(e.target.value)}
          showErrors={hasFailedAttempt || (renameAccountName && renameAccountName.length > 50)}
        />
      </div>
    </div>
    <div className="account-row-rename-bottom-buttons">
      <KeyBlueButton
        className="content-confirm-new-account"
        onClick={renameAccount}>
        <T id="accounts.renameBtn" m="Rename" />
      </KeyBlueButton>
      <InvisibleButton
        className="content-confirm-new-account"
        onClick={hideRenameAccount}>
        <T id="accounts.cancelRenameBtn" m="Cancel" />
      </InvisibleButton>
    </div>
  </div>
);

RenameAccount.propTypes = {
  account: PropTypes.object.isRequired,
  updateRenameAccountName: PropTypes.func.isRequired,
  renameAccount: PropTypes.func.isRequired,
  hideRenameAccount: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired
};

export default RenameAccount;
