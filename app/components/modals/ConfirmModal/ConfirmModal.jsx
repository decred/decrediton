import Modal from "../Modal";
import { InvisibleButton, KeyBlueButton, DangerButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import styles from "./ConfirmModal.module.css";

const ConfirmModal = ({
  modalTitle,
  modalContent,
  show,
  onCancelModal,
  onSubmit,
  confirmLabel,
  danger
}) => (
  <Modal className={styles.confirm} {...{ show, onCancelModal }}>
    <div className={styles.confirmHeader}>
      <div className={styles.confirmHeaderTitle}>{modalTitle}</div>
    </div>
    <div>{modalContent}</div>
    <div className={styles.confirmToolbar}>
      {danger ? (
        <DangerButton
          className={styles.confirmConfirmButton}
          onClick={onSubmit}>
          {confirmLabel || <T id="infoModal.btnConfirm" m="Confirm" />}
        </DangerButton>
      ) : (
        <KeyBlueButton
          className={styles.confirmConfirmButton}
          onClick={onSubmit}>
          {confirmLabel || <T id="infoModal.btnConfirm" m="Confirm" />}
        </KeyBlueButton>
      )}
      <InvisibleButton
        className={styles.confirmCloseButton}
        onClick={onCancelModal}>
        <T id="confirmModal.btnCancel" m="Cancel" />
      </InvisibleButton>
    </div>
  </Modal>
);

export default ConfirmModal;
