import { FormattedRelative } from "shared";
import styles from "../ProposalDetails.module.css";
import { FormattedMessage as T } from "react-intl";

const TimeValue = ({ timestamp, tsDate }) => (
  <>
    <span className={styles.timeValue}>
      <FormattedRelative value={tsDate(timestamp)} />
    </span>
    (
    <T
      id="proposal.overview.fullTime"
      m="{timestamp, date, medium} {timestamp, time, short}"
      values={{ timestamp: tsDate(timestamp) }}
    />
    )
  </>
);

export default TimeValue;
