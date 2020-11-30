import { FormattedMessage as T } from "react-intl";
import {
  TRANSACTION_DIR_SENT,
  TRANSACTION_DIR_RECEIVED,
  TRANSACTION_DIR_TRANSFERRED,
  MIXED
} from "constants";

export const selectedTxTypeFromFilter = (filter) => {
  const types = getTxTypes();
  let key;
  types.forEach((type) => {
    if (filter.direction === type.value.direction) {
      key = type.key;
      return;
    }
  });
  return key;
};

export const getSortTypes = () => ([
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
]);

export const getTxTypes = () => ([
  {
    key: "all",
    value: { direction: null, type: -1 },
    label: <T id="txFilter.type.all" m="All" />
  },
  // -1 cleans the filter types, and right now we are cleaning transaction
  // types if a direction is set, instead of acumullating them, because we
  // need to apply changes on EyeFilterMenu Component, for having multiple
  // options marked.
  {
    key: "sent",
    value: { direction: TRANSACTION_DIR_SENT, type: -1 },
    label: <T id="txFilter.type.sent" m="Sent" />
  },
  {
    key: "receiv",
    value: { direction: TRANSACTION_DIR_RECEIVED, type: -1 },
    label: <T id="txFilter.type.received" m="Received" />
  },
  {
    key: "transf",
    value: { direction: TRANSACTION_DIR_TRANSFERRED, type: -1 },
    label: <T id="txFilter.type.transfered" m="Transfered" />
  },
  {
    key: "mixed",
    value: { type: MIXED },
    label: <T id="txFilter.type.mixed" m="Mixed" />
  }
]);
