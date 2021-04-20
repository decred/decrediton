import { FormattedMessage as T } from "react-intl";
import { PasswordInput, PassphraseModalField } from "inputs";
import { PassphraseModal } from "modals";

const Modal = ({
  appPassphrase,
  setAppPassphrase,
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
      label={<T id="appPassphrase.newPassphrase" m="DEX Passphrase" />}>
      <PasswordInput
        required
        showErrors={appPassphrase !== null && !isValid}
        placeholder=""
        value={appPassphrase}
        onChange={(e) => setAppPassphrase(e.target.value)}
        onKeyDownSubmit={onTriggerPassphraseModalSubmit}
      />
    </PassphraseModalField>
    {error && <div className="error">{error}</div>}
  </PassphraseModal>
);

export default Modal;
