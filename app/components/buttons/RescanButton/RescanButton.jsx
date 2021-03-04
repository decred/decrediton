import { FormattedMessage as T } from "react-intl";
import styles from "./RescanButton.module.css";
import { classNames, Tooltip } from "pi-ui";

const rescanBtnMessage = `Initiate a transaction rescan.

Rescanning may help resolve some balance errors.

Note: This scans the entire blockchain for transactions,
but does not re-download it.`;

export default ({ rescanRequest, rescanAttempt }) => (
  <Tooltip
    placement="right"
    contentClassName={styles.tooltip}
    content={<T id="sidebar.rescanBtn.tip" m={rescanBtnMessage} />}
    disabled={rescanRequest}>
    <button
      aria-label="Rescan"
      disabled={!!rescanRequest}
      className={classNames(styles.rescan, rescanRequest && styles.syncing)}
      onClick={() => rescanAttempt(0)}
    />
  </Tooltip>
);
