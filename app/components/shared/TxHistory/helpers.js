import { FormattedMessage as T } from "react-intl";
import * as txTypes from "constants/Decrediton";

export const messageByType = {
  [txTypes.TICKET]: <T id="transaction.type.ticket" m="Purchased" />,
  [txTypes.VOTE]: <T id="transaction.type.vote" m="Voted" />,
  [txTypes.VOTED]: <T id="transaction.type.voted" m="Voted" />,
  [txTypes.REVOCATION]: <T id="transaction.type.revocation" m="Revoked" />,
  [txTypes.UNMINED]: <T id="transaction.type.unmined" m="Unmined" />,
  [txTypes.IMMATURE]: <T id="transaction.type.immature" m="Immature" />,
  [txTypes.MISSED]: <T id="transaction.type.missed" m="Missed" />,
  [txTypes.EXPIRED]: <T id="transaction.type.expired" m="Expired" />,
  [txTypes.REVOKED]: <T id="transaction.type.revoked" m="Revoked" />,
  [txTypes.LIVE]: <T id="transaction.type.live" m="Live" />
};
