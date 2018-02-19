import { FormattedMessage as T } from "react-intl";
import { TextInput, PassphraseModalField } from "inputs";
import { PassphraseModal } from "../PassphraseModal";

const Modal = ({
  script,
  hasFailedAttempt,
  setScript,
  ...props
}) => (
  <PassphraseModal {...{ ...props }} >
    <PassphraseModalField
      label={<T id="importScriptModal.redeemScript" m="Redeem Script" />}
    >
      <TextInput
        autoFocus
        required
        requiredMessage={<T id="importScriptModal.errors.noScript" m="*Please enter your script" />}
        showErrors={hasFailedAttempt}
        id="script"
        type="text"
        placeholder=""
        value={script}
        onChange={(e) => setScript(e.target.value)}
      />
    </PassphraseModalField>
  </PassphraseModal>
);

export default Modal;
