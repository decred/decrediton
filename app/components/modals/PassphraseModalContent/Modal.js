import { FormattedMessage as T } from "react-intl";
import { PasswordInput } from "inputs";
import ButtonsToolbar from "../PassphraseModal/ButtonsToolbar";
import "style/Modals.less";

const Modal =({
  passPhrase,
  setPassPhrase,
  hasAttemptedSubmit,
  onSubmit,
  onCancelModal
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
          onKeyDownSubmit={onSubmit}
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
    <ButtonsToolbar {...{onSubmit, onCancelModal}} />
  </Aux>
);

export default Modal;
