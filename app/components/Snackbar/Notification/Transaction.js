// @flow
import { Link } from "react-router-dom";
import { Balance, Tooltip } from "shared";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { TRANSACTION_DIR_SENT, TRANSACTION_DIR_RECEIVED,
  TRANSACTION_DIR_TRANSFERED
} from "wallet/service";
import "style/Header.less";

const messages = defineMessages({
  //same as the types used in index.js
  Ticket: {
    id: "notifications.type.ticket",
    defaultMessage: "Ticket"
  },
  Vote: {
    id: "notifications.type.vote",
    defaultMessage: "Voted"
  },
  Revocation: {
    id: "notifications.type.revocation",
    defaultMessage: "Revoked"
  },
  [TRANSACTION_DIR_SENT]: {
    id: "notifications.type.send",
    defaultMessage: "Sent"
  },
  [TRANSACTION_DIR_TRANSFERED]: {
    id: "notifications.type.transfer",
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
  intl
}) => (
  <Aux>
    <div className="snackbar-close-button-top" onClick={onDismissMessage}/>
    <div className="snackbar-information-row">
      <div className="snackbar-information-row-type"><T id="notification.new" m="New Transaction"/>, <span className="snackbar-information-row-type-bold">{intl.formatMessage(messages[type])}</span></div>
      <div className="snackbar-information-row-amount">
        <Balance flat amount={message.amount}/>
      </div>
    </div>
    {message.fee > 0 &&
    <div className="snackbar-information-row">
      <div className="snackbar-information-row-type"><T id="notification.transfer.fee" m="Transaction Fee" /></div>
      <div className="snackbar-information-row-fee">
        <Balance flat amount={message.fee}/>
      </div>
    </div>
    }
    <div className="snackbar-information-row">
      <div className="snackbar-information-row-type"><T id="notification.seeTransactionDetails" m="See Transaction Details"/></div>
      <div className="snackbar-information-row-tx">
        <Tooltip width={300} text={`${message.txHash}`}><Link onClick={onDismissMessage} to={`/transactions/history/${message.txHash}`}>{message.txHash}</Link></Tooltip>
      </div>
    </div>
  </Aux>
);

export default injectIntl(Transaction);
