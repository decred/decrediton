import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "pi-ui";
import styles from "./RescanButton.module.css";

export default ({ rescanRequest, rescanCancel }) => (
  <Tooltip
    content={<T id="sidebar.rescanCancelBtn.tip" m="Cancel rescan" />}
    disabled={!rescanRequest}>
    <button
      aria-label="Cancel rescan"
      disabled={!rescanRequest}
      className={styles.cancel}
      onClick={() => rescanCancel()}
    />
  </Tooltip>
);
