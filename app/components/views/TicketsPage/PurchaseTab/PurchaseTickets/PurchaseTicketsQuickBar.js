import { Tooltip } from "shared";
import { FormattedMessage as T } from "react-intl";
import { addSpacingAroundText } from "helpers/strings";

const PurchaseTicketsAdvanced = ({
  stakePool,
  ticketFee,
  txFee,
  expiry,
}) => (
  <div className="stakepool-purchase-ticket-quick-bar">
    <Tooltip text={<T id="purchaseTickets.currentStakepool" m="Current StakePool" />}>
      <div className="stakepool-info-icon stakepool-icon">{stakePool && stakePool.value.Host}</div>
    </Tooltip>
    <Tooltip text={<T id="purchaseTickets.expiry" m="Expiry" />}>
      <div className="stakepool-info-icon stakepool-expiry-icon">{expiry} Blocks</div>
    </Tooltip>
    <Tooltip text={<T id="purchaseTickets.ticketFeeTip" m="Ticket Fee" />}>
      <div className="stakepool-info-icon stakepool-fee-icon">{ticketFee} DCR/KB</div>
    </Tooltip>
    <Tooltip text={<T id="purchaseTickets.txFeeTip" m="Tx Fee" />}>
      <div className="stakepool-info-icon stakepool-fee-icon">{txFee} DCR/KB</div>
    </Tooltip>
    <Tooltip text={<T id="purchaseTickets.poolFee" m="Pool Fee" />}>
      <div className="stakepool-info-icon stakepool-pool-fee-icon">{stakePool && stakePool.value.PoolFees}%</div>
    </Tooltip>
    <Tooltip text={<T id="purchaseTickets.ticketAddress" m="Ticket Address" />}>
      <div className="stakepool-info-icon stakepool-ticket-address-icon">{stakePool && addSpacingAroundText(stakePool.value.TicketAddress)}</div>
    </Tooltip>
    <Tooltip text={<T id="purchaseTickets.poolAddress" m="Pool Address" />}>
      <div className="stakepool-info-icon stakepool-fee-address-icon">{stakePool && addSpacingAroundText(stakePool.value.PoolAddress)}</div>
    </Tooltip>
  </div>);

export default PurchaseTicketsAdvanced;
