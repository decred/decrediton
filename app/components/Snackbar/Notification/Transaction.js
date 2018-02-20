// @flow
import { Link } from "react-router-dom";
import { Balance } from "shared";
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
    defaultMessage: "Vote"
  },
  Revocation: {
    id: "notifications.type.revocation",
    defaultMessage: "Revocation"
  },
  [TRANSACTION_DIR_SENT]: {
    id: "notifications.type.send",
    defaultMessage: "Send"
  },
  [TRANSACTION_DIR_TRANSFERED]: {
    id: "notifications.type.transfer",
    defaultMessage: "Transfer"
  },
  [TRANSACTION_DIR_RECEIVED]: {
    id: "notifications.type.receive",
    defaultMessage: "Receive"
  }
});

const Transaction = ({
  type,
  message,
  intl
}) => (
  <div className="snackbar-information">
    <div className="snackbar-information-row">
      <div className="snackbar-information-row-tx"><Link to={`/transactions/history/${message.txHash}`}>{message.txHash}</Link></div>
    </div>
    <div className="snackbar-information-row">
      <div className="snackbar-information-row-type">{intl.formatMessage(messages[type])}</div>
      <div className="snackbar-information-row-amount">
        <T id="notification.transfer.amount" m="Amount" />  <Balance amount={message.amount}/>
      </div>
      {message.fee > 0 &&
        <div className="snackbar-information-row-fee">
          <T id="notification.transfer.fee" m="Fee" />  <Balance amount={message.fee}/>
        </div>
      }
    </div>
  </div>
);

export default injectIntl(Transaction);
