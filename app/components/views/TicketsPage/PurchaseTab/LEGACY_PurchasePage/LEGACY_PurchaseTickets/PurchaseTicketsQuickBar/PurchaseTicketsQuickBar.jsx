import { FormattedMessage as T } from "react-intl";
import { Tooltip, classNames } from "pi-ui";
import { addSpacingAroundText } from "helpers/strings";
import styles from "./PurchaseTicketsQuickBar.module.css";

const PurchaseTicketsAdvanced = ({ stakePool, ticketFee, txFee, expiry }) => (
  <div className={styles.quickBar}>
    <Tooltip
      content={<T id="purchaseTickets.currentStakepool" m="Current VSP" />}
      className={styles.currentVsp}>
      <div className={classNames(styles.icon, styles.stakepool)}>
        {stakePool && stakePool.value.Host}
      </div>
    </Tooltip>
    <Tooltip
      content={<T id="purchaseTickets.expiry" m="Expiry" />}
      className={styles.ticketExpiry}>
      <div className={classNames(styles.icon, styles.expiry)}>
        {expiry} Blocks
      </div>
    </Tooltip>
    <Tooltip
      content={<T id="purchaseTickets.ticketFeeTip" m="Ticket Fee" />}
      className={styles.ticketFee}>
      <div className={classNames(styles.icon, styles.fee)}>
        {ticketFee} DCR/KB
      </div>
    </Tooltip>
    <Tooltip
      content={<T id="purchaseTickets.txFeeTip" m="Tx Fee" />}
      className={styles.ticketTxFee}>
      <div className={classNames(styles.icon, styles.fee)}>{txFee} DCR/KB</div>
    </Tooltip>
    <Tooltip
      content={<T id="purchaseTickets.poolFee" m="VSP Fee" />}
      className={styles.ticketPoolFee}>
      <div className={classNames(styles.icon, styles.poolFee)}>
        {stakePool && stakePool.value.PoolFees}%
      </div>
    </Tooltip>
    <Tooltip
      content={<T id="purchaseTickets.ticketAddress" m="Ticket Address" />}
      className={styles.ticketAddress}>
      <div className={classNames(styles.icon, styles.ticketAddress)}>
        {stakePool && addSpacingAroundText(stakePool.value.TicketAddress)}
      </div>
    </Tooltip>
    <Tooltip
      content={<T id="purchaseTickets.poolAddress" m="VSP Address" />}
      className={styles.ticketPoolAddress}>
      <div className={classNames(styles.icon, styles.feeAddress)}>
        {stakePool && addSpacingAroundText(stakePool.value.PoolAddress)}
      </div>
    </Tooltip>
  </div>
);

export default PurchaseTicketsAdvanced;
