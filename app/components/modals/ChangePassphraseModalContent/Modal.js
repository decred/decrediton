import KeyBlueButton from "KeyBlueButton";
import { FormattedMessage as T } from "react-intl";
import { PasswordInput } from "inputs";
import "style/ChangePassphraseModal.less";

const Modal = ({
  privpass,
  oldPrivPass,
  confirmPrivPass,
  privPassError,
  oldPrivPassError,
  confirmPrivPassError,
  updateOldPrivatePassphrase,
  updatePrivatePassphrase,
  updateConfirmPrivatePassphrase,
  onSubmit
}) => (
 <Aux>
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
        <KeyBlueButton className="change-passphrase-modal-save-button" onClick={onSubmit}>
          <T id="changePassModal.update" m="Update" />
        </KeyBlueButton>
      </div>
  </Aux>
);

export default Modal;
