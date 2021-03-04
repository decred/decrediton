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
    className={classNames(style.infoConfirm, className)}
    {...{ show, onCancelModal }}>
    <div className={style.confirmHeader}>
      <div className={style.confirmHeaderTitle}>{modalTitle}</div>
    </div>
    <div className={style.confirmContent}>{modalContent}</div>
    <div className={style.confirmToolbar}>
      <CloseButton className={style.confirmCloseButton} onClick={onCancelModal}>
        <T id="infoConfirmModal.btnClose" m="Close" />
      </CloseButton>
    </div>
  </Modal>
);

export default ConfirmModal;
