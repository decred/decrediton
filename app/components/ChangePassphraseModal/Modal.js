import KeyBlueButton from "../KeyBlueButton";
import SlateGrayButton from "../SlateGrayButton";
import { FormattedMessage as T } from "react-intl";
import { PasswordInput } from "inputs";
import "style/ChangePassphraseModal.less";

const Modal = ({
  hidden,
  heading,
  description,
  privpass,
  oldPrivPass,
  confirmPrivPass,
  privPassError,
  oldPrivPassError,
  confirmPrivPassError,
  updateOldPrivatePassphrase,
  updatePrivatePassphrase,
  updateConfirmPrivatePassphrase,
  submitPassphrase,
  cancelPassphrase
}) => (
 <div hidden={hidden} className="change-passphrase-modal">
    <div className="modal-section">
      {heading ? [
        <div className="change-passphrase-modal-header">{heading}</div>,
        <div className="change-passphrase-modal-description">{description}</div>
      ] : null}
      <div className="change-passphrase-modal-field-ct">
        <div className="change-passphrase-modal-label">
          <T id="changePassModal.oldPassphrase" m="Old Private Passphrase" />
          :</div>
        <PasswordInput
          id="oldPassphrase"
          className="change-passphrase-modal-field"
          placeholder=""
          defaultValue={oldPrivPass}
          onChange={(e) => updateOldPrivatePassphrase(e.target.value)}
        />
        <div className="change-passphrase-modal-error">{oldPrivPassError}</div>
      </div>
      <div className="change-passphrase-modal-field-ct">
        <div className="change-passphrase-modal-label">
          <T id="changePassModal.newPassphrase" m="New Private Passphrase" />
          :</div>
        <PasswordInput
          id="passphrase"
          className="change-passphrase-modal-field"
          placeholder=""
          defaultValue={privpass}
          onChange={(e) => updatePrivatePassphrase(e.target.value)}
        />
        <div className="change-passphrase-modal-error">{privPassError}</div>
      </div>
      <div className="change-passphrase-modal-field-ct">
        <div className="change-passphrase-modal-label">
          <T id="changePassModal.confirm" m="Confirm" />
          :</div>
        <PasswordInput
          id='confirmPassphrase'
          className="change-passphrase-modal-field"
          placeholder=""
          defaultValue={confirmPrivPass}
          onChange={(e) => updateConfirmPrivatePassphrase(e.target.value)}
        />
        <div className="change-passphrase-modal-error">{confirmPrivPassError}</div>
      </div>
      <div className="change-passphrase-modal-toolbar">
        <KeyBlueButton className="change-passphrase-modal-save-button" onClick={submitPassphrase}>
          <T id="changePassModal.update" m="Update" />
        </KeyBlueButton>
        <SlateGrayButton className="change-passphrase-modal-cancel-button" onClick={cancelPassphrase}>
          <T id="changePassModal.cancel" m="Cancel" />
        </SlateGrayButton>
      </div>
    </div>
  </div>
);

export default Modal;
