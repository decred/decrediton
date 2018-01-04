import { FormattedMessage as T } from "react-intl";
import { TextInput } from "inputs";
import { PassphraseModal } from "../PassphraseModal";
import "style/Modals.less";

const Modal = ({
  script,
  hasFailedAttempt,
  setScript,
  ...props
}) => (
  <PassphraseModal {...props} >
    <div className="import-script-modal-field-ct">
      <div className="import-script-modal-label">
        <T id="importScriptModal.redeemScript" m="Redeem Script" />
        :</div>
      <TextInput
        autoFocus
        id="script"
        className="import-script-modal-field"
        type="text"
        placeholder=""
        value={script}
        onChange={(e) => setScript(e.target.value)}
      />
    </div>
    <div className="import-script-modal-error-ct">
      <div className="import-script-modal-label"></div>
      <div className="import-script-modal-error">{(hasFailedAttempt && !script)
        ? <T id="importScriptModal.errors.noScript" m="*Please enter your script" />
        : null}</div>
    </div>
  </PassphraseModal>
);

export default Modal;
