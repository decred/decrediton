import StakeyBounceXs from "../StakeyBounce/StakeyBounceExtraSmall";
import { FormattedMessage as T } from "react-intl";
import styles from "./LoadingMoreTransactions.module.css";

const LoadingMoreTransactionsIndicator = () => (
  <div className={styles.loadingMoreTransactionsIndicator}>
    <StakeyBounceXs />
    <T id="history.loadingMoreTransactions" m="Loading more transactions..." />
  </div>
);

export default LoadingMoreTransactionsIndicator;
