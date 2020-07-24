import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "pi-ui";
import styles from "./FinishedIndicator.module.css";

const FinishedIndicator = ({ passed }) => (
  <Tooltip
    content={
      <T
        id="agenda.card.finishedTooltip"
        m="This agenda has finished voting and {passed}.  You may still toggle your vote choices, but they will no longer be tallied."
        values={{ passed: passed ? "PASSED" : "NOT PASSED" }}
      />
    }>
    <div className={styles.indicatorFinished}>
      <T id="agenda.card.finishedIndicator" m="Finished" />
    </div>
  </Tooltip>
);

export default FinishedIndicator;
