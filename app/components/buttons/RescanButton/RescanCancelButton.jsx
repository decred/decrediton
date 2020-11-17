import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "shared";
import styles from "./RescanButton.module.css";

export default ({ rescanRequest, rescanCancel }) => (
  <Tooltip
    text={<T id="sidebar.rescanCancelBtn.tip" m="Cancel rescan" />}
    disabled={!rescanRequest}>
    <button
      aria-label="Cancel rescan"
      disabled={!rescanRequest}
      className={styles.cancel}
      onClick={() => rescanCancel()}
    />
  </Tooltip>
);
