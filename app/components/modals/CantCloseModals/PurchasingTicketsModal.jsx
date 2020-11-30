import Modal from "../Modal";
import { FormattedMessage as T } from "react-intl";
import { InvisibleButton, KeyBlueButton } from "buttons";
import style from "../Modals.module.css";

const AutobuyerRunningModal = ({ show, onCancelModal, onSubmit }) => (
  <Modal className={style.confirm} {...{ show, onCancelModal }}>
    <div className={style.confirmHeader}>
      <div className={style.confirmHeaderTitle}>
        <T
          id="tickets.purchasing.title"
          m="Purchasing Tickets"
        />
      </div>
    </div>
    {
      <div className={style.confirmContent}>
        <T
          id="tickets.purchasing.message"
          m="Decrediton is still finalizing ticket purchases. Tickets may not
            be registered with the VSP if Decrediton is closed now, which can
            result in missed votes."
        />
      </div>

    }
    <div className={style.confirmToolbar}>
      <KeyBlueButton
        className={style.confirmConfirmButton}
        onClick={onSubmit}>
        {
          <T
            id="tickets.purchasing.confirmModal.btnConfirm"
            m="Close Decrediton"
          />
        }
      </KeyBlueButton>
      <InvisibleButton
        className={style.confirmCloseButton}
        onClick={onCancelModal}>
        <T id="tickets.purchasing.confirmModal.btnCancel" m="Cancel" />
      </InvisibleButton>
    </div>
  </Modal>
);

export default AutobuyerRunningModal;
