import { StatusTag } from "pi-ui";
import { defineMessages } from "react-intl";
import { useIntl } from "react-intl";
import { CHANNEL_STATUS_ACTIVE, CHANNEL_STATUS_PENDING } from "constants";

const messages = defineMessages({
  open: {
    id: "ln.LNChannelStatus.open",
    defaultMessage: "Open"
  },
  pending: {
    id: "ln.LNChannelStatus.pending",
    defaultMessage: "Pending"
  },
  closed: {
    id: "ln.LNChannelStatus.closed",
    defaultMessage: "Closed"
  }
});

const LNChannelStatus = ({ channel }) => {
  const intl = useIntl();
  return channel.status === CHANNEL_STATUS_ACTIVE ? (
    <StatusTag type="bluePending" text={intl.formatMessage(messages.open)} />
  ) : channel.status === CHANNEL_STATUS_PENDING ? (
    <StatusTag type="yellowTime" text={intl.formatMessage(messages.pending)} />
  ) : (
    <StatusTag type="grayNegative" text={intl.formatMessage(messages.closed)} />
  );
};

export default LNChannelStatus;
