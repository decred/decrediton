import { FormattedMessage as T } from "react-intl";

// status for a single ticket
export const statusTxt = {
  "unknown": <T id="ticket.status.unknown" m="unknown" />,
  "unmined": <T id="ticket.status.unmined" m="unmined" />,
  "immature": <T id="ticket.status.immature" m="immature" />,
  "live": <T id="ticket.status.live" m="live" />,
  "voted": <T id="ticket.status.voted" m="voted" />,
  "missed": <T id="ticket.status.missed" m="missed" />,
  "expired": <T id="ticket.status.expired" m="expired" />,
  "revoked": <T id="ticket.status.revoked" m="revoked" />,
};

// status for (possibly) multiple tickets
export const statusMultipleTxt = {
  "unknown": <T id="ticket.status.multiple.unknown" m="unknown" />,
  "unmined": <T id="ticket.status.multiple.unmined" m="unmined" />,
  "immature": <T id="ticket.status.multiple.immature" m="immature" />,
  "live": <T id="ticket.status.multiple.live" m="live" />,
  "voted": <T id="ticket.status.multiple.voted" m="voted" />,
  "missed": <T id="ticket.status.multiple.missed" m="missed" />,
  "expired": <T id="ticket.status.multiple.expired" m="expired" />,
  "revoked": <T id="ticket.status.multiple.revoked" m="revoked" />,
};
