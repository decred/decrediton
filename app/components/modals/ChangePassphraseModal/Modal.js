import { FormattedMessage as T } from "react-intl";
import { PasswordInput, PassphraseModalField } from "inputs";
import { PassphraseModal } from "../PassphraseModal";

const Modal = ({
  privPass,
  updatePrivatePassphrase,
  confirmPrivPass,
  updateConfirmPrivatePassphrase,
  confirmPrivPassError,
  hasFailedAttempt,
  triggerPassphraseModalSubmit,
  onSubmit,
  onTriggerPassphraseModalSubmit,
  ...props
}) => (
  <PassphraseModal
    {...{
      ...props,
      onSubmit,
      prependPassphraseRow: true,
      triggerSubmit: triggerPassphraseModalSubmit,
    }}>
    <PassphraseModalField
      label={
        <T id="changePassModal.newPassphrase" m="New Private Passphrase" />
      }>
      <PasswordInput
        required
        showErrors={hasFailedAttempt}
        id="passphrase"
        placeholder=""
        value={privPass}
        onChange={(e) => updatePrivatePassphrase(e.target.value)}
        onKeyDownSubmit={onTriggerPassphraseModalSubmit}
      />
    </PassphraseModalField>

    <PassphraseModalField
      label={<T id="changePassModal.confirm" m="Confirm" />}>
      <PasswordInput
        invalid={!!confirmPrivPassError}
        invalidMessage={
          <T
            id="changePassModal.confirmMismatch"
            m="New passphrase and confirmation don't match"
          />
        }
        showErrors={hasFailedAttempt}
        id="confirmPassphrase"
        placeholder=""
        value={confirmPrivPass}
        onChange={(e) => updateConfirmPrivatePassphrase(e.target.value)}
        onKeyDownSubmit={onTriggerPassphraseModalSubmit}
      />
    </PassphraseModalField>
  </PassphraseModal>
);

export default Modal;
