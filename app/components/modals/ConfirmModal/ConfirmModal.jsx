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
    <div className={styles.header}>
      <div className={styles.headerTitle}>{modalTitle}</div>
    </div>
    <div>{modalContent}</div>
    <div className={styles.toolbar}>
      {danger ? (
        <DangerButton className={styles.confirmButton} onClick={onSubmit}>
          {confirmLabel || <T id="infoModal.btnConfirm" m="Confirm" />}
        </DangerButton>
      ) : (
        <KeyBlueButton className={styles.confirmButton} onClick={onSubmit}>
          {confirmLabel || <T id="infoModal.btnConfirm" m="Confirm" />}
        </KeyBlueButton>
      )}
      <InvisibleButton className={styles.closeButton} onClick={onCancelModal}>
        <T id="confirmModal.btnCancel" m="Cancel" />
      </InvisibleButton>
    </div>
  </Modal>
);

export default ConfirmModal;
