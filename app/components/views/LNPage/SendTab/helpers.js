import { FormattedMessage as T } from "react-intl";
import {
  PAYMENT_STATUS_FAILED,
  PAYMENT_STATUS_PENDING,
  PAYMENT_STATUS_CONFIRMED
} from "constants";

export const getSortTypes = () => [
  {
    value: "desc",
    key: "desc",
    label: <T id="ln.payments.sortby.newest" m="Newest" />
  },
  {
    value: "asc",
    key: "asc",
    label: <T id="ln.payments.sortby.oldest" m="Oldest" />
  }
];

// -1 cleans the filter types
export const getPaymentTypes = () => [
  {
    key: "all",
    value: { type: "all" },
    label: <T id="paymentFilter.type.all" m="All" />
  },
  {
    key: "confirmed",
    value: { type: PAYMENT_STATUS_CONFIRMED },
    label: <T id="paymentFilter.type.confirmed" m="Confirmed" />
  },
  {
    key: "failed",
    value: { type: PAYMENT_STATUS_FAILED },
    label: <T id="paymentFilter.type.failed" m="Failed" />
  },
  {
    key: "pending",
    value: { type: PAYMENT_STATUS_PENDING },
    label: <T id="paymentFilter.type.pending" m="Pending" />
  }
];
