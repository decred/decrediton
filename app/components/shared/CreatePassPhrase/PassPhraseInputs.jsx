import { defineMessages } from "react-intl";
import { PasswordInput } from "inputs";

const messages = defineMessages({
  passphrasePlaceholder: {
    id: "createWallet.passphrasePlaceholder",
    defaultMessage: "Write your Private Passphrase"
  },
  verifyPassphrasePlaceholder: {
    id: "createWallet.verifyPassphrasePlaceholder",
    defaultMessage: "Confirm your Private Passphrase"
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
  },
  passPhraseVerificationSuccess: {
    id: "createWallet.passphraseInput.match",
    defaultMessage: "Repeated correctly"
  }
});

const PassPhraseInputs = ({
  intl,
  passPhraseLabel,
  passPhraseVerificationLabel,
  blankPassPhraseError,
  passPhraseVerificationError,
  passPhrase,
  passPhraseVerification,
  setPassPhrase,
  setPassPhraseVerification,
  onKeyDown,
  hasFailedAttempt,
  isValid
}) => (
  <>
    <form>
      <PasswordInput
        newBiggerFontStyle
        required
        hideIcons
        id="passPhrase"
        label={passPhraseLabel ?? intl.formatMessage(messages.passPhraseLabel)}
        placeholder={intl.formatMessage(messages.passphrasePlaceholder)}
        value={passPhrase}
        onKeyDown={onKeyDown}
        onChange={(e) => setPassPhrase(e.target.value)}
        showErrors={hasFailedAttempt}
        showSuccess={isValid}
        successMessage=" "
        requiredMessage={
          blankPassPhraseError ??
          intl.formatMessage(messages.blankPassPhraseError)
        }
      />
    </form>
    <form>
      <PasswordInput
        newBiggerFontStyle
        hideIcons
        id="passPhraseVerification"
        invalid={!isValid}
        invalidMessage={
          passPhraseVerificationError ??
          intl.formatMessage(messages.passPhraseVerificationError)
        }
        label={
          passPhraseVerificationLabel ??
          intl.formatMessage(messages.passPhraseVerificationLabel)
        }
        placeholder={intl.formatMessage(messages.verifyPassphrasePlaceholder)}
        value={passPhraseVerification}
        onKeyDown={onKeyDown}
        onChange={(e) => setPassPhraseVerification(e.target.value)}
        successMessage={intl.formatMessage(
          messages.passPhraseVerificationSuccess
        )}
        showSuccess={isValid}
        showErrors={!isValid}
      />
    </form>
  </>
);

export default PassPhraseInputs;
