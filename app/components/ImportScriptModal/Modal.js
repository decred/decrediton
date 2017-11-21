import KeyBlueButton from "../KeyBlueButton";
import SlateGrayButton from "../SlateGrayButton";
import { FormattedMessage as T } from "react-intl";
import { TextInput, PasswordInput } from "inputs";
import "../../style/ImportScriptModal.less";

const Modal = ({
  hidden,
  heading,
  description,
  script,
  passPhrase,
  hasFailedAttempt,
  setScript,
  setPassPhrase,
  onSubmit,
  onCancel
}) => (
  <div hidden={hidden} className="import-script-modal">
    <div className="modal-section">
      <div className="import-script-modal-heading">{heading}</div>
      <div className="import-script-modal-description">{description}</div>
      <div className="import-script-modal-field-ct">
        <div className="import-script-modal-label">
          <T id="importScriptModal.redeemScript" m="Redeem Script" />
          :</div>
        <TextInput
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
        />
      </div>
      <div className="import-script-modal-error-ct">
        <div className="import-script-modal-label"></div>
        <div className="import-script-modal-error">{(hasFailedAttempt && !passPhrase)
          ? <T id="importScriptModal.errors.noPassphrase" m="*Please enter your private passphrase" />
          : null}</div>
      </div>
      <div className="import-script-modal-toolbar">
        <KeyBlueButton style={{float: "left"}} onClick={onSubmit}>import</KeyBlueButton>
        <SlateGrayButton style={{float: "right"}} onClick={onCancel}>cancel</SlateGrayButton>
      </div>
    </div>
  </div>
);

export default Modal;
