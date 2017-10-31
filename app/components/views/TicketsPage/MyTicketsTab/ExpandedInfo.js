import React from "react";
import { FormattedMessage as T } from "react-intl";
import TransactionLink from "TransactionLink";

const ExpandedInfo = ({ ticket }) => (
  <div className="ticket-expanded-info">
    <div>
      <span className="ticket-info-label"><T id="myTickets.ticketTx" m="Transaction"/>:</span>
      <span className="ticket-transaction-hash">
        <TransactionLink txHash={ticket.hash} />
      </span>
    </div>

    { ticket.spenderTx
      ? (<div>
        <span className="ticket-info-label"><T id="myTickets.spenderTx" m="Spender"/>:</span>
        <span className="ticket-transaction-hash">
          <TransactionLink txHash={ticket.spenderHash} />
        </span>
      </div>)
      : null }

  </div>
);

export default ExpandedInfo;
