import Modal from "../Modal";
import { KeyBlueButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import styles from "./InfoModal.module.css";
import { classNames } from "pi-ui";

const InfoModal = ({
  modalTitle,
  modalContent,
  modalClassName,
  show,
  onCancelModal,
  double,
  draggable
}) => (
  <Modal
    className={classNames(styles.info, double && styles.double, modalClassName)}
    {...{ show, onCancelModal, draggable }}>
    {modalTitle ? <>{modalTitle}</> : null}
    <div className={styles.closeButtonTop} onClick={onCancelModal} />
    <div className={styles.content}>{modalContent}</div>
    <KeyBlueButton className={styles.closeButton} onClick={onCancelModal}>
      <T id="infoModal.btnClose" m="Got it" />
    </KeyBlueButton>
  </Modal>
);

export default InfoModal;
