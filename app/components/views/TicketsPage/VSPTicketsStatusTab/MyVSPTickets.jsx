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

const ticketTypes = [
  {
    key: txTypes.ALL,
    value: { vspFeeStatus: null },
    label: <T id="vsptickets.type.all" m="All" />
  },
  // VSPFeeProcessStarted FeeStatus = iota
	// // VSPFeeProcessPaid represents the state where the process has being
	// // paid, but not published.
	// VSPFeeProcessPaid
	// VSPFeeProcessErrored
  {
    key: VSP_FEE_PROCESS_STARTED,
    value: { vspFeeStatus: VSP_FEE_PROCESS_STARTED },
    label: labels["vspFeeStarted"]
  },
  {
    key: VSP_FEE_PROCESS_PAID,
    value: { vspFeeStatus: VSP_FEE_PROCESS_PAID },
    label: labels["vspFeePaid"]
  },
  {
    key: VSP_FEE_PROCESS_ERRORED,
    value: { vspFeeStatus: VSP_FEE_PROCESS_ERRORED },
    label: labels["vspFeeErrored"]
  }
];

const selectTicketTypeFromFilter = (filter) => {
  const ticketType = ticketTypes.find(
    (ticket) => filter.vspFeeStatus === ticket.value.vspFeeStatus
  );
  return ticketType && ticketType.key;
};

const MyVSPTickets = ({ toggleIsLegacy }) => {
  const {
    tsDate,
    noMoreTickets,
    ticketsFilter,
    window,
    goBackHistory,
    getLiveTickets,
    changeTicketsFilter,
    vspTickets,
    getVSPTicketsByFeeStatus,
    hasVSPTicketsError,
    defaultSpendingAccount,
    syncVSPTicketsRequest,
    noMoreLiveTickets
  } = useVSPTicketsList();

  const [tickets, setTickets] = useState([]);
  const [account, setAccount] = useState(defaultSpendingAccount);
  const [vsp, setVSP] = useState(null);
  const [selectedTicketTypeKey, setTicketTypeKey] = useState(
    selectTicketTypeFromFilter(ticketsFilter)
  );
  const [selectedSortOrderKey, setSortOrderKey] = useState(
    ticketsFilter.listDirection
  );

  useMountEffect(() => {
    // get vsp tickets fee status
    getVSPTicketsByFeeStatus(VSP_FEE_PROCESS_STARTED);
    getVSPTicketsByFeeStatus(VSP_FEE_PROCESS_PAID);
    getVSPTicketsByFeeStatus(VSP_FEE_PROCESS_ERRORED);
  });

  useEffect(() => {
    let tickets = [];
    Object.keys(vspTickets).forEach((feeStatus) => {
      // if the ticket type is all, always add it to ticket. Otherwise
      // add only  the selected type key.
      if (selectedTicketTypeKey === "all") {
        tickets = [ ...tickets, ...vspTickets[feeStatus] ];
      } else if (selectedTicketTypeKey == feeStatus) {
          tickets = [ ...tickets, ...vspTickets[feeStatus] ];
        }
    });
    setTickets(tickets);
  }, [selectedTicketTypeKey, vspTickets]);

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

  const onSyncVspTicketsRequest = (passphrase) => {
    syncVSPTicketsRequest({
      passphrase,
      account: account.value,
      vspHost: vsp.host,
      vspPubkey: vsp.pubkey
    });
  };

  const loadMoreThreshold = Math.max(0, window.innerHeight - 765);

  return (
    <TicketListPage
      {...{
        selectedTicketTypeKey,
        selectedSortOrderKey,
        loadMoreThreshold,
        ticketTypes,
        toggleIsLegacy,
        tickets,
        ticketsFilter,
        changeTicketsFilter,
        onChangeSortType,
        onChangeSelectedType,
        tsDate,
        getLiveTickets,
        goBackHistory,
        noMoreTickets,
        hasVSPTicketsError,
        account,
        setAccount,
        vsp,
        setVSP,
        onSyncVspTicketsRequest,
        noMoreLiveTickets
      }}
    />
  );
};

export default MyVSPTickets;
