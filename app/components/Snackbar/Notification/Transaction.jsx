import { Link } from "react-router-dom";
import { Balance } from "shared";
import { Tooltip } from "pi-ui";
import { ProgressRing } from "indicators";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import {
  TRANSACTION_DIR_SENT,
  TRANSACTION_DIR_RECEIVED,
  TICKET_FEE,
  TICKET,
  VOTE,
  REVOCATION
} from "constants/decrediton";
import style from "../Snackbar.module.css";

const messages = defineMessages({
  [TICKET]: {
    id: "notifications.type.ticket",
    defaultMessage: "Ticket"
  },
  [VOTE]: {
    id: "notifications.type.vote",
    defaultMessage: "Voted"
  },
  [REVOCATION]: {
    id: "notifications.type.revocation",
    defaultMessage: "Revoked"
  },
  [TRANSACTION_DIR_SENT]: {
    id: "notifications.type.send",
    defaultMessage: "Sent"
  },
  [TICKET_FEE]: {
    id: "notifications.type.ticketfee",
    defaultMessage: "Transferred"
  },
  [TRANSACTION_DIR_RECEIVED]: {
    id: "notifications.type.receive",
    defaultMessage: "Received"
  }
});

const Transaction = ({
  type,
  message,
  onDismissMessage,
  intl,
  topNotification,
  progress
}) => (
  <div data-testid="transaction-notification">
    {topNotification && (
      <button
        aria-label="Close"
        className={style.snackbarCloseButtonTop}
        onClick={onDismissMessage}>
        <ProgressRing radius={13} stroke={2} progress={progress} />
      </button>
    )}
    <div className={style.snackbarInformationRow}>
      <div className={style.snackbarInformationRowType}>
        <T id="notification.new" m="New Transaction" />,{" "}
        <span className={style.snackbarInformationRowTypeBold}>
          {intl.formatMessage(messages[type])}
        </span>
      </div>
      <div className={style.snackbarInformationRowAmount}>
        <Balance flat amount={message.amount} />
      </div>
    </div>
    {message.fee > 0 && (
      <div className={style.snackbarInformationRow}>
        <div className={style.snackbarInformationRowType}>
          <T id="notification.transfer.fee" m="Transaction Fee" />
        </div>
        <div className={style.snackbarInformationRowFee}>
          <Balance flat amount={message.fee} />
        </div>
      </div>
    )}
    <div className={style.snackbarInformationRow}>
      <div className={style.snackbarInformationRowType}>
        <T
          id="notification.seeTransactionDetails"
          m="See Transaction Details"
        />
      </div>
      <div className={style.snackbarInformationRowTx}>
        <Tooltip content={`${message.txHash}`}>
          <Link
            onClick={onDismissMessage}
            to={`/transactions/history/${message.txHash}`}>
            {message.txHash}
          </Link>
        </Tooltip>
      </div>
    </div>
  </div>
);

export default injectIntl(Transaction);
