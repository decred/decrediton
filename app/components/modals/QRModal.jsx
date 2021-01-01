import Modal from "./Modal";
import style from "./Modals.module.css";
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
    className={classNames(style.qr, modalClassName)}
    {...{ show, onCancelModal, draggable }}>
    {modalTitle ? <>{modalTitle}</> : null}
    <div className={style.infoCloseButtonTop} onClick={onCancelModal} />
    <div>{pagesRemaining}</div>
    <div>{modalContent}</div>
    <div className={style.qrPages}>{pages}</div>
  </Modal>
);

export default QRModal;
