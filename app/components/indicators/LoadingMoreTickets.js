import StakeyBounceXs from "./StakeyBounceExtraSmall";
import { FormattedMessage as T } from "react-intl";
import "style/Loading.less";

const LoadingMoreTicketsIndicator = () =>
  <div className="loading-more-transactions-indicator">
    <StakeyBounceXs /><T id="myTickets.loadingMoreTickets" m="Loading more tickets..." />
  </div>;

export default LoadingMoreTicketsIndicator;
