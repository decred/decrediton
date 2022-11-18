import { PasswordInput } from "inputs";
import { PassphraseModal } from "modals";
import { defineMessages } from "react-intl";
import styles from "./ChangePassphraseModal.module.css";

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
  },
  dexAppPasswordLabelText: {
    id: "dexPassModal.confirm",
    defaultMessage: "DEX App Passsword"
  },
  dexAppPasswordPlaceholderText: {
    id: "dexPassModal.dexPasswordPlaceholder",
    defaultMessage: "Write your DEX App Passsword"
  },
  dexAppPasswordDesc: {
    id: "dexPassModal.dexAppPasswordDesc",
    defaultMessage:
      "Providing DEX app password automatically propagates the changes to dexc too"
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
  dexAppPassword,
  setDexAppPassword,
  dexActive,
  dexAccountName,
  ...props
}) => (
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
      onKeyDownSubmit={!dexActive && onTriggerPassphraseModalSubmit}
    />
    {dexActive && dexAccountName && dexAccountName !== "" && (
      <>
        <PasswordInput
          newBiggerFontStyle
          id="dexAppPasswordInput"
          required
          label={intl.formatMessage(messages.dexAppPasswordLabelText)}
          placeholder={intl.formatMessage(
            messages.dexAppPasswordPlaceholderText
          )}
          value={dexAppPassword}
          onChange={(e) => setDexAppPassword(e.target.value)}
          onKeyDownSubmit={onTriggerPassphraseModalSubmit}
        />
        <div className={styles.dexAppPasswordDesc}>
          {intl.formatMessage(messages.dexAppPasswordDesc)}
        </div>
      </>
    )}
    {error && <div className="error">{error}</div>}
  </PassphraseModal>
);

export default Modal;
