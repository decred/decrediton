import { FormattedMessage as T, defineMessages } from "react-intl";
import { KeyBlueButton, InvisibleButton } from "buttons";
import { TextInput } from "inputs";
import styles from "./RenameAccount.module.css";

const messages = defineMessages({
  newNamePlaceholder: {
    id: "accounts.rename.newNamePlaceholder",
    defaultMessage: "New Account Name"
  }
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
  <div className={styles.rename} key={`details${account.accountNumber}`}>
    <div className={styles.renameTitle}>
      <T id="accounts.rename" m="Rename Account" />
    </div>
    <div className={styles.renameFields}>
      <div>
        <T id="accounts.newName" m="New Account Name" />:
      </div>
      <div className={styles.renameValue}>
        <TextInput
          id="newAccountName"
          required
          autoFocus
          key={`rename${account.accountNumber}`}
          placeholder={intl.formatMessage(messages.newNamePlaceholder)}
          maxLength="50"
          value={renameAccountName}
          onChange={(e) => updateRenameAccountName(e.target.value)}
          showErrors={
            hasFailedAttempt ||
            (renameAccountName && renameAccountName.length > 50)
          }
        />
      </div>
    </div>
    <div>
      <InvisibleButton
        className={styles.confirmNewAccount}
        onClick={hideRenameAccount}>
        <T id="accounts.cancelRenameBtn" m="Cancel" />
      </InvisibleButton>
      <KeyBlueButton
        className={styles.confirmNewAccount}
        onClick={renameAccount}>
        <T id="accounts.renameBtn" m="Rename" />
      </KeyBlueButton>
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
