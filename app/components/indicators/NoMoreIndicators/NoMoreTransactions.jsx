import { FormattedMessage as T } from "react-intl";
import styles from "./NoMoreIndicators.module.css";

const NoMoreTransactions = () => (
  <div className={styles.noMoreTransactionsIndicator}>
    <T id="history.noMoreTransactions" m="No more transactions." />
  </div>
);

export default NoMoreTransactions;
