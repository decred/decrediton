import Modal from "../Modal";
import { KeyBlueButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import PropTypes from "prop-types";

const propTypes = {
  modalTitle: PropTypes.object,
  show: PropTypes.bool.isRequired,
  modalContent: PropTypes.object.isRequired,
  onCancelModal: PropTypes.func.isRequired
};

const Title = ({ modalTitle }) => (
  <div className="info-modal-header-title">
    {modalTitle}
  </div>
);

const InfoModal = ({ modalTitle, modalContent, modalClassName, show, onCancelModal, double, draggable }) => (
  <Modal className={(double ? "info-modal double " : "info-modal ") + (modalClassName || "")} {...{ show, onCancelModal, draggable }}>
    {modalTitle ? <Title {...{ modalTitle }} /> : null }
    <div className="info-modal-close-button-top cancel-dragging" onClick={onCancelModal}/>
    <div className="info-modal-content cancel-dragging">
      {modalContent}
    </div>
    <KeyBlueButton className="info-modal-close-button cancel-dragging" onClick={onCancelModal}>
      <T id="infoModal.btnClose" m="Got it" />
    </KeyBlueButton>
  </Modal>
);

InfoModal.propTypes = propTypes;

export default InfoModal;
