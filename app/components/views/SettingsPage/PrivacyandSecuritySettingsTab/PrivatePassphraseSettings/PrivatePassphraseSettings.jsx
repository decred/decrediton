import { FormattedMessage as T } from "react-intl";
import { ChangePassphraseButton } from "buttons";
import { WatchOnlyWarnNotification } from "shared";
import styles from "./PrivatePassphraseSettings.module.css";

const PrivatePassphraseSettings = ({
  isChangePassPhraseDisabled,
  changePassphraseRequestAttempt,
  onAttemptChangePassphrase
}) => {
  return (
    <WatchOnlyWarnNotification isActive={isChangePassPhraseDisabled}>
      <ChangePassphraseButton
        ariaLabelledBy="update-private-passphrase-button"
        className={styles.changePassphraseButton}
        loading={changePassphraseRequestAttempt}
        isDisabled={isChangePassPhraseDisabled}
        modalTitle={
          <T id="settings.changeConfirmation" m="Change your passphrase" />
        }
        onSubmit={onAttemptChangePassphrase}
        buttonLabel={
          <T
            id="settings.privatePassphrase.buttonLabel"
            m="Update Private Passphrase"
          />
        }
      />
    </WatchOnlyWarnNotification>
  );
};

PrivatePassphraseSettings.propTypes = {
  onAttemptChangePassphrase: PropTypes.func,
  isChangePassPhraseDisabled: PropTypes.bool.isRequired,
  changePassphraseRequestAttempt: PropTypes.bool.isRequired
};

export default PrivatePassphraseSettings;
