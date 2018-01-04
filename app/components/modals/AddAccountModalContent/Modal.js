import { FormattedMessage as T } from "react-intl";
import { TextInput } from "inputs";
import { PassphraseModal } from "../PassphraseModal";
import "style/Modals.less";

const Modal = ({
  name,
  hasFailedAttempt,
  setName,
  ...props
}) => (
  <PassphraseModal {...props} >
    <div className="import-script-modal-field-ct">
      <div className="import-script-modal-label">
        <T id="addAccountModal.newAccountName" m="New Account Name" />
        :</div>
      <TextInput
        autoFocus
        id="name"
        className="import-script-modal-field"
        type="text"
        placeholder=""
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
    </div>
    <div className="import-script-modal-error-ct">
      <div className="import-script-modal-label"></div>
      <div className="import-script-modal-error">{(hasFailedAttempt && !name)
        ? <T id="addAccountModal.errors.noAccountName" m="*Please enter your new account name" />
        : null}</div>
    </div>
  </PassphraseModal>
);

export default Modal;
