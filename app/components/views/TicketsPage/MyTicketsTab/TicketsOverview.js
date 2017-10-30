import React from "react";
import TicketsCardList from "./TicketsCardList";
import TicketOverviewCard from "./TicketOverviewCard";
import myTickets from "connectors/myTickets";

const TicketsOverview = ({ ticketsPerStatus, showTicketList }) => {
  const cardStatus = ["revoked", "voted", "expired", "missed", "unmined",
    "immature", "live"];

  const cards = cardStatus.map(v =>
    <TicketOverviewCard key={v} status={v} tickets={ticketsPerStatus[v]} onClick={() => showTicketList(v)} />
  );

  return (<TicketsCardList>{cards}</TicketsCardList>);
};

export default myTickets(TicketsOverview);
