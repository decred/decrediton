import DefaultModal from "../Modal";
import { SlateGrayButton, DangerButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import { TextInput } from "inputs";
import { ExternalLink } from "shared";

const propTypes = {
  show: PropTypes.bool.isRequired,
  onCancelModal: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  copyConfirmationPhrase: PropTypes.string.isRequired,
};

const Modal = ({show, onCancelModal, onSubmit, copyConfirmationPhrase,
  typedConfirmationPhrase, onTypedConfirmationPhraseChanged}) => (
  <DefaultModal className="confirm-seed-copy-modal" {...{ show }}>
    <div className="confirm-seed-copy-modal-header">
      <div className="confirm-seed-copy-modal-header-title">
        <T id="seedCopyConfirmModal.title" m="Seed Clipboard Copy Warning" />
      </div>
    </div>
    <div className="confirm-seed-copy-modal-content">
      <p className="confirm-seed-copy-warning-text">
        <T id="seedCopyConfirmModal.warningText" m={`Please note that copying the seed to the clipboard may be a security risk, as other applications may be able to monitor and copy the contents of the clipboard.

          It is also highly unadvised to maintain the seed on a computer file, specially without encryption, as that can lead to stealing of funds by anyone with access to the computer.

          Further, storing the seed on a computer file without backing it up on a physical medium (written down piece of paper stored in a secure location) can cause loss of funds if the local wallet file gets corrupted or is otherwise unavailable (due to hardware failure or any other number of issues).

          If you want to learn more about seed security, please check our seed FAQ located at {seedFaqURL}.

          If you are sure you understand the risks and still want to copy the seed to the clipboard, please type the phrase {confirmationPhrase} in the box below and the seed will be copied to the clipboard.`}
        values={{
          seedFaqURL: <ExternalLink href="https://docs.decred.org/faq/wallets-and-seeds/">https://docs.decred.org/faq/wallets-and-seeds/</ExternalLink>,
          confirmationPhrase: <span className="mono confirm-seed-copy-phrase">'{copyConfirmationPhrase}'</span>,
        }}/>
      </p>
      <TextInput
        autoFocus
        value={typedConfirmationPhrase}
        onChange={(e) => onTypedConfirmationPhraseChanged(e.target.value)}/>
    </div>
    <div className="confirm-seed-copy-modal-toolbar">
      <DangerButton className="confirm-modal-confirm-button" onClick={onSubmit} disabled={typedConfirmationPhrase.toLowerCase() !== copyConfirmationPhrase.toLowerCase()}>
        <T id="seedCopyConfirm.btnConfirm" m="Confirm Seed Copy" />
      </DangerButton>
      <SlateGrayButton className="confirm-modal-close-button" onClick={onCancelModal}>
        <T id="seedCopyConfirm.btnCancel" m="Cancel" />
      </SlateGrayButton>
    </div>
  </DefaultModal>
);

Modal.propTypes = propTypes;

export default Modal;
