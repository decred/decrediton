import PurchaseTickets from "./PurchaseTickets";
import TicketAutoBuyer from "./TicketAutoBuyer";
import StakeInfo from "./StakeInfo";
import "style/StakePool.less";

const Tickets = ({
  ...props
}) => (
  <Aux>
    <div className="tab-card">
      <StakeInfo />
      <PurchaseTickets {...{ ...props }} />
      <div className="stakepool-area-spacing"></div>
      <TicketAutoBuyer {...{ ...props }} />
    </div>
  </Aux>
);

export default Tickets;
