import StakeyBounceXs from "../StakeyBounce/StakeyBounceExtraSmall";
import { FormattedMessage as T } from "react-intl";
import styles from "./LoadingMoreTransactions.module.css";

const LoadingMoreTransactionsIndicator = ({ onClick }) => (
  <div className={styles.loadingMoreTransactionsIndicator} onClick={onClick}>
    <StakeyBounceXs />
    <T id="history.loadingMoreTransactions" m="Loading more transactions..." />
  </div>
);

export default LoadingMoreTransactionsIndicator;
