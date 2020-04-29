import Modal from "../Modal";
import { CloseButton } from "buttons";
import { FormattedMessage as T } from "react-intl";

const propTypes = {
  modalTitle: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  modalContent: PropTypes.object.isRequired,
  onCancelModal: PropTypes.func.isRequired
};

const ConfirmModal = ({
  modalTitle,
  modalContent,
  show,
  onCancelModal,
  className
}) => (
  <Modal
    className={`info-confirm-modal ${className}`}
    {...{ show, onCancelModal }}>
    <div className="confirm-modal-header">
      <div className="confirm-modal-header-title">{modalTitle}</div>
    </div>
    <div className="confirm-modal-content">{modalContent}</div>
    <div className="confirm-modal-toolbar">
      <CloseButton
        className="confirm-modal-close-button"
        onClick={onCancelModal}>
        <T id="infoConfirmModal.btnClose" m="Close" />
      </CloseButton>
    </div>
  </Modal>
);

ConfirmModal.propTypes = propTypes;

export default ConfirmModal;
