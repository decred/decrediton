import { FormattedMessage as T } from "react-intl";
import styles from "./indicators.module.css";

const NoMoreTransactions = () => (
  <div className={styles.loadingMoreTransactionsIndicator}>
    <T id="history.noMoreTransactions" m="No more transactions." />
  </div>
);

export default NoMoreTransactions;
