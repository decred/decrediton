import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "pi-ui";
import { addSpacingAroundText } from "helpers/strings";

const PurchaseTicketsAdvanced = ({ stakePool, ticketFee, txFee, expiry }) => (
  <div className="stakepool-purchase-ticket-quick-bar">
    <Tooltip
      content={<T id="purchaseTickets.currentStakepool" m="Current VSP" />}
      className="current_vsp">
      <div className="stakepool-info-icon stakepool-icon">
        {stakePool && stakePool.value.Host}
      </div>
    </Tooltip>
    <Tooltip
      content={<T id="purchaseTickets.expiry" m="Expiry" />}
      className="ticket_expiry">
      <div className="stakepool-info-icon stakepool-expiry-icon">
        {expiry} Blocks
      </div>
    </Tooltip>
    <Tooltip
      content={<T id="purchaseTickets.ticketFeeTip" m="Ticket Fee" />}
      className="ticket_fee">
      <div className="stakepool-info-icon stakepool-fee-icon">
        {ticketFee} DCR/KB
      </div>
    </Tooltip>
    <Tooltip
      content={<T id="purchaseTickets.txFeeTip" m="Tx Fee" />}
      className="ticket_tx_fee">
      <div className="stakepool-info-icon stakepool-fee-icon">
        {txFee} DCR/KB
      </div>
    </Tooltip>
    <Tooltip
      content={<T id="purchaseTickets.poolFee" m="VSP Fee" />}
      className="ticket_pool_fee">
      <div className="stakepool-info-icon stakepool-pool-fee-icon">
        {stakePool && stakePool.value.PoolFees}%
      </div>
    </Tooltip>
    <Tooltip
      content={<T id="purchaseTickets.ticketAddress" m="Ticket Address" />}
      className="ticket_address">
      <div className="stakepool-info-icon stakepool-ticket-address-icon">
        {stakePool && addSpacingAroundText(stakePool.value.TicketAddress)}
      </div>
    </Tooltip>
    <Tooltip
      content={<T id="purchaseTickets.poolAddress" m="VSP Address" />}
      className="ticket_pool_address">
      <div className="stakepool-info-icon stakepool-fee-address-icon">
        {stakePool && addSpacingAroundText(stakePool.value.PoolAddress)}
      </div>
    </Tooltip>
  </div>
);

export default PurchaseTicketsAdvanced;
