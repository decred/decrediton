import Modal from "./Modal";
import { FormattedMessage as T } from "react-intl";
import { InvisibleButton, KeyBlueButton } from "buttons";
import style from "./Modals.module.css";

const AutobuyerRunningModal = ({ show, onCancelModal, onSubmit }) => (
  <Modal className={style.confirm} {...{ show, onCancelModal }}>
    <div className={style.confirmHeader}>
      <div className={style.confirmHeaderTitle}>
        <T
          id="tickets.autobuyerRunning.title"
          m="Auto Ticket Buyer Still Running"
        />
      </div>
    </div>
    <div className={style.confirmContent}>
      <T
        id="tickets.autobuyerRunning.message"
        m="If you proceed, it will be closed and no more tickets will be purchased."
      />
    </div>
    <div className={style.confirmToolbar}>
      <KeyBlueButton
        className={style.confirmConfirmButton}
        onClick={onSubmit}>
        {
          <T
            id="tickets.autobuyerRunning.confirmModal.btnConfirm"
            m="Confirm"
          />
        }
      </KeyBlueButton>
      <InvisibleButton
        className={style.confirmCloseButton}
        onClick={onCancelModal}>
        <T id="tickets.autobuyerRunning.confirmModal.btnCancel" m="Cancel" />
      </InvisibleButton>
    </div>
  </Modal>
);

export default AutobuyerRunningModal;
