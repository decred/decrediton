import { FormattedMessage as T } from "react-intl";
import styles from "./NoMoreIndicators.module.css";

export default () => (
  <div className={styles.noTransactionsIndicator}>
    <T id="noTransactions.description" m="No Transactions Found" />
    <div className={styles.noTransactionsIndicatorImg}></div>
  </div>
);
