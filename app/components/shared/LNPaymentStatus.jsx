import { StatusTag } from "pi-ui";
import { defineMessages } from "react-intl";
import { useIntl } from "react-intl";
import { PAYMENT_STATUS_PENDING, PAYMENT_STATUS_FAILED } from "constants";

const messages = defineMessages({
  confirmed: {
    id: "ln.LNPaymentStatus.confirmed",
    defaultMessage: "Confirmed"
  },
  failed: {
    id: "ln.LNPaymentStatus.failed",
    defaultMessage: "Failed"
  },
  pending: {
    id: "ln.LNPaymentStatus.pending",
    defaultMessage: "Pending"
  }
});

const LNPaymentStatus = ({ status }) => {
  const intl = useIntl();
  return status === PAYMENT_STATUS_PENDING ? (
    <StatusTag type="bluePending" text={intl.formatMessage(messages.pending)} />
  ) : status === PAYMENT_STATUS_FAILED ? (
    <StatusTag
      type="orangeNegativeCircled"
      text={intl.formatMessage(messages.failed)}
    />
  ) : (
    <StatusTag
      type="greenCheck"
      text={intl.formatMessage(messages.confirmed)}
    />
  );
};

export default LNPaymentStatus;
