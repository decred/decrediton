import { FormattedMessage as T } from "react-intl";
import { PasswordInput, PassphraseModalField } from "inputs";
import { PassphraseModal } from "modals";
import { Documentation } from "shared";
import styles from "../Modals.module.css";

const Modal = ({
  newPassphrase,
  setNewPassphrase,
  setConfirmPrivPass,
  confirmPrivPass,
  isValid,
  onSubmit,
  onTriggerPassphraseModalSubmit,
  error,
  account,
  ...props
}) => (
  <PassphraseModal
    {...{
      ...props,
      onSubmit,
      parentIsValid: isValid,
      passLabel: account.encrypted ?
        <T id="acctPassphraseModal.privatePassphrase" m="Account Passphrase" /> :
        null,
      modalDescription: <Documentation
        name="SetAcctPassphraseDocs"
        className={styles.setPassAcctModalDescription}
      />
    }}>

    <PassphraseModalField
      label={
        <T id="changeAcctPassModal.newPassphrase" m="New Account Passphrase" />
      }>
      <PasswordInput
        required
        showErrors={newPassphrase !== null && !isValid}
        id="passphrase"
        placeholder=""
        value={newPassphrase}
        onChange={(e) => setNewPassphrase(e.target.value)}
        onKeyDownSubmit={onTriggerPassphraseModalSubmit}
      />
    </PassphraseModalField>
    <PassphraseModalField
      label={<T id="changeAcctPassModal.confirm" m="Confirm" />}>
      <PasswordInput
        required
        showErrors={confirmPrivPass !== null && !isValid}
        id="confirmPassphrase"
        placeholder=""
        value={confirmPrivPass}
        onChange={(e) => setConfirmPrivPass(e.target.value)}
        onKeyDownSubmit={onTriggerPassphraseModalSubmit}
      />
    </PassphraseModalField>
    {
      error && <div className="error">{error}</div>
    }
  </PassphraseModal>
);

export default Modal;
