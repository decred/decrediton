import { FormattedMessage as T } from "react-intl";
import { TextInput, PasswordInput } from "inputs";
import { ButtonsToolbar } from "../PassphraseModal";
import "style/Modals.less";

const Modal = ({
  script,
  passPhrase,
  hasFailedAttempt,
  setScript,
  setPassPhrase,
  onSubmit,
  onCancelModal,
}) => (
  <Aux>
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
    <div className="import-script-modal-field-ct">
      <div className="import-script-modal-label">
        <T id="importScriptModal.privatePassphrase" m="Private Passphrase" />
         :</div>
      <PasswordInput
        id="passphrase"
        className="import-script-modal-field"
        placeholder=""
        value={passPhrase}
        onChange={(e) => setPassPhrase(e.target.value)}
        onKeyDownSubmit={onSubmit}
      />
    </div>
    <div className="import-script-modal-error-ct">
      <div className="import-script-modal-label"></div>
      <div className="import-script-modal-error">{(hasFailedAttempt && !passPhrase)
        ? <T id="importScriptModal.errors.noPassphrase" m="*Please enter your private passphrase" />
        : null}</div>
    </div>
    <ButtonsToolbar
      {...{onSubmit, onCancelModal}}
      submitLabel={<T id="importScriptModal.importBtn" m="Import" />} />
  </Aux>
);

export default Modal;
