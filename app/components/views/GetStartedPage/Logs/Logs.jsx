import { Tooltip } from "pi-ui";
import { LogsTab } from "views/SettingsPage/LogsTab/LogsTab";
import { GoBackMsg } from "../messages";
import styles from "../GetStarted.module.css";
import { BackButton } from "../helpers";

export default ({ onSendBack }) => (
  <>
    <div className={styles.goBackScreenButtonArea}>
      <Tooltip content={<GoBackMsg />}>
        <BackButton onClick={onSendBack} />
      </Tooltip>
    </div>
    <div className={styles.logContainer}>
      <LogsTab />
    </div>
  </>
);
