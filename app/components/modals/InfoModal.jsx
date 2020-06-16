import Modal from "./Modal";
import { KeyBlueButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import style from "./Modals.module.css";
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
    className={classNames(
      style.infoModal,
      double && style.double,
      modalClassName
    )}
    {...{ show, onCancelModal, draggable }}>
    {modalTitle ? <>{modalTitle}</> : null}
    <div className={style.infoModalCloseButtonTop} onClick={onCancelModal} />
    <div className={style.infoModalContent}>{modalContent}</div>
    <KeyBlueButton
      className={style.infoModalCloseButton}
      onClick={onCancelModal}>
      <T id="infoModal.btnClose" m="Got it" />
    </KeyBlueButton>
  </Modal>
);

export default InfoModal;
