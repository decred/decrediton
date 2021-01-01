import { useState } from "react";
import { FormattedMessage as T } from "react-intl";
import TicketListPage from "./Page";
import { useTicketsList } from "./hooks";
import * as txTypes from "constants/decrediton";

const QRCode = require("qrcode");

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

const qrHashes = [];
const txPerQR = 15;
// TODO: Use translated phrase or loading gif.
const defaultLoading = "Loading...";
let loadingQR = defaultLoading;
const qrs = [];

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

const activeFilter = (t) => {
  return (
    t.status === txTypes.UNMINED ||
    t.status === txTypes.IMMATURE ||
    t.status === txTypes.LIVE
  );
};

const MyTickets = ({ toggleIsLegacy }) => {
  const {
    tickets,
    tsDate,
    noMoreTickets,
    ticketsFilter,
    window,
    goBackHistory,
    getTickets,
    changeTicketsFilter,
    setQRPage,
    qrPage
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

  const arraysEqual = (a, b) => {
    if (a === b) return true;
    if (a == null || b == null) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; ++i) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  };

  const handlePageClick = (data) => {
    setQRPage(data.selected);
  };

  // getQR asychronously updates the qr codes if current viewed ticket hashes
  // have changed since last viewing.
  const getQR = () => {
    loadingQR = defaultLoading;
    const filteredTiks = tickets.filter(activeFilter);
    const newQRHashes = [];
    for (let i = 0, len = filteredTiks.length; i < len; i++) {
      newQRHashes.push(filteredTiks[i].txHash);
    }
    // Check and stop if ticket hashes have not changed.
    if (arraysEqual(qrHashes, newQRHashes)) {
      loadingQR = null;
      return;
    }
    qrHashes.length = 0;
    qrs.length = 0;
    setQRPage(0);
    if (newQRHashes.length == 0) {
      loadingQR = null;
      return;
    }
    qrs.length = Math.ceil(newQRHashes.length / txPerQR);
    qrHashes.push.apply(qrHashes, newQRHashes);
    for (let i = 0; i < qrs.length; i++) {
      const start = i * txPerQR;
      const qrdata = JSON.stringify(newQRHashes.slice(start, start + txPerQR));
      QRCode.toDataURL(qrdata, (err, url) => {
        // TODO: null after all finished.
        loadingQR = null;
        if (err) {
          // TODO: Display error in snackbar.
          console.log(err);
          return;
        }
        qrs[i] = url;
      });
    }
  };

  const loadMoreThreshold = 90 + Math.max(0, window.innerHeight - 765);

  return (
    <TicketListPage
      {...{
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
        noMoreTickets,
        loadingQR,
        qrs,
        qrPage,
        handlePageClick,
        getQR,
        toggleIsLegacy
      }}
    />
  );
};

export default MyTickets;
