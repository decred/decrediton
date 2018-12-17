import DefaultModal from "../Modal";
import { InvisibleButton, DangerButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import { Documentation } from "shared";
import { TextInput } from "inputs";

const propTypes = {
  show: PropTypes.bool.isRequired,
  onCancelModal: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  copyConfirmationPhrase: PropTypes.string.isRequired,
};

const Modal = ({ show, onCancelModal, onSubmit, copyConfirmationPhrase,
  typedConfirmationPhrase, onTypedConfirmationPhraseChanged }) => (
  <DefaultModal className="confirm-seed-copy-modal" {...{ show }}>
    <div className="confirm-seed-copy-modal-content">
      <div className="confirm-seed-copy-warning-text">
        <Documentation name="SeedCopyWarning" />
        <T
          id="seedCopyConfirmModal.confirmPhraseInstruction"
          m="Please type {confirmationPhrase} to copy the seed."
          values={{ confirmationPhrase: <span className="mono confirm-seed-copy-phrase">'{copyConfirmationPhrase}'</span> }} />
      </div>
      <TextInput
        autoFocus
        value={typedConfirmationPhrase}
        onChange={(e) => onTypedConfirmationPhraseChanged(e.target.value)}
        onKeyDownSubmit={() => typedConfirmationPhrase.toLowerCase() === copyConfirmationPhrase.toLowerCase() && onSubmit() }
      />
    </div>
    <div className="confirm-seed-copy-modal-toolbar">
      <DangerButton className="confirm-modal-confirm-button" onClick={onSubmit} disabled={typedConfirmationPhrase.toLowerCase() !== copyConfirmationPhrase.toLowerCase()}>
        <T id="seedCopyConfirm.btnConfirm" m="Confirm Seed Copy" />
      </DangerButton>
      <InvisibleButton className="confirm-modal-close-button" onClick={onCancelModal}>
        <T id="seedCopyConfirm.btnCancel" m="Cancel" />
      </InvisibleButton>
    </div>
  </DefaultModal>
);

Modal.propTypes = propTypes;

export default Modal;
