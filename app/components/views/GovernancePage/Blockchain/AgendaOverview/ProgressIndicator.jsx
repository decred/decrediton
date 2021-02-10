import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "pi-ui";
import styles from "./Overview.module.css";

// TODO: we should improve this component and use the StatusTag component
//       from pi-ui. But since the component is not able to receive React
//       nodes as the `text` prop, we should keep this in order to keep the
//       internationalization
const ProgressIndicator = ({ passed, inProgress }) =>
  !inProgress ? (
    <Tooltip
      className={styles.tooltip}
      contentClassName={styles.tooltipContent}
      content={
        <T
          id="agenda.card.finishedTooltip"
          m="This agenda has finished voting and {passed}."
          values={{ passed: passed ? "PASSED" : "NOT PASSED" }}
        />
      }>
      <div className={styles.finishedIndicator}>
        <T id="agenda.card.finishedIndicator" m="Finished" />
      </div>
    </Tooltip>
  ) : (
    <Tooltip
      className={styles.tooltip}
      contentClassName={styles.progressTooltipContent}
      content={
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
