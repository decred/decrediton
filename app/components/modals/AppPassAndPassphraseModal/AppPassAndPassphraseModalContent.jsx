import { FormattedMessage as T, defineMessages } from "react-intl";
import { PasswordInput } from "inputs";
import { PassphraseModal } from "modals";

const messages = defineMessages({
  dexPassphraseLabelText: {
    id: "appPassphrase.newPassphrase",
    defaultMessage: "DEX Passphrase"
  },
  dexPassphraseplaceholderText: {
    id: "appPassphrase.newPassphrasePlaceholder",
    defaultMessage: "Write your DEX Passphrase"
  }
});

const Modal = ({
  appPassphrase,
  setAppPassphrase,
  isValid,
  onSubmit,
  onTriggerPassphraseModalSubmit,
  error,
  intl,
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
      id="appPassphraseInput"
      required
      showErrors={appPassphrase !== null && !isValid}
      placeholder=""
      value={appPassphrase}
      onChange={(e) => setAppPassphrase(e.target.value)}
      onKeyDownSubmit={onTriggerPassphraseModalSubmit}
      label={intl.formatMessage(messages.dexPassphraseLabelText)}
      placeholder={intl.formatMessage(messages.dexPassphraseplaceholderText)}
    />
    {error && <div className="error">{error}</div>}
  </PassphraseModal>
);

export default Modal;
