import Modal from "../Modal";
import { FormattedMessage as T } from "react-intl";
import { InvisibleButton, KeyBlueButton } from "buttons";
import styles from "./CantCloseModals.module.css";

const AutobuyerRunningModal = ({ show, onCancelModal, onSubmit }) => (
  <Modal className={styles.confirm} {...{ show, onCancelModal }}>
    <div className={styles.confirmHeader}>
      <div className={styles.confirmHeaderTitle}>
        <T
          id="tickets.autobuyerRunning.title"
          m="Auto Ticket Buyer Still Running"
        />
      </div>
    </div>
    <div>
      <T
        id="tickets.autobuyerRunning.message"
        m="If you proceed, it will be closed and no more tickets will be purchased."
      />
    </div>
    <div className={styles.confirmToolbar}>
      <KeyBlueButton className={styles.confirmConfirmButton} onClick={onSubmit}>
        <T
          id="tickets.autobuyerRunning.confirmModal.closeAnyway"
          m="Close Anyway"
        />
      </KeyBlueButton>
      <InvisibleButton
        className={styles.confirmCloseButton}
        onClick={onCancelModal}>
        <T id="tickets.autobuyerRunning.confirmModal.btnCancel" m="Cancel" />
      </InvisibleButton>
    </div>
  </Modal>
);

export default AutobuyerRunningModal;
