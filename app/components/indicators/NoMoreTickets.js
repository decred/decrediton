import { FormattedMessage as T } from "react-intl";
import "style/Loading.less";

export default () => (
  <div className="no-more-tickets-indicator">
    <T id="noMoreTickets.description" m="No More Tickets" />
  </div>
);
