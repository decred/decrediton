import Modal from "../Modal";
import { SlateGrayButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import PropTypes from "prop-types";

const propTypes = {
  modalTitle: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  modalContent: PropTypes.object.isRequired,
  onCancelModal: PropTypes.func.isRequired
};

const InfoModal = ({ modalTitle, modalContent, show, onCancelModal }) => (
  <Modal className="info-modal" {...{ show }}>
    <div className="info-modal-header">
      <div className="info-modal-header-title">
        {modalTitle}
      </div>
      <SlateGrayButton className="info-modal-close-button" onClick={onCancelModal}>
        <T id="infoModal.btnClose" m="Close" />
      </SlateGrayButton>
    </div>
    <div className="info-modal-content">
      {modalContent}
    </div>
  </Modal>
);

InfoModal.propTypes = propTypes;

export default InfoModal;
