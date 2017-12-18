import { KeyBlueButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import { PasswordInput } from "inputs";
import "style/Modals.less";

const Modal =({
  passPhrase,
  setPassPhrase,
  hasAttemptedSubmit,
  onSubmit
}) => (
  <Aux>
    <div className="passphrase-modal-field-error-ct">
      <div className="passphrase-modal-field-ct">
        <div className="passphrase-modal-label">
          <T id="passphraseModal.privatePassphrase" m="Private Passphrase" />
          :</div>
        <PasswordInput
          autoFocus
          id="passphrase"
          className="passphrase-modal-field"
          placeholder=""
          value={passPhrase}
          onChange={(e) => setPassPhrase(e.target.value)}
        />
      </div>
      <div className="passphrase-modal-error-ct">
        <div className="passphrase-modal-label"></div>
        <div className="passphrase-modal-error">
          {(hasAttemptedSubmit && !passPhrase)
          ? <T id="passphraseModal.errors.noPassphrase" m="*Please enter your private passphrase" />
          : null}
        </div>
      </div>
    </div>
    <div className="passphrase-modal-toolbar">
      <KeyBlueButton className="passphrase-modal-save-button" onClick={onSubmit}>
        <T id="passphraseModal.confirm" m="confirm" />
      </KeyBlueButton>
    </div>
  </Aux>
);

export default Modal;
