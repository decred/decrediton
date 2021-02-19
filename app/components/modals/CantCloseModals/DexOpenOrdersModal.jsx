import Modal from "../Modal";
import { FormattedMessage as T } from "react-intl";
import { KeyBlueButton } from "buttons";
import style from "../Modals.module.css";

const DexOpenOrdersModal = ({ show, onCancelModal }) => (
  <Modal className={style.confirm} {...{ show, onCancelModal }}>
    <div className={style.confirmHeader}>
      <div className={style.confirmHeaderTitle}>
        <T id="dex.openorders.title" m="DEX Open Orders" />
      </div>
    </div>
    <div className={style.confirmContent}>
      <T
        id="dex.openorders.message"
        m="There are currently open orders still being managed at the DEX.  Please wait until all orders are finished excuting before closing.  If you close before the orders are executed, you will not finish the trade and may be penalized."
      />
    </div>
    <div className={style.confirmToolbar}>
      <KeyBlueButton
        className={style.confirmConfirmButton}
        onClick={onCancelModal}>
        <T id="dex.openorders.confirmModal.goback" m="Go back" />
      </KeyBlueButton>
    </div>
  </Modal>
);

export default DexOpenOrdersModal;
