import { FormattedMessage as T } from "react-intl";
import styles from "./LedgerLoaderBarContainer.module.css";
import { useLedgerLoaderBarContainer } from "./hooks";

const LedgerLoaderBarContainer = ({ loaderBar }) => {
  const { ledgerDevice } = useLedgerLoaderBarContainer();
  return ledgerDevice ? (
    <div className={styles.loaderBarContainer}>
      <div className={styles.deviceStatus}>
        <span className={styles.deviceLabel}>
          <T id="ledgerLoaderBarContainer.Connected" m="New DCR Ledger" />
        </span>
        <span> | </span>
        <span className={styles.connected}>
          <T id="ledgerLoaderBarContainer.connected" m="Connected" />
        </span>
      </div>
      <div className={styles.loaderBar}>{loaderBar}</div>
    </div>
  ) : null;
};

export default LedgerLoaderBarContainer;
