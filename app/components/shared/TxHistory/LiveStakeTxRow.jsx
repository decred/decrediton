import { FormattedMessage as T } from "react-intl";
import { classNames, Tooltip } from "pi-ui";
import Row from "./Row";
import { Balance } from "shared";
import { messageByType } from "./helpers";
import TicketPriceMessage from "./TicketPriceMessage";
import styles from "./TxHistory.module.css";
import {
  VSP_FEE_PROCESS_STARTED,
  VSP_FEE_PROCESS_PAID,
  VSP_FEE_PROCESS_ERRORED,
  VSP_FEE_PROCESS_CONFIRMED
} from "constants";

const feeStatusToStringMap = {
  [VSP_FEE_PROCESS_STARTED]: <T id="vsp.ticket.started" m="Processing" />,
  [VSP_FEE_PROCESS_PAID]: <T id="vsp.ticket.paid" m="Paid" />,
  [VSP_FEE_PROCESS_ERRORED]: <T id="vsp.ticket.error" m="Error" />,
  [VSP_FEE_PROCESS_CONFIRMED]: <T id="vsp.ticket.confirmed" m="Confirmed" />
};

const OLD_VSP = "OLD_VSP";
const SOLO_PURCHASE = "SOLO_PURCHASE";

const ticketMap = {
  [OLD_VSP]: <T id="privacy.ticket.old" m="Old VSP" />,
  [SOLO_PURCHASE]: <T id="privacy.ticket.solo" m="Solo" />
};

const StakeTxRow = ({
  className,
  timeMessage,
  overview,
  ticketPrice,
  pending,
  txTs,
  txType,
  status,
  feeStatus,
  txInputs,
  ...props
}) => {
  // If txType equals ticket, we use the message bype by the tx status, so we
  // can show the proper icon (Revoked, Voted). Although we show the message
  // as Purchased, to avoid confusion.
  const typeMsg =
    txType === "ticket"
      ? messageByType[status]
      : messageByType[txType] || "(unknown type)";
  let feeStatusString;
  if (feeStatus) {
    feeStatusString = feeStatusToStringMap[feeStatus];
  } else {
    // an old vsp ticket has two inputs, the vsp fee input and the ticket price.
    // if it has only one input and no fee status, then it is probably a
    // solo ticket purchase.
    feeStatusString =
      txInputs.length > 1 ? ticketMap[OLD_VSP] : ticketMap[SOLO_PURCHASE];
  }
  return (
    <Row {...{ className, pending, ...props, overview }}>
      <div
        className={classNames(
          styles.myTickets,
          overview && styles.overview,
          styles.live
        )}>
        <div className={styles.ticketStatus}>
          <span className={classNames(styles[className], styles.icon)} />
          <span className={styles.stakeType}>{typeMsg}</span>
        </div>
        <Tooltip
          className={styles.tooltip}
          content={<TicketPriceMessage ticketPrice={ticketPrice} />}>
          <Balance
            bold
            classNameAmount={styles.myTicketsPrice}
            classNameUnit={styles.noBold}
            amount={ticketPrice}
          />
        </Tooltip>
        <div></div>
        <Tooltip
          className={styles.tooltip}
          content={<T id="txRow.live.feeStatus.tooltip" m="Fee Status" />}>
          <div className={classNames(styles.feeStatus)}>{feeStatusString}</div>
        </Tooltip>
        {!pending && (
          <div className={styles.timeDateSpacer}>{timeMessage(txTs)}</div>
        )}
      </div>
    </Row>
  );
};

export default StakeTxRow;
