import { FormattedMessage as T } from "react-intl";
import "style/Loading.less";

const LoadingMoreTransactionsIndicator = () =>
  <div className="loading-more-transactions-indicator">
    <T id="history.noMoreTransactions" m="No more transactions." />
  </div>;

export default LoadingMoreTransactionsIndicator;
