import TicketsCardList from "./TicketsCardList";
import TicketOverviewCard from "./TicketOverviewCard";
import { ticketsOverview } from "connectors";
import { NoTickets } from "indicators";

const TicketsOverview = ({ ticketsPerStatus, showTicketList, allTickets }) => {
  if (allTickets.length === 0) return <NoTickets />;

  const cardStatus = [ "revoked", "voted", "expired", "missed", "unmined",
    "immature", "live" ];

  const cards = cardStatus.map(v =>
    <TicketOverviewCard key={v} status={v} tickets={ticketsPerStatus[v]} onClick={() => showTicketList(v)} />
  );

  return (<TicketsCardList>{cards}</TicketsCardList>);
};

export default ticketsOverview(TicketsOverview);
