import PurchaseTickets from "./PurchaseTickets";
import TicketAutoBuyer from "./TicketAutoBuyer";
import { FormattedMessage as T } from "react-intl";
import StakeInfo from "./StakeInfo";
import { spv } from "connectors";
import { ShowWarning } from "shared";
import "style/StakePool.less";

const purchaseTicketSpvWarn = (blocksNumber) => <T id="spv.purchase.warn"
  m="Purchase Tickets is not available right now, because we are in the beginning of a ticket interval. After {blocksNumber} blocks it will be available again."
  values={{
    blocksNumber: blocksNumber
  }}
/>;

const Tickets = ({
  spvMode,
  blocksPassedOnTicketInterval,
  ...props,
}) => (
  <Aux>
    <div className="tabbed-page-subtitle"><T id="purchase.subtitle" m="Purchase Tickets"/></div>
    <StakeInfo />
    {
      blocksPassedOnTicketInterval < 5  ?
        <ShowWarning warn={purchaseTicketSpvWarn(5-blocksPassedOnTicketInterval)}/> : <PurchaseTickets {...{ ...props }} />
    }
    <div className="stakepool-area-spacing"></div>
    {
      spvMode ? <div className="spv-autobuyer-warning"><T id="spv.auto.buyer.warn" m="Ticket Auto Buyer not available while using SPV" /></div>  : <TicketAutoBuyer {...{ ...props }} />
    }
  </Aux>
);

export default spv(Tickets);
