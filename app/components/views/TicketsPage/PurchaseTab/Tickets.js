import PurchaseTickets from "./PurchaseTickets";
import TicketAutoBuyer from "./TicketAutoBuyer";
import StakeInfo from "./StakeInfo";
import "style/StakePool.less";

const Tickets = ({
  ...props
}) => (
  <Aux>
    <StakeInfo />
    <PurchaseTickets {...{ ...props }} />
    <div className="stakepool-area-spacing"></div>
    <TicketAutoBuyer {...{ ...props }} />
  </Aux>
);

export default Tickets;
