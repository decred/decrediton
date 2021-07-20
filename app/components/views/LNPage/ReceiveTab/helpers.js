import { FormattedMessage as T } from "react-intl";
import {
  INVOICE_STATUS_OPEN,
  INVOICE_STATUS_SETTLED,
  INVOICE_STATUS_EXPIRED,
  INVOICE_STATUS_CANCELED
} from "constants";

export const getSortTypes = () => [
  {
    value: "desc",
    key: "desc",
    label: <T id="ln.invoice.sortby.newest" m="Newest" />
  },
  {
    value: "asc",
    key: "asc",
    label: <T id="ln.invoice.sortby.oldest" m="Oldest" />
  }
];

// -1 cleans the filter types
export const getInvoiceTypes = () => [
  {
    key: "all",
    value: { type: "all" },
    label: <T id="invoiceFilter.type.all" m="All" />
  },
  {
    key: "open",
    value: { type: INVOICE_STATUS_OPEN },
    label: <T id="invoiceFilter.type.open" m="Not Paid Yet" />
  },
  {
    key: "settled",
    value: { type: INVOICE_STATUS_SETTLED },
    label: <T id="invoiceFilter.type.settled" m="Received" />
  },
  {
    key: "expired",
    value: { type: INVOICE_STATUS_EXPIRED },
    label: <T id="invoiceFilter.type.expired" m="Expired" />
  },
  {
    key: "canceled",
    value: { type: INVOICE_STATUS_CANCELED },
    label: <T id="invoiceFilter.type.canceled" m="Canceled" />
  }
];
