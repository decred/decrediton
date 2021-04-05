import Modal from "../Modal";
import { FormattedMessage as T } from "react-intl";
import { InvisibleButton, KeyBlueButton } from "buttons";
import styles from "./CantCloseModals.module.css";

const AutobuyerRunningModal = ({ show, onCancelModal, onSubmit }) => (
  <Modal className={styles.confirm} {...{ show, onCancelModal }}>
    <div className={styles.header}>
      <div className={styles.headerTitle}>
        <T id="tickets.purchasing.title" m="Purchasing Tickets" />
      </div>
    </div>
    <div>
      <T
        id="tickets.purchasing.message"
        m="Decrediton is still finalizing ticket purchases. Tickets may not
            be registered with the VSP if you proceed now, which can
            result in missed votes."
      />
    </div>
    <div className={styles.toolbar}>
      <KeyBlueButton className={styles.confirmButton} onClick={onSubmit}>
        <T id="tickets.purchasing.confirmModal.closeAnyway" m="Close Anyway" />
      </KeyBlueButton>
      <InvisibleButton className={styles.closeButton} onClick={onCancelModal}>
        <T id="tickets.purchasing.confirmModal.btnCancel" m="Cancel" />
      </InvisibleButton>
    </div>
  </Modal>
);

export default AutobuyerRunningModal;
