import Modal from "../Modal";
import { FormattedMessage as T } from "react-intl";
import { InvisibleButton, KeyBlueButton } from "buttons";
import styles from "./CantCloseModals.module.css";

const AutobuyerRunningModal = ({ show, onCancelModal, onSubmit }) => (
  <Modal className={styles.confirm} {...{ show, onCancelModal }}>
    <div className={styles.confirmHeader}>
      <div className={styles.confirmHeaderTitle}>
        <T id="account.mixer.running.title" m="Account mixer is running" />
      </div>
    </div>
    <div>
      <T
        id="account.mixer.running.message"
        m="Account mixer is currently running. Ongoing mixes will be
            cancelled and no more Decred will be mixed if you proceed."
      />
    </div>
    <div className={styles.confirmToolbar}>
      <KeyBlueButton className={styles.confirmConfirmButton} onClick={onSubmit}>
        <T
          id="tickets.mixer.running.confirmModal.closeAnyway"
          m="Close Anyway"
        />
      </KeyBlueButton>
      <InvisibleButton
        className={styles.confirmCloseButton}
        onClick={onCancelModal}>
        <T id="account.mixer.running.btnCancel" m="Cancel" />
      </InvisibleButton>
    </div>
  </Modal>
);

export default AutobuyerRunningModal;
