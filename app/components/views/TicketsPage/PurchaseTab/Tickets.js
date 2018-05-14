import PurchaseTickets from "./PurchaseTickets";
import TicketAutoBuyer from "./TicketAutoBuyer";
import { FormattedMessage as T } from "react-intl";
import StakeInfo from "./StakeInfo";
import { spv } from "connectors";
import { ShowWarning } from "shared";
import { FormattedMessage as T } from "react-intl";
import "style/StakePool.less";

const purchaseTicketSpvWarn = <T id="spv.purchase.warn" m="Purchase Tickets Not available in spv mode" />
const autoBuyerSpvWarn = <T id="spv.auto.buyer.warn" m="Ticket Auto Buyer Not available in spv mode" />

const Tickets = ({
  ...props,
  spvMode,
}) => (
  <Aux>
    <div className="tabbed-page-subtitle"><T id="purchase.subtitle" m="Purchase Tickets"/></div>
    <StakeInfo />
    {
      spvMode ? <ShowWarning warn={purchaseTicketSpvWarn}/> : <PurchaseTickets {...{ ...props }} />
    }
    <div className="stakepool-area-spacing"></div>
    {
      spvMode ? <ShowWarning warn={autoBuyerSpvWarn}/>  : <TicketAutoBuyer {...{ ...props }} />
    }
  </Aux>
);

export default spv(Tickets);
