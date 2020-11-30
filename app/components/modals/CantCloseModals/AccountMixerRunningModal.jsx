import Modal from "../Modal";
import { FormattedMessage as T } from "react-intl";
import { InvisibleButton, KeyBlueButton } from "buttons";
import style from "../Modals.module.css";

const AutobuyerRunningModal = ({ show, onCancelModal, onSubmit }) => (
  <Modal className={style.confirm} {...{ show, onCancelModal }}>
    <div className={style.confirmHeader}>
      <div className={style.confirmHeaderTitle}>
        <T
          id="account.mixer.running.title"
          m="Account mixer is running"
        />
      </div>
    </div>
    {
      <div className={style.confirmContent}>
        <T
          id="account.mixer.running.message"
          m="Account mixer is currently running. Ongoing mixes will be
            cancelled and no more Decred will be mixed if Decrediton is
            closed now."
        />
      </div>

    }
    <div className={style.confirmToolbar}>
      <KeyBlueButton
        className={style.confirmConfirmButton}
        onClick={onSubmit}>
        {
          <T
            id="account.mixer.running.btnConfirm"
            m="Close Decrediton"
          />
        }
      </KeyBlueButton>
      <InvisibleButton
        className={style.confirmCloseButton}
        onClick={onCancelModal}>
        <T id="account.mixer.running.btnCancel" m="Cancel" />
      </InvisibleButton>
    </div>
  </Modal>
);

export default AutobuyerRunningModal;
