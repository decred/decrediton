import { StatusTag } from "pi-ui";
import { defineMessages } from "react-intl";
import { useIntl } from "react-intl";

const messages = defineMessages({
  received: {
    id: "ln.LNInvoiceStatus.received",
    defaultMessage: "Received"
  },
  expired: {
    id: "ln.LNInvoiceStatus.expired",
    defaultMessage: "Expired"
  },
  canceled: {
    id: "ln.LNInvoiceStatus.canceled",
    defaultMessage: "Canceled"
  },
  notPaidYet: {
    id: "ln.LNInvoiceStatus.notPaidYet",
    defaultMessage: "Not Paid Yet"
  }
});

const LNInvoiceStatus = (status) => {
  const intl = useIntl();
  return status === "settled" ? (
    <StatusTag type="greenCheck" text={intl.formatMessage(messages.received)} />
  ) : status === "expired" ? (
    <StatusTag
      type="grayNegative"
      text={intl.formatMessage(messages.expired)}
    />
  ) : status === "canceled" ? (
    <StatusTag
      type="orangeNegativeCircled"
      text={intl.formatMessage(messages.canceled)}
    />
  ) : (
    <StatusTag
      type="bluePending"
      text={intl.formatMessage(messages.notPaidYet)}
    />
  );
};

export default LNInvoiceStatus;
