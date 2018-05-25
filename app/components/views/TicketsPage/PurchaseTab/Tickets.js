import PurchaseTickets from "./PurchaseTickets";
import TicketAutoBuyer from "./TicketAutoBuyer";
import { FormattedMessage as T } from "react-intl";
import StakeInfo from "./StakeInfo";
import "style/StakePool.less";

const Tickets = ({
  ...props
}) => (
  <Aux>
    <div className="tabbed-page-subtitle"><T id="purchase.subtitle" m="Purchase Tickets"/></div>
    <StakeInfo />
    <PurchaseTickets {...{ ...props }} />
    <div className="stakepool-area-spacing"></div>
    <TicketAutoBuyer {...{ ...props }} />
  </Aux>
);

export default Tickets;
