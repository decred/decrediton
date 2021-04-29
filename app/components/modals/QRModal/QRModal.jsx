import Modal from "../Modal";
import styles from "./QRModal.module.css";
import { classNames } from "pi-ui";

const QRModal = ({
  modalTitle,
  modalContent,
  modalClassName,
  show,
  onCancelModal,
  pages,
  pagesRemaining,
  draggable
}) => (
  <Modal
    className={classNames(styles.qr, modalClassName)}
    {...{ show, onCancelModal, draggable }}>
    <div className={styles.qrTitle}>{modalTitle && modalTitle}</div>
    <div className={styles.closeButton} onClick={onCancelModal} />
    <div className={styles.qrContent}>{modalContent}</div>
    {pagesRemaining && <div className={styles.qrCounter}>{pagesRemaining}</div>}
    {pages}
  </Modal>
);

export default QRModal;
