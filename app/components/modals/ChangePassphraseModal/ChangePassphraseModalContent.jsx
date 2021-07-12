import { PasswordInput } from "inputs";
import { PassphraseModal } from "modals";
import { FormattedMessage as T, defineMessages } from "react-intl";

const messages = defineMessages({
  newPassphraseLabelText: {
    id: "changePassModal.newPassphrase",
    defaultMessage: "New Private Passphrase"
  },
  newPassphraseplaceholderText: {
    id: "changePassModal.newPassphrasePlaceholder",
    defaultMessage: "Write your New Private Passphrase"
  },
  confirmPassphraseLabelText: {
    id: "changePassModal.confirm",
    defaultMessage: "Confirm"
  },
  confirmPassphraseplaceholderText: {
    id: "changePassModal.confirmPassphrasePlaceholder",
    defaultMessage: "Confirm your Private Passphrase"
  }
});

const Modal = ({
  newPassphrase,
  setNewPassphrase,
  setConfirmPrivPass,
  confirmPrivPass,
  isValid,
  onSubmit,
  onTriggerPassphraseModalSubmit,
  error,
  intl,
  ...props
}) => {
  return (
    <PassphraseModal
      {...{
        ...props,
        onSubmit,
        parentIsValid: isValid
      }}>
      <PasswordInput
        newBiggerFontStyle
        id="newPassphraseInput"
        required
        showErrors={newPassphrase !== null && !isValid}
        value={newPassphrase}
        onChange={(e) => setNewPassphrase(e.target.value)}
        onKeyDownSubmit={onTriggerPassphraseModalSubmit}
        label={intl.formatMessage(messages.newPassphraseLabelText)}
        placeholder={intl.formatMessage(messages.newPassphraseplaceholderText)}
      />
      <PasswordInput
        newBiggerFontStyle
        id="confirmPrivPassInput"
        required
        showErrors={confirmPrivPass !== null && !isValid}
        label={intl.formatMessage(messages.confirmPassphraseLabelText)}
        placeholder={intl.formatMessage(
          messages.confirmPassphraseplaceholderText
        )}
        value={confirmPrivPass}
        onChange={(e) => setConfirmPrivPass(e.target.value)}
        onKeyDownSubmit={onTriggerPassphraseModalSubmit}
      />
      {error && <div className="error">{error}</div>}
    </PassphraseModal>
  );
};

export default Modal;
