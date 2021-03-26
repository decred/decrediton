import Modal from "../Modal";
// XXX this isn't ideal, we should have modal specific css module!!!
import styles from "../Modals.module.css";
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
    {modalTitle && modalTitle}
    <div className={styles.infoCloseButtonTop} onClick={onCancelModal} />
    <div>{pagesRemaining}</div>
    <div>{modalContent}</div>
    <div className={styles.qrPages}>{pages}</div>
  </Modal>
);

export default QRModal;
