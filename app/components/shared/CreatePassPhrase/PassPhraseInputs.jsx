import { injectIntl, defineMessages } from "react-intl";
import { PasswordInput } from "inputs";
import { InfoDocFieldModalButton } from "buttons";
import { classNames } from "pi-ui";
import styles from "./CreatePassPhrase.module.css";

const messages = defineMessages({
  passphrasePlaceholder: {
    id: "createWallet.passphrasePlaceholder",
    defaultMessage: "Private Passphrase"
  },
  verifyPassphrasePlaceholder: {
    id: "createWallet.verifyPassphrasePlaceholder",
    defaultMessage: "Confirm Private Passphrase"
  },
  passPhraseLabel: {
    id: "createWallet.passhraseInput.label",
    defaultMessage: "Private passphrase"
  },
  passPhraseVerificationLabel: {
    id: "createWallet.passphraseInput.verifyLabel",
    defaultMessage: "Repeat Private Passphrase"
  },
  blankPassPhraseError: {
    id: "createWallet.passphraseInput.errors.noPassPhrase",
    defaultMessage: "*Please enter your private passphrase"
  },
  passPhraseVerificationError: {
    id: "createWallet.passphraseInput.errors.noMatch",
    defaultMessage: "*Passphrases do not match"
  }
});

const PassPhraseInputs = ({
  passPhraseLabel,
  passPhraseVerificationLabel,
  blankPassPhraseError,
  passPhraseVerificationError,
  passPhrase,
  passPhraseVerification,
  setPassPhrase,
  setPassPhraseVerification,
  intl,
  onKeyDown,
  hasFailedAttempt,
  isValid
}) => (
  <>
    <div className={classNames("flex-row", styles.passphraseRow)}>
      <div
        className={classNames(
          "flex-row",
          styles.confirmSeedLabel,
          styles.passphraseRow
        )}>
        <InfoDocFieldModalButton document="PassphraseInfo" />
        <div>
          {passPhraseLabel ?? intl.formatMessage(messages.passPhraseLabel)}
        </div>
      </div>
      <form>
        <PasswordInput
          required
          id="passPhrase"
          className={styles.inputPrivatePassword}
          placeholder={intl.formatMessage(messages.passphrasePlaceholder)}
          value={passPhrase}
          onKeyDown={onKeyDown}
          onChange={(e) => setPassPhrase(e.target.value)}
          showErrors={hasFailedAttempt}
          requiredMessage={
            blankPassPhraseError ??
            intl.formatMessage(messages.blankPassPhraseError)
          }
        />
      </form>
    </div>
    <div className={classNames("flex-row", styles.passphraseRow)}>
      <div
        className={classNames(styles.confirmSeedLabel, styles.passphraseRow)}>
        {passPhraseVerificationLabel ??
          intl.formatMessage(messages.passPhraseVerificationLabel)}
      </div>
      <form>
        <PasswordInput
          id="passPhraseVerification"
          className={styles.inputPrivatePassword}
          invalid={!isValid}
          invalidMessage={
            passPhraseVerificationError ??
            intl.formatMessage(messages.passPhraseVerificationError)
          }
          placeholder={intl.formatMessage(messages.verifyPassphrasePlaceholder)}
          value={passPhraseVerification}
          onKeyDown={onKeyDown}
          onChange={(e) => setPassPhraseVerification(e.target.value)}
          showErrors={true}
        />
      </form>
    </div>
  </>
);

export default injectIntl(PassPhraseInputs);
