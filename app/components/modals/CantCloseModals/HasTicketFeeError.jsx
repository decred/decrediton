import Modal from "../Modal";
import { FormattedMessage as T } from "react-intl";
import { InvisibleButton, KeyBlueButton } from "buttons";
import style from "../Modals.module.css";
import { NavLink as Link } from "react-router-dom";

const AutobuyerRunningModal = ({ show, onCancelModal, onSubmit }) => {
  return (
    <Modal className={style.confirm} {...{ show, onCancelModal }}>
      <div className={style.confirmHeader}>
        <div className={style.confirmHeaderTitle}>
          <T id="tickets.fee.error.title" m="VSP Tickets Fee Error" />
        </div>
      </div>
      <div className={style.confirmContent}>
        <T
          id="tickets.fee.error.message"
          m={
            "You have outstanding tickets that are not properly registered with a VSP. {completeRegistrationProcessLink}, otherwise these tickets will be missed if they are chosen to vote."
          }
          values={{
            completeRegistrationProcessLink: (
              <Link to="/tickets/vspTicketsStatus" onClick={onCancelModal}>
                <T
                  id="modal.complete.registration.process"
                  m="Complete registration process"
                />
              </Link>
            )
          }}
        />
      </div>
      <div className={style.confirmToolbar}>
        <KeyBlueButton
          className={style.confirmConfirmButton}
          onClick={onSubmit}>
          <T id="tickets.fee.error.confirmModal.closeAnyway" m="Close Anyway" />
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
