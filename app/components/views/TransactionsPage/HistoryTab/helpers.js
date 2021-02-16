import { FormattedMessage as T } from "react-intl";
import {
  TRANSACTION_DIR_SENT,
  TRANSACTION_DIR_RECEIVED,
  TICKET_FEE,
  MIXED
} from "constants";

export const selectedTxTypesFromFilter = (filter) => {
  const txTypes = getTxTypes();
  const keys = txTypes
    .filter(
      (txType) =>
        filter.directions.includes(txType.value.direction) ||
        filter.types.includes(txType.value.type)
    )
    .map((type) => type.key);

  // return 'all' key if there is no direction or type was set
  return keys.length == 0 ? [txTypes[0].key] : keys;
};

export const getSortTypes = () => [
  {
    value: "desc",
    key: "desc",
    label: <T id="transaction.sortby.newest" m="Newest" />
  },
  {
    value: "asc",
    key: "asc",
    label: <T id="transaction.sortby.oldest" m="Oldest" />
  }
];

// -1 cleans the filter types
export const getTxTypes = () => [
  {
    key: "all",
    value: { direction: null, type: -1 },
    label: <T id="txFilter.type.all" m="All" />
  },
  {
    key: "sent",
    value: { direction: TRANSACTION_DIR_SENT },
    label: <T id="txFilter.type.sent" m="Sent" />
  },
  {
    key: "receiv",
    value: { direction: TRANSACTION_DIR_RECEIVED },
    label: <T id="txFilter.type.received" m="Received" />
  },
  {
    key: "ticketf",
    value: { direction: TICKET_FEE },
    label: <T id="txFilter.type.ticketfee" m="Ticket fee" />
  },
  {
    key: "mixed",
    value: { type: MIXED },
    label: <T id="txFilter.type.mixed" m="Mixed" />
  }
];
