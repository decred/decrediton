import Modal from "../Modal";
import { FormattedMessage as T } from "react-intl";
import { InvisibleButton, KeyBlueButton } from "buttons";
import { useCantCloseModal } from "./hooks";
import style from "../Modals.module.css";

const AutobuyerRunningModal = ({ show, onCancelModal, onSubmit }) => {
  const { onGoToTicketsStatus } = useCantCloseModal();

  return (
    <Modal className={style.confirm} {...{ show, onCancelModal }}>
      <div className={style.confirmHeader}>
        <div className={style.confirmHeaderTitle}>
          <T
            id="tickets.fee.error.title"
            m="VSP Tickets Fee Error"
          />
        </div>
      </div>
      <div className={style.confirmContent}>
        <T
          id="tickets.fee.error.message"
          m="You still have unpaid tickets fee. If you proceed and they are chosen to vote, they will
          be missed. Click on this button for re-sync fees"
        />
        <KeyBlueButton
          onClick={onGoToTicketsStatus}
          className={style.goToTicketStatus}
        >
          <T
            id="modal.go.to.tickets.status"
            m="Go to ticket status"
          />
        </KeyBlueButton>
      </div>
      <div className={style.confirmToolbar}>
        <KeyBlueButton
          className={style.confirmConfirmButton}
          onClick={onSubmit}>
          <T
            id="tickets.fee.error.confirmModal.btnConfirm"
            m="Confirm"
          />
        </KeyBlueButton>
        <InvisibleButton
          className={style.confirmCloseButton}
          onClick={onCancelModal}>
          <T id="tickets.fee.error.confirmModal.btnCancel" m="Cancel" />
        </InvisibleButton>
      </div>
    </Modal>
  );
};

export default AutobuyerRunningModal;
