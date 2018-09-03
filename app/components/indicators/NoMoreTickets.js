import { FormattedMessage as T } from "react-intl";
import "style/Loading.less";

const NoMoreTicketsIndicator = () =>
  <div className="loading-more-transactions-indicator">
    <T id="myTickets.noMoreTickets" m="No more tickets." />
  </div>;

export default NoMoreTicketsIndicator;
