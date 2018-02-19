import { FormattedMessage as T } from "react-intl";
import { PasswordInput, PassphraseModalField } from "inputs";

export default ({ passPhrase, onSubmit, hasFailedAttempt, setPassPhrase, autoFocusPassword }) =>
  <PassphraseModalField
    label={<T id="passphraseModal.privatePassphrase" m="Private Passphrase" />}
  >
    <PasswordInput
      autoFocus={autoFocusPassword}
      required
      requiredMessage={<T id="passphraseModal.errors.noPassphrase" m="*Please enter your private passphrase" />}
      id="passphrase"
      placeholder=""
      value={passPhrase}
      onChange={(e) => setPassPhrase(e.target.value)}
      onKeyDownSubmit={onSubmit}
      showErrors={hasFailedAttempt}
    />
  </PassphraseModalField>;
