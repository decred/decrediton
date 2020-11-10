import Row from "./Row";
import { FormattedMessage as T } from "react-intl";
import { Balance, Tooltip } from "shared";
import { classNames } from "pi-ui";
import { messageByType } from "./helpers";
import TicketPriceMessage from "./TicketPriceMessage";
import styles from "./TxHistory.module.css";
import { VSP_FEE_PROCESS_STARTED, VSP_FEE_PROCESS_PAID, VSP_FEE_PROCESS_ERRORED } from "constants";

const feeStatusToStringMap = ({
  [VSP_FEE_PROCESS_STARTED]: <T id="vsp.ticket.started" m="Processing" />,
  [VSP_FEE_PROCESS_PAID]: <T id="vsp.ticket.paid" m="Paid" />,
  [VSP_FEE_PROCESS_ERRORED]: <T id="vsp.ticket.error" m="Error" />
});

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
  let oldVsp = false;
  // an old vsp ticket has two inputs, the vsp fee input and the ticket price.
  if (!feeStatus && txInputs.length > 1) {
    oldVsp = true;
  }
  return (
    <Row {...{ className, pending, ...props, overview }}>
      <div
        className={classNames(styles.myTickets, overview && styles.overview, styles.live)}>
        <div className={styles.ticketStatus}>
          <span className={classNames(styles[className], styles.icon)} />
          <span className={styles.stakeType}>{typeMsg}</span>
        </div>
        <Tooltip text={<TicketPriceMessage ticketPrice={ticketPrice} />}>
          <Balance
            bold
            classNameAmount={styles.myTicketsPrice}
            classNameUnit={styles.noBold}
            amount={ticketPrice}
          />
        </Tooltip>
        <div></div>
        <Tooltip text={<T id="txRow.live.feeStatus.tooltip" m="Fee Status" />} >
          <div className={classNames(styles.feeStatus)}>
            {oldVsp ? <T id="vsp.ticket.oldvsp" m="Old VSP" /> : feeStatusToStringMap[feeStatus]}
          </div>
        </Tooltip>
        {!pending && (
          <div className={styles.timeDateSpacer}>{timeMessage(txTs)}</div>
        )}
      </div>
    </Row>
  );
};

export default StakeTxRow;
