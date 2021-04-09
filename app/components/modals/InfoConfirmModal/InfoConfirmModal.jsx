import Modal from "../Modal";
import { CloseButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import styles from "./InfoConfirmModal.module.css";
import { classNames } from "pi-ui";

const InfoConfirmModal = ({
  modalTitle,
  modalContent,
  show,
  onCancelModal,
  className
}) => (
  <Modal
    className={classNames(styles.infoConfirm, className)}
    {...{ show, onCancelModal }}>
    <div className={styles.header}>
      <div className={styles.headerTitle}>{modalTitle}</div>
    </div>
    <div>{modalContent}</div>
    <div className={styles.toolbar}>
      <CloseButton className={styles.closeButton} onClick={onCancelModal}>
        <T id="infoConfirmModal.btnClose" m="Close" />
      </CloseButton>
    </div>
  </Modal>
);

export default InfoConfirmModal;
