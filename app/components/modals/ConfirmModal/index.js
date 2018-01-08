import Modal from "../Modal";
import { SlateGrayButton, KeyBlueButton } from "buttons";
import { FormattedMessage as T } from "react-intl";

const propTypes = {
  modalTitle: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  modalContent: PropTypes.object.isRequired,
  onCancelModal: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

const ConfirmModal = ({modalTitle, modalContent, show, onCancelModal, onSubmit,
  confirmLabel}) => (
  <Modal className="confirm-modal" {...{ show }}>
    <div className="confirm-modal-header">
      <div className="confirm-modal-header-title">
        {modalTitle}
      </div>
    </div>
    <div className="confirm-modal-content">
      {modalContent}
    </div>
    <div className="confirm-modal-toolbar">
      <KeyBlueButton className="confirm-modal-confirm-button" onClick={onSubmit}>
        {confirmLabel || <T id="infoModal.btnConfirm" m="Confirm" />}
      </KeyBlueButton>
      <SlateGrayButton className="confirm-modal-close-button" onClick={onCancelModal}>
        <T id="confirmModal.btnCancel" m="Cancel" />
      </SlateGrayButton>
    </div>
  </Modal>
);

ConfirmModal.propTypes = propTypes;

export default ConfirmModal;
