import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "shared";
import styles from "./ProgressIndicator.module.css";

// TODO: we should improve this component and use the StatusTag component
//       from pi-ui. But since the component is not able to receive React
//       nodes as the `text` prop, we should keep this in order to keep the
//       internationalization
const ProgressIndicator = ({ passed, inProgress }) =>
  !inProgress ? (
    <Tooltip
      text={
        <T
          id="agenda.card.finishedTooltip"
          m="This agenda has finished voting and {passed}.  You may still toggle your vote choices, but they will no longer be tallied."
          values={{ passed: passed ? "PASSED" : "NOT PASSED" }}
        />
      }>
      <div className={styles.finishedIndicator}>
        <T id="agenda.card.finishedIndicator" m="Finished" />
      </div>
    </Tooltip>
  ) : (
    <Tooltip
      text={
        <T
          id="agenda.card.inProgressTooltip"
          m="Voting is still in progress."
        />
      }>
      <div className={styles.inProgressIndicator}>
        <T id="agenda.card.inProgressIndicator" m="In Progress" />
      </div>
    </Tooltip>
  );

export default ProgressIndicator;
