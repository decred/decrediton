import TicketCard from "./TicketCard";
import { FormattedMessage as T } from "react-intl";
import { statusMultipleTxt } from "./messages";

const TicketOverviewCard = ({ status, tickets , onClick }) => (
  <TicketCard
    {...{ status }}
    className="ticket-overview-card"
    onClick={() => onClick(status)}
  >
    <h1 className="ticket-overview-header">{statusMultipleTxt[status]}</h1>
    <div className="ticket-overview-count">
      <T
        id="myTickets.statusCount"
        m="{count, plural, one {# ticket} other {# tickets} }"
        values={{ count: tickets.length }}
      />
    </div>
  </TicketCard>
);

export default TicketOverviewCard;
