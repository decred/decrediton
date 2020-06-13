import Modal from "./Modal";
import { FormattedMessage as T } from "react-intl";
import { InvisibleButton, KeyBlueButton } from "buttons";
import style from "./Modals.module.css";

const AutobuyerRunningModal = ({ show, onCancelModal, onSubmit }) => (
  <Modal className={style.confirmModal} {...{ show, onCancelModal }}>
    <div className={style.confirmModalHeader}>
      <div className={style.confirmModalHeaderTitle}>
        <T
          id="tickets.autobuyerRunning.title"
          m="Auto Ticket Buyer Still Running"
        />
      </div>
    </div>
    <div className={style.confirmModalContent}>
      <T
        id="tickets.autobuyerRunning.message"
        m="If you proceed, it will be closed and no more tickets will be purchased."
      />
    </div>
    <div className={style.confirmModalToolbar}>
      <KeyBlueButton
        className={style.confirmModalConfirmButton}
        onClick={onSubmit}>
        {
          <T
            id="tickets.autobuyerRunning.confirmModal.btnConfirm"
            m="Confirm"
          />
        }
      </KeyBlueButton>
      <InvisibleButton
        className={style.confirmModalCloseButton}
        onClick={onCancelModal}>
        <T id="tickets.autobuyerRunning.confirmModal.btnCancel" m="Cancel" />
      </InvisibleButton>
    </div>
  </Modal>
);

export default AutobuyerRunningModal;
