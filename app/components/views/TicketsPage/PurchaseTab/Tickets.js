import PurchaseTickets from "./PurchaseTickets";
import TicketAutoBuyer from "./TicketAutoBuyer";
import { FormattedMessage as T } from "react-intl";
import StakeInfo from "./StakeInfo";
import { spv } from "connectors";
import { ShowWarning, Subtitle } from "shared";
import "style/StakePool.less";

const Tickets = ({
  spvMode,
  blocksNumberToNextTicket,
  ...props,
}) => (
  <>
    <Subtitle title={<T id="purchase.subtitle" m="Purchase Tickets"/>} />
    <StakeInfo />
    {
      spvMode && blocksNumberToNextTicket == 2  ?
        <ShowWarning warn={<T id="spv.purchase.warn" m="Purchase Tickets is not available right now, because we are at the end of a ticket interval. After one block it will be available again."/>}/> :
        <PurchaseTickets {...{ ...props }} />
    }
    <div className="stakepool-area-spacing"></div>
    {
      spvMode ? <div className="spv-autobuyer-warning"><T id="spv.auto.buyer.warn" m="Ticket Auto Buyer not available while using SPV" /></div>  : <TicketAutoBuyer {...{ ...props }} />
    }
  </>
);

export default spv(Tickets);
