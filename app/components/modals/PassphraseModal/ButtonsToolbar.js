import { KeyBlueButton, InvisibleButton } from "buttons";
import { FormattedMessage as T } from "react-intl";

const PassphraseModalButtonsToolbar = ({ onSubmit, onCancelModal, submitLabel }) =>
  <div className="passphrase-modal-toolbar">
    <KeyBlueButton className="passphrase-modal-save-button" onClick={onSubmit}>
      {submitLabel ? submitLabel : <T id="passphraseModal.confirm" m="confirm" />}
    </KeyBlueButton>
    <InvisibleButton className="passphrase-modal-close-button" onClick={onCancelModal}>
      <T id="passphraseModal.btnCancel" m="Cancel" />
    </InvisibleButton>
  </div>;

export default PassphraseModalButtonsToolbar;
