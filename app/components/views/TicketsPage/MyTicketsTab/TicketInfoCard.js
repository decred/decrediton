import React from "react";
import TicketCard from "./TicketCard";
import ExpandedInfo from "./ExpandedInfo";
import Balance from "Balance";
import { tsToDate } from "helpers/dateFormat";
import { FormattedMessage as T } from "react-intl";

const TicketInfoCard = ({ ticket, onClick, expanded }) => {

  const className = "ticket-info-card" + (expanded ? " is-expanded" : "");

  return (<TicketCard
    {...{ className, status: ticket.status }}
    onClick={() => onClick(ticket)}
  >
    <div className="ticket-info-expanded-indicator"></div>
    <div className="ticket-info-price"><Balance amount={ticket.ticketPrice} /></div>
    {ticket.ticketReward
      ? <div className="ticket-reward"><Balance amount={ticket.ticketReward} noSmallAmount /></div>
      : null }
    <div className="ticket-timestamp">
      <T
        id="ticket.timestamp"
        m="{timestamp, date, medium} {timestamp, time, medium}"
        values={{timestamp: tsToDate(ticket.leaveTimestamp || ticket.enterTimestamp)}} />
    </div>
    <ExpandedInfo {...{ticket}} />
  </TicketCard>);
};

export default TicketInfoCard;
