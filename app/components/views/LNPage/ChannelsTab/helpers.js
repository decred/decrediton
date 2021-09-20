import { FormattedMessage as T } from "react-intl";
import {
  CHANNEL_STATUS_ACTIVE,
  CHANNEL_STATUS_PENDING,
  CHANNEL_STATUS_CLOSED
} from "constants";

// -1 cleans the filter types
export const getChannelTypes = () => [
  {
    key: "all",
    value: { type: "all" },
    label: <T id="channelFilter.type.all" m="All" />
  },
  {
    key: "active",
    value: { type: CHANNEL_STATUS_ACTIVE },
    label: <T id="channelFilter.type.open" m="Open" />
  },
  {
    key: "pending",
    value: { type: CHANNEL_STATUS_PENDING },
    label: <T id="channelFilter.type.pending" m="Pending" />
  },
  {
    key: "closed",
    value: { type: CHANNEL_STATUS_CLOSED },
    label: <T id="channelFilter.type.closed" m="Closed" />
  }
];
