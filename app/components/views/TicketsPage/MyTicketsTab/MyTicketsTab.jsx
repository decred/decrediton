import React, { useState } from "react";
import TicketListPage from "./Page";
import { FormattedMessage as T } from "react-intl";
import { useTicketsList } from "../hooks";

const labels = {
  unknown: <T id="ticket.status.multiple.unknown" m="unknown" />,
  unmined: <T id="ticket.status.multiple.unmined" m="unmined" />,
  immature: <T id="ticket.status.multiple.immature" m="immature" />,
  live: <T id="ticket.status.multiple.live" m="live" />,
  voted: <T id="ticket.status.multiple.voted" m="voted" />,
  missed: <T id="ticket.status.multiple.missed" m="missed" />,
  expired: <T id="ticket.status.multiple.expired" m="expired" />,
  revoked: <T id="ticket.status.multiple.revoked" m="revoked" />
};

const sortTypes = [
  {
    value: "desc",
    key: "desc",
    label: <T id="tickets.sortby.newest" m="Newest" />
  },
  {
    value: "asc",
    key: "asc",
    label: <T id="tickets.sortby.oldest" m="Oldest" />
  }
];

const ticketTypes = [
  {
    key: "all",
    value: { status: null },
    label: <T id="tickets.type.all" m="All" />
  },
  { key: "unmined", value: { status: "unmined" }, label: labels.unmined },
  {
    key: "immature",
    value: { status: "immature" },
    label: labels.immature
  },
  { key: "live", value: { status: "live" }, label: labels.live },
  { key: "voted", value: { status: "voted" }, label: labels.voted },
  { key: "missed", value: { status: "missed" }, label: labels.missed },
  { key: "expired", value: { status: "expired" }, label: labels.expired },
  { key: "revoked", value: { status: "revoked" }, label: labels.revoked }
];

const selectTicketTypeFromFilter = (filter) => {
  const ticketType = ticketTypes.find(
    (ticket) => filter.status === ticket.value.status
  );
  return ticketType && ticketType.key;
};

const MyTicketsR = (props) => {
  const {
    tickets,
    tsDate,
    noMoreTickets,
    ticketsFilter,
    window,
    goBackHistory,
    getTickets,
    changeTicketsFilter
  } = useTicketsList();

  const [selectedTicketTypeKey, setTicketTypeKey] = useState(
    selectTicketTypeFromFilter(ticketsFilter)
  );
  const [selectedSortOrderKey, setSortOrderKey] = useState(
    ticketsFilter.listDirection
  );

  const onChangeFilter = (filter) => {
    const newFilter = { ...ticketsFilter, ...filter };
    changeTicketsFilter(newFilter);
  };

  const onChangeSelectedType = (type) => {
    onChangeFilter(type.value);
    setTicketTypeKey(type.key);
  };

  const onChangeSortType = (type) => {
    onChangeFilter({ listDirection: type.value });
    setSortOrderKey(type.value);
  };

  const loadMoreThreshold = 90 + Math.max(0, window.innerHeight - 765);

  return (
    <TicketListPage
      {...{
        ...props,
        selectedTicketTypeKey,
        selectedSortOrderKey,
        loadMoreThreshold,
        ticketTypes,
        sortTypes,
        tickets,
        ticketsFilter,
        changeTicketsFilter,
        onChangeSortType,
        onChangeSelectedType,
        tsDate,
        getTickets,
        goBackHistory,
        noMoreTickets
      }}
    />
  );
};

export default MyTicketsR;
