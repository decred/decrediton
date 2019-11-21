import PurchaseTickets from "./PurchaseTickets";
import TicketAutoBuyer from "./TicketAutoBuyer";
import { FormattedMessage as T } from "react-intl";
import StakeInfo from "./StakeInfo";
import { spv } from "connectors";
import { ShowWarning, Subtitle } from "shared";
import "style/PurchaseTickets.less";
import { InfoDocModalButton } from "buttons";

const getTitleIcon = () => (
  <InfoDocModalButton document="PurchaseTicketsInfo" modalClassName="info-modal-fields" className="info-title-icon" draggable/>
);
const Tickets = ({
  spvMode,
  blocksNumberToNextTicket,
  sidebarOnBottom,
  ...props
}) => (
  <div className="purchase-ticket-area">
    <Subtitle title={<T id="purchase.subtitle" m="Purchase Tickets"/>} children={getTitleIcon()} className="is-row" />
    <StakeInfo  {...{ sidebarOnBottom }}/>
    {
      spvMode && blocksNumberToNextTicket === 2  ?
        <ShowWarning warn={<T id="spv.purchase.warn" m="Purchase Tickets is not available right now, because we are at the end of a ticket interval. After one block it will be available again."/>}/> :
        <PurchaseTickets {...{ ...props }} />}
    {
      spvMode ?
        <div className="spv-autobuyer-warning">
          <T id="spv.auto.buyer.warn" m="Ticket Auto Buyer not available while using SPV" />
        </div> : <TicketAutoBuyer {...{ ...props }} />}
  </div>
);

export default spv(Tickets);
