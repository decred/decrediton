import { useState, useEffect, useMemo, useRef } from "react";
import { FormattedMessage as T } from "react-intl";
import TicketListPage from "./Page";
import { useTicketsList } from "./hooks";
import {
  UNKNOWN,
  UNMINED,
  IMMATURE,
  LIVE,
  VOTED,
  MISSED,
  EXPIRED,
  REVOKED,
  DESC,
  ASC,
  ALL,
  BATCH_TX_COUNT
} from "constants";

const labels = {
  [UNKNOWN]: <T id="ticket.status.multiple.unknown" m="unknown" />,
  [UNMINED]: <T id="ticket.status.multiple.unmined" m="unmined" />,
  [IMMATURE]: <T id="ticket.status.multiple.immature" m="immature" />,
  [LIVE]: <T id="ticket.status.multiple.live" m="live" />,
  [VOTED]: <T id="ticket.status.multiple.voted" m="voted" />,
  [MISSED]: <T id="ticket.status.multiple.missed" m="missed" />,
  [EXPIRED]: <T id="ticket.status.multiple.expired" m="expired" />,
  [REVOKED]: <T id="ticket.status.multiple.revoked" m="revoked" />
};

const sortTypes = [
  {
    value: DESC,
    key: DESC,
    label: <T id="tickets.sortby.newest" m="Newest" />
  },
  {
    value: ASC,
    key: ASC,
    label: <T id="tickets.sortby.oldest" m="Oldest" />
  }
];

const ticketTypes = [
  {
    key: ALL,
    value: { status: null },
    label: <T id="tickets.type.all" m="All" />
  },
  {
    key: UNMINED,
    value: { status: UNMINED },
    label: labels[UNMINED]
  },
  {
    key: IMMATURE,
    value: { status: IMMATURE },
    label: labels[IMMATURE]
  },
  {
    key: LIVE,
    value: { status: LIVE },
    label: labels[LIVE]
  },
  {
    key: VOTED,
    value: { status: VOTED },
    label: labels[VOTED]
  },
  {
    key: MISSED,
    value: { status: MISSED },
    label: labels[MISSED]
  },
  {
    key: EXPIRED,
    value: { status: EXPIRED },
    label: labels[EXPIRED]
  },
  {
    key: REVOKED,
    value: { status: REVOKED },
    label: labels[REVOKED]
  }
];

const selectTicketTypeFromFilter = (filter) => {
  const ticketType = ticketTypes.find(
    (ticket) => filter.status === ticket.value.status
  );
  return ticketType && ticketType.key;
};

const MyTickets = ({ toggleIsLegacy }) => {
  const {
    intl,
    tickets,
    tsDate,
    noMoreTickets,
    ticketsFilter,
    window,
    goBackHistory,
    getTickets,
    changeTicketsFilter,
    QRsPage,
    onQRPageClick,
    loadingQRs,
    QRs,
    prepareQRs
  } = useTicketsList();

  const [selectedTicketTypeKey, setTicketTypeKey] = useState(
    selectTicketTypeFromFilter(ticketsFilter)
  );
  const [selectedSortOrderKey, setSortOrderKey] = useState(
    ticketsFilter.listDirection
  );
  const [searchText, setSearchText] = useState(ticketsFilter.search);

  const [index, setIndex] = useState(() =>
    Math.min(BATCH_TX_COUNT, tickets.length)
  );
  const [noMoreTicketsToShow, setNoMoreTicketsToShow] = useState(false);

  const onLoadMoreTickets = () => {
    if (index < tickets.length) {
      setIndex(Math.min(index + BATCH_TX_COUNT, tickets.length));
    } else if (!noMoreTickets) {
      getTickets();
    } else {
      setNoMoreTicketsToShow(true);
    }
  };

  const visibleTickets = useMemo(() => tickets.slice(0, index), [
    index,
    tickets
  ]);

  const isMounted = useRef(false);
  useEffect(() => {
    if (isMounted.current) {
      setIndex(BATCH_TX_COUNT);
      setNoMoreTicketsToShow(false);
    } else {
      isMounted.current = true;
    }
  }, [ticketsFilter, isMounted]);

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

  const onChangeSearchText = (searchText) => {
    onChangeFilter({ search: searchText });
    setSearchText(searchText);
  };
  const loadMoreThreshold = 90 + Math.max(0, window.innerHeight - 765);

  return (
    <TicketListPage
      {...{
        intl,
        searchText,
        onChangeSearchText,
        selectedTicketTypeKey,
        selectedSortOrderKey,
        loadMoreThreshold,
        ticketTypes,
        sortTypes,
        tickets: visibleTickets,
        ticketsFilter,
        changeTicketsFilter,
        onChangeSortType,
        onChangeSelectedType,
        tsDate,
        getTickets: onLoadMoreTickets,
        goBackHistory,
        noMoreTickets: noMoreTicketsToShow,
        toggleIsLegacy,
        loadingQRs,
        QRs,
        QRsPage,
        onQRPageClick,
        prepareQRs
      }}
    />
  );
};

export default MyTickets;
