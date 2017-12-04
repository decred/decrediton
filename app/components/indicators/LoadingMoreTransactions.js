import StakeyBounceXs from "./StakeyBounceExtraSmall";
import { FormattedMessage as T } from "react-intl";
import "style/Loading.less";

const LoadingMoreTransactionsIndicator = () =>
  <div className="loading-more-transactions-indicator">
    <StakeyBounceXs /><T id="history.loadingMoreTransactions" m="Loading more transactions..." />
  </div>;

export default LoadingMoreTransactionsIndicator;
