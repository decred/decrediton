import React from "react";
import TicketsCardList from "./TicketsCardList";
import TicketOverviewCard from "./TicketOverviewCard";

const TicketsOverview = ({ ticketsPerStatus, onClickTicketOverview }) => {
  const cardStatus = ["revoked", "voted", "expired", "missed", "unmined",
    "immature", "live"];

  const cards = cardStatus.map(v =>
    <TicketOverviewCard key={v} status={v} tickets={ticketsPerStatus[v]} onClick={onClickTicketOverview} />
  );

  return (<TicketsCardList>{cards}</TicketsCardList>);
};

export default TicketsOverview;
