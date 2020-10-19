import { useEffect, useState } from "react";
import TicketListPage from "./Page";
import { FormattedMessage as T } from "react-intl";
import { useVSPTicketsList } from "./hooks";
import * as txTypes from "constants/Decrediton";
import {
  VSP_FEE_PROCESS_STARTED,
  VSP_FEE_PROCESS_PAID,
  VSP_FEE_PROCESS_ERRORED
} from "constants";
import { useMountEffect } from "hooks";

const labels = {
  "vspFeeStarted": <T id="vsp.ticket.vsp.fee.started" m="Unpaid Fee" />,
  "vspFeePaid": <T id="vsp.ticket.vsp.fee.paid" m="Paid Fee" />,
  "vspFeeErrored": <T id="vsp.ticket.vsp.fee.errored" m="Fee Error" />
};

// const sortTypes = [
//   {
//     value: txTypes.DESC,
//     key: txTypes.DESC,
//     label: <T id="tickets.sortby.newest" m="Newest" />
//   },
//   {
//     value: txTypes.ASC,
//     key: txTypes.ASC,
//     label: <T id="tickets.sortby.oldest" m="Oldest" />
//   }
// ];

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
  },
  // VSPFeeProcessStarted FeeStatus = iota
	// // VSPFeeProcessPaid represents the state where the process has being
	// // paid, but not published.
	// VSPFeeProcessPaid
	// VSPFeeProcessErrored
  {
    key: "vspFeeStarted",
    value: { vspFeeStatus: VSP_FEE_PROCESS_STARTED },
    label: labels["vspFeeStarted"]
  },
  {
    key: "vspFeePaid",
    value: { vspFeeStatus: VSP_FEE_PROCESS_PAID },
    label: labels["vspFeePaid"]
  },
  {
    key: "vspFeeErrored",
    value: { vspFeeStatus: VSP_FEE_PROCESS_ERRORED },
    label: labels["vspFeeErrored"]
  }
];

const selectTicketTypeFromFilter = (filter) => {
  const ticketType = ticketTypes.find(
    (ticket) => filter.status === ticket.value.status
  );
  return ticketType && ticketType.key;
};

const MyVSPTickets = () => {
  const {
    tickets,
    tsDate,
    noMoreTickets,
    ticketsFilter,
    window,
    goBackHistory,
    getTickets,
    changeTicketsFilter,
    vspTickets
  } = useVSPTicketsList();

  console.log(vspTickets)

  // useMountEffect(() => {

  // })

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
        selectedTicketTypeKey,
        selectedSortOrderKey,
        loadMoreThreshold,
        ticketTypes,
        // sortTypes,
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

export default MyVSPTickets;
