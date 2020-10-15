import { useState } from "react";
import { useTicketsList } from "./hooks";
import TicketListPage from "./Page";
import { FormattedMessage as T } from "react-intl";

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

const MyTickets = () => {
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

  // TODO use constants
  const getTicketTypes = () => [
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

  const selectedTicketTypeFromFilter = (filter) => {
    const types = getTicketTypes();
    let key;
    // XXX ?replace with find?
    types.forEach((type) => {
      if (filter.status === type.value.status) {
        key = type.key;
        return;
      }
    });
    return key;
  };

  const [selectedTicketTypeKey, setSelectedTicketTypeKey] = useState(
    selectedTicketTypeFromFilter(ticketsFilter)
  );

  const [selectedSortOrderKey, setSelectedSortOrderKey] = useState(
    ticketsFilter.listDirection
  );

  const getSortTypes = () => [
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

  const onChangeFilter = (value) => {
    const newFilter = {
      ...ticketsFilter,
      ...value
    };
    changeTicketsFilter(newFilter);
  };

  const onChangeSelectedType = ({ key, value }) => {
    onChangeFilter(value);
    setSelectedTicketTypeKey(key);
  };

  const onChangeSortType = ({ value }) => {
    onChangeFilter({ listDirection: value });
    setSelectedSortOrderKey(value);
  };

  const loadMoreThreshold = 90 + Math.max(0, window.innerHeight - 765);
  return (
    <TicketListPage
      {...{
        tickets,
        tsDate,
        noMoreTickets,
        ticketsFilter,
        window,
        goBackHistory,
        getTickets,
        changeTicketsFilter,
        selectedSortOrderKey,
        selectedTicketTypeKey,
        loadMoreThreshold,
        onChangeSelectedType,
        onChangeSortType,
        ticketTypes: getTicketTypes(),
        sortTypes: getSortTypes()
      }}
    />
  );
};

export default MyTickets;
