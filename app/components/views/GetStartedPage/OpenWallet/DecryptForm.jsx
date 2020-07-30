import { KeyBlueButton } from "buttons";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { PasswordInput } from "inputs";
import styles from "../GetStarted.module.css";

const messages = defineMessages({
  publicPassphrasePlaceholder: {
    id: "getStarted.decrypt.publicPassphrasePlaceholder",
    defaultMessage: "Public Passphrase"
  }
});

const OpenWalletDecryptFormBodyBase = ({
  publicPassPhrase,
  intl,
  onSetPublicPassPhrase,
  onOpenWallet,
  onKeyDown
}) => (
  <div className={styles.pageForm}>
    <div className={styles.daemonRow}>
      <T
        id="getStarted.decrypt.info"
        m="This wallet is encrypted, please enter the public passphrase to decrypt it."
      />
    </div>
    <div className={styles.deamonRow}>
      <div className={styles.daemonLabel}>
        <T id="getStarted.decrypt.label" m="Decrypt Wallet" />
      </div>
      <div className={styles.daemonInput}>
        <PasswordInput
          autoFocus
          className={styles.inputPrivatePassword} // TODO: is this needed/wokring ?
          placeholder={intl.formatMessage(messages.publicPassphrasePlaceholder)}
          value={publicPassPhrase}
          onChange={(e) => onSetPublicPassPhrase(e.target.value)}
          onKeyDown={onKeyDown}
        />
      </div>
    </div>
    <div className={styles.loaderBarButtons}>
      <KeyBlueButton onClick={onOpenWallet} disabled={publicPassPhrase == ""}>
        <T id="decryptWalletForm.openBtn" m="Open Wallet" />
      </KeyBlueButton>
    </div>
  </div>
);

export default injectIntl(OpenWalletDecryptFormBodyBase);
