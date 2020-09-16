import { FormattedMessage as T } from "react-intl";
import {
  TRANSACTION_DIR_SENT,
  TRANSACTION_DIR_RECEIVED,
  TRANSACTION_DIR_TRANSFERRED
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
    value: { direction: null },
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
    key: "transf",
    value: { direction: TRANSACTION_DIR_TRANSFERRED },
    label: <T id="txFilter.type.transfered" m="Transfered" />
  }
]);
