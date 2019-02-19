import Modal from "../Modal";
import { FormattedMessage as T } from "react-intl";
import { InvisibleButton, KeyBlueButton } from "buttons";

const propTypes = {
  show: PropTypes.bool.isRequired,
  onCancelModal: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired
};

const AutobuyerRunningModal = ({ show, onCancelModal, onSubmit }) => (
  <Modal className="confirm-modal" {...{ show, onCancelModal }}>
    <div className="confirm-modal-header">
      <div className="confirm-modal-header-title">
        <T id="tickets.autobuyerRunning.title" m="Auto Ticket Buyer Still Running" />
      </div>
    </div>
    <div className="confirm-modal-content">
      <T id="tickets.autobuyerRunning.message" m="If you proceed, it will be closed and no more tickets will be purchased."/>
    </div>
    <div className="confirm-modal-toolbar">
      <KeyBlueButton className="confirm-modal-confirm-button" onClick={onSubmit}>
        {<T id="tickets.autobuyerRunning.confirmModal.btnConfirm" m="Confirm" />}
      </KeyBlueButton>
      <InvisibleButton className="confirm-modal-close-button" onClick={onCancelModal}>
        <T id="tickets.autobuyerRunning.confirmModal.btnCancel" m="Cancel" />
      </InvisibleButton>
    </div>
  </Modal>
);

AutobuyerRunningModal.propTypes = propTypes;

export default AutobuyerRunningModal;
