import Modal from "../Modal";
import { FormattedMessage as T } from "react-intl";
import { KeyBlueButton } from "buttons";
import styles from "./CantCloseModals.module.css";

const DexOpenOrdersModal = ({ show, onCancelModal }) => (
  <Modal className={styles.confirm} {...{ show, onCancelModal }}>
    <div className={styles.header}>
      <div className={styles.headerTitle}>
        <T id="dex.openorders.title" m="DEX Open Orders" />
      </div>
    </div>
    <div>
      <T
        id="dex.openorders.message"
        m="There are currently open orders still being managed on the DEX.  Please wait until all orders are finished executing before closing.  If you close before the orders are executed, you will not finish the trade and may be penalized."
      />
    </div>
    <div className={styles.toolbar}>
      <KeyBlueButton className={styles.confirmButton} onClick={onCancelModal}>
        <T id="dex.openorders.confirmModal.goback" m="Go back" />
      </KeyBlueButton>
    </div>
  </Modal>
);

export default DexOpenOrdersModal;
