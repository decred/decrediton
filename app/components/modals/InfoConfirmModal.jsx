import Modal from "./Modal";
import { CloseButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import style from "./Modals.module.css";
import { classNames } from "pi-ui";

const ConfirmModal = ({
  modalTitle,
  modalContent,
  show,
  onCancelModal,
  className
}) => (
  <Modal
    className={classNames(style.infoConfirmModal, className)}
    {...{ show, onCancelModal }}>
    <div className={style.confirmModalHeader}>
      <div className={style.confirmModalHeaderTitle}>{modalTitle}</div>
    </div>
    <div className={style.confirmModalContent}>{modalContent}</div>
    <div className={style.confirmModalToolbar}>
      <CloseButton
        className={style.confirmModalCloseButton}
        onClick={onCancelModal}>
        <T id="infoConfirmModal.btnClose" m="Close" />
      </CloseButton>
    </div>
  </Modal>
);

export default ConfirmModal;
