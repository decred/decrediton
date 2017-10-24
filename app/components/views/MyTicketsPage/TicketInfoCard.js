import React from "react";
import TicketCard from "./TicketCard";
import ExpandedInfo from "./ExpandedInfo";
import Balance from "Balance";
import { tsToDate } from "../../../helpers/dateFormat";
import { FormattedMessage as T, FormattedDate } from "react-intl";

const TicketInfoCard = ({ ticket, onClick, expanded }) => {

  const className = "ticket-info-card" + (expanded ? " is-expanded" : "");

  return (<TicketCard
    {...{ className, status: ticket.status }}
    onClick={() => onClick(ticket)}
  >
    <div className="ticket-info-expanded-indicator"></div>
    <div className="ticket-info-price"><Balance value={6430865276} /></div>
    <div className="ticket-reward"><Balance value={144565276}/></div>
    <div className="ticket-timestamp">
      <T
        id="ticket.timestamp"
        m="{timestamp, date, medium} {timestamp, time, medium}"
        values={{timestamp: tsToDate(ticket.enterTimestamp)}} />
    </div>
    <ExpandedInfo {...{ticket}} />
  </TicketCard>);
};

export default TicketInfoCard;
