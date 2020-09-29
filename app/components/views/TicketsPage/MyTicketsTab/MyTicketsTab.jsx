import { useState } from "react";
import TicketListPage from "./Page";
import { FormattedMessage as T } from "react-intl";
import { useTicketsList } from "../hooks";
import * as txTypes from "constants/Decrediton";

const labels = {
  [txTypes.UNKNOWN]: <T id="ticket.status.multiple.unknown" m="unknown" />,
  [txTypes.UNMINED]: <T id="ticket.status.multiple.unmined" m="unmined" />,
  [txTypes.IMMATURE]: <T id="ticket.status.multiple.immature" m="immature" />,
  [txTypes.LIVE]: <T id="ticket.status.multiple.live" m="live" />,
  [txTypes.VOTED]: <T id="ticket.status.multiple.voted" m="voted" />,
  [txTypes.MISSED]: <T id="ticket.status.multiple.missed" m="missed" />,
  [txTypes.EXPIRED]: <T id="ticket.status.multiple.expired" m="expired" />,
  [txTypes.REVOKED]: <T id="ticket.status.multiple.revoked" m="revoked" />
};

const sortTypes = [
  {
    value: txTypes.DESC,
    key: txTypes.DESC,
    label: <T id="tickets.sortby.newest" m="Newest" />
  },
  {
    value: txTypes.ASC,
    key: txTypes.ASC,
    label: <T id="tickets.sortby.oldest" m="Oldest" />
  }
];

const ticketTypes = [
  {
    key: txTypes.ALL,
    value: { status: null },
    label: <T id="tickets.type.all" m="All" />
  },
  {
    key: txTypes.UNMINED,
    value: { status: txTypes.UNMINED },
    label: labels[txTypes.UNMINED]
  },
  {
    key: txTypes.IMMATURE,
    value: { status: txTypes.IMMATURE },
    label: labels[txTypes.IMMATURE]
  },
  {
    key: txTypes.LIVE,
    value: { status: txTypes.LIVE },
    label: labels[txTypes.LIVE]
  },
  {
    key: txTypes.VOTED,
    value: { status: txTypes.VOTED },
    label: labels[txTypes.VOTED]
  },
  {
    key: txTypes.MISSED,
    value: { status: txTypes.MISSED },
    label: labels[txTypes.MISSED]
  },
  {
    key: txTypes.EXPIRED,
    value: { status: txTypes.EXPIRED },
    label: labels[txTypes.EXPIRED]
  },
  {
    key: txTypes.REVOKED,
    value: { status: txTypes.REVOKED },
    label: labels[txTypes.REVOKED]
  }
];

const selectTicketTypeFromFilter = (filter) => {
  const ticketType = ticketTypes.find(
    (ticket) => filter.status === ticket.value.status
  );
  return ticketType && ticketType.key;
};

const MyTickets = (props) => {
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

export default MyTickets;
