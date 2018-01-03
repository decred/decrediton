import { FormattedMessage as T } from "react-intl";
import { TextInput, PasswordInput } from "inputs";
import { ButtonsToolbar } from "../PassphraseModal";
import "style/Modals.less";

const Modal = ({
  name,
  passPhrase,
  hasFailedAttempt,
  setName,
  setPassPhrase,
  onSubmit,
  onCancelModal
}) => (
  <Aux>
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
        onKeyDownSubmit={onSubmit}
      />
    </div>
    <div className="import-script-modal-error-ct">
      <div className="import-script-modal-label"></div>
      <div className="import-script-modal-error">{(hasFailedAttempt && !name)
        ? <T id="addAccountModal.errors.noPassphrase" m="*Please enter your private passphrase" />
        : null}</div>
    </div>
    <ButtonsToolbar
      {...{onSubmit, onCancelModal}}
      submitLabel={<T id="addAccountModal.addBtn" m="Add" />} />
  </Aux>
);

export default Modal;
