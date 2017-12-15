import KeyBlueButton from "KeyBlueButton";
import { FormattedMessage as T } from "react-intl";
import { TextInput, PasswordInput } from "inputs";
import "style/Modals.less";

const Modal = ({
  name,
  passPhrase,
  hasFailedAttempt,
  setName,
  setPassPhrase,
  onSubmit
}) => (
  <Aux>
    <div className="import-script-modal-field-ct">
      <div className="import-script-modal-label">
        <T id="addAccountModal.newAccountName" m="New Account Name" />
        :</div>
      <TextInput
        autoFocus={true}
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
    <div className="import-script-modal-field-ct">
      <div className="import-script-modal-label">
        <T id="addAccountModal.privatePassphrase" m="Private Passphrase" />
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
      <div className="import-script-modal-error">{(hasFailedAttempt && !name)
        ? <T id="addAccountModal.errors.noPassphrase" m="*Please enter your private passphrase" />
        : null}</div>
    </div>
    <div className="import-script-modal-toolbar">
      <KeyBlueButton style={{float: "left"}} onClick={onSubmit}>
        <T id="addAccountModal.addBtn" m="Add" />
      </KeyBlueButton>
    </div>
  </Aux>
);

export default Modal;
