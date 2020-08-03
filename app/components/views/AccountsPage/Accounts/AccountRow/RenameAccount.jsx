import { FormattedMessage as T, defineMessages } from "react-intl";
import { KeyBlueButton, InvisibleButton } from "buttons";
import { TextInput } from "inputs";
import style from "../Accounts.module.css";

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
    <div
      className={style.renameBottom}
      key={"details" + account.accountNumber}>
      <div className={style.renameBottomTitle}>
        <T id="accounts.rename" m="Rename Account" />
      </div>
      <div className={style.renameBottomFields}>
        <div className={style.renameBottomLabel}>
          <T id="accounts.newName" m="New Account Name" />:
      </div>
        <div className={style.renameBottomValue}>
          <TextInput
            required
            autoFocus={true}
            key={"rename" + account.accountNumber}
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
      <div className={style.renameBottomButtons}>
        <KeyBlueButton
          className={style.contentConfirmNewAccount}
          onClick={renameAccount}>
          <T id="accounts.renameBtn" m="Rename" />
        </KeyBlueButton>
        <InvisibleButton
          className={style.contentConfirmNewAccount}
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
