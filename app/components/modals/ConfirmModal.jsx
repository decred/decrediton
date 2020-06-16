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
    <Modal className={style.confirmModal} {...{ show, onCancelModal }}>
      <div className={style.confirmModalHeader}>
        <div className={style.confirmModalHeaderTitle}>{modalTitle}</div>
      </div>
      <div className={style.confirmModalContent}>{modalContent}</div>
      <div className={style.confirmModalToolbar}>
        {danger ? (
          <DangerButton
            className={style.confirmModalConfirmButton}
            onClick={onSubmit}>
            {confirmLabel || <T id="infoModal.btnConfirm" m="Confirm" />}
          </DangerButton>
        ) : (
            <KeyBlueButton
              className={style.confirmModalConfirmButton}
              onClick={onSubmit}>
              {confirmLabel || <T id="infoModal.btnConfirm" m="Confirm" />}
            </KeyBlueButton>
          )}
        <InvisibleButton
          className={style.confirmModalCloseButton}
          onClick={onCancelModal}>
          <T id="confirmModal.btnCancel" m="Cancel" />
        </InvisibleButton>
      </div>
    </Modal>
  );

export default ConfirmModal;
