import { Tooltip } from "pi-ui";
import { LogsTab } from "views/SettingsPage/LogsTab/LogsTab";
import { GoBackMsg } from "../messages";
import styles from "../GetStarted.module.css";

export default ({ onSendBack }) => (
  <>
    <div className={styles.goBackScreenButtonArea}>
      <Tooltip content={<GoBackMsg />}>
        <div className={styles.goBackScreenButton} onClick={onSendBack} />
      </Tooltip>
    </div>
    <div className={styles.logContainer}>
      <LogsTab />
    </div>
  </>
);
