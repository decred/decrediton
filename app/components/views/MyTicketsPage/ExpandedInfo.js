import React from "react";
import { FormattedMessage as T } from "react-intl";

const ExpandedInfo = ({ ticket }) => (
  <div className="ticket-expanded-info">
    <div>
      <span className="ticket-info-label"><T id="myTickets.transaction" m="Transaction"/>:</span>
      <span className="ticket-transaction-hash">{ticket.hash}</span>
    </div>
    <div>
    <span className="ticket-info-label"><T id="myTickets.block" m="Block"/>:</span>
      <span className="ticket-transaction-hash">...</span>
    </div>
    <div>
      <span className="ticket-info-label"><T id="myTickets.height" m="Height"/>:</span>
      <span className="ticket-transaction-hash">...</span>
    </div>

  </div>
);

export default ExpandedInfo;
