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
          m="Decrediton is finishing the purchasing ticket process and should wait."
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
            m="Confirm"
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
