import { FormattedMessage as T } from "react-intl";
import { PasswordInput } from "inputs";
import { PassphraseModal } from "../PassphraseModal";
import "style/Modals.less";

const Modal = ({
  privpass,
  updatePrivatePassphrase,
  privPassError,
  confirmPrivPass,
  updateConfirmPrivatePassphrase,
  confirmPrivPassError,
  onSubmit,
  ...props
}) => (
  <PassphraseModal {...{onSubmit, ...props}} >
    <div className="change-passphrase-modal-field-ct">
      <div className="change-passphrase-modal-label">
        <T id="changePassModal.newPassphrase" m="New Private Passphrase" />:
      </div>
      <PasswordInput
        id="passphrase"
        className="change-passphrase-modal-field"
        placeholder=""
        defaultValue={privpass}
        onChange={(e) => updatePrivatePassphrase(e.target.value)}
        onKeyDownSubmit={onSubmit}
      />
      <div className="change-passphrase-modal-error">{privPassError}</div>
    </div>
    <div className="change-passphrase-modal-field-ct">
      <div className="change-passphrase-modal-label">
        <T id="changePassModal.confirm" m="Confirm" />:
      </div>
      <PasswordInput
        id='confirmPassphrase'
        className="change-passphrase-modal-field"
        placeholder=""
        defaultValue={confirmPrivPass}
        onChange={(e) => updateConfirmPrivatePassphrase(e.target.value)}
        onKeyDownSubmit={onSubmit}
      />
      <div className="change-passphrase-modal-error">{confirmPrivPassError}</div>
    </div>
  </PassphraseModal>
);

export default Modal;
