import { KeyBlueButton } from "buttons";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { PasswordInput } from "inputs";
import styles from "../GetStarted.module.css";

const messages = defineMessages({
  privatePassphrasePlaceholder: {
    id: "getStarted.decrypt.passphrasePlaceholder",
    defaultMessage: "Private Passphrase"
  }
});

const PassphraseFormBase = ({
  passPhrase,
  intl,
  onSetPassPhrase,
  onOpenWallet,
  onKeyDown
}) => (
  <div className={styles.pageForm}>
    <div className={styles.daemonRow}>
      <T
        id="getStarted.passphrase.info"
        m="The accounts for this wallet haven't been discovered yet. Please enter the wallet's private passphrase to perform account discovery."
      />
    </div>
    <div className={styles.deamonRow}>
      <div className={styles.daemonLabel}>
        <T id="getStarted.discoverAccounts.passphrase" m="Private Passphrase" />
      </div>
      <div className={styles.daemonInput}>
        <PasswordInput
          autoFocus
          className={styles.inputPrivatePassword}
          placeholder={intl.formatMessage(messages.privatePassphrasePlaceholder)}
          value={passPhrase}
          onChange={(e) => onSetPassPhrase(e.target.value)}
          onKeyDown={onKeyDown}
        />
      </div>
    </div>
    <div className={styles.loaderBarButtons}>
      <KeyBlueButton onClick={onOpenWallet} disabled={passPhrase == ""}>
        <T id="passphraseForm.continueBtn" m="Continue" />
      </KeyBlueButton>
    </div>
  </div>
);

export default injectIntl(PassphraseFormBase);
