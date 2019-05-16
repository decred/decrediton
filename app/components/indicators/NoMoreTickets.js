import { FormattedMessage as T } from "react-intl";
import "style/Loading.less";

export default () => (
  <div className="no-tickets-indicator">
    <T id="noTickets.description" m="No Tickets Found" />
  </div>
);
