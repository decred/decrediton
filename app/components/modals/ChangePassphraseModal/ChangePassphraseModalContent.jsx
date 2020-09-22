import { FormattedMessage as T } from "react-intl";
import { PasswordInput, PassphraseModalField } from "inputs";
import { PassphraseModal } from "modals";

const Modal = ({
  newPassphrase,
  setNewPassphrase,
  setConfirmPrivPass,
  confirmPrivPass,
  isValid,
  onSubmit,
  onTriggerPassphraseModalSubmit,
  error,
  ...props
}) => (
  <PassphraseModal
    {...{
      ...props,
      onSubmit,
      parentIsValid: isValid
    }}>
    <PassphraseModalField
      label={
        <T id="changePassModal.newPassphrase" m="New Private Passphrase" />
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
      label={<T id="changePassModal.confirm" m="Confirm" />}>
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
