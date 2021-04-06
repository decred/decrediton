import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "pi-ui";
import { FormattedRelative } from "shared";
import styles from "./Event.module.css";

export const VOTE_ENDS_EVENT = "VOTE_ENDS";
export const VOTE_ENDED_EVENT = "VOTE_ENDED";
export const PROPOSAL_UPDATED_EVENT = "PROPOSAL_UPDATED";

const messages = {
  [VOTE_ENDS_EVENT]: <T id="proposal.event.voteends" m="vote ends" />,
  [VOTE_ENDED_EVENT]: <T id="proposal.event.voteended" m="vote ended" />,
  [PROPOSAL_UPDATED_EVENT]: <T id="proposal.event.updated" m="updated" />
};

const Event = ({ timestamp, tsDate, eventType, className }) => (
  <Tooltip
    contentClassName={styles.tooltip}
    content={
      <T
        id="proposal.event.fullTime"
        m="{timestamp, date, medium} {timestamp, time, short}"
        values={{ timestamp: tsDate(timestamp) }}
      />
    }>
    <div className={className}>
      <span>{messages[eventType]}</span>{" "}
      <FormattedRelative value={tsDate(timestamp)} />
    </div>
  </Tooltip>
);

export default Event;
