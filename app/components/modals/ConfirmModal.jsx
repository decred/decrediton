import Modal from "./Modal";
import { InvisibleButton, KeyBlueButton, DangerButton } from "buttons";
import { FormattedMessage as T } from "react-intl";
import style from "./Modals.module.css";

const ConfirmModal = ({
  modalTitle,
  modalContent,
  show,
  onCancelModal,
  onSubmit,
  confirmLabel,
  danger
}) => (
  <Modal className={style.confirm} {...{ show, onCancelModal }}>
    <div className={style.confirmHeader}>
      <div className={style.confirmHeaderTitle}>{modalTitle}</div>
    </div>
    <div className={style.confirmContent}>{modalContent}</div>
    <div className={style.confirmToolbar}>
      {danger ? (
        <DangerButton className={style.confirmConfirmButton} onClick={onSubmit}>
          {confirmLabel || <T id="infoModal.btnConfirm" m="Confirm" />}
        </DangerButton>
      ) : (
        <KeyBlueButton
          className={style.confirmConfirmButton}
          onClick={onSubmit}>
          {confirmLabel || <T id="infoModal.btnConfirm" m="Confirm" />}
        </KeyBlueButton>
      )}
      <InvisibleButton
        className={style.confirmCloseButton}
        onClick={onCancelModal}>
        <T id="confirmModal.btnCancel" m="Cancel" />
      </InvisibleButton>
    </div>
  </Modal>
);

export default ConfirmModal;
