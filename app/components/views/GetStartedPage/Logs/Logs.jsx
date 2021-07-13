import { Tooltip } from "pi-ui";
import { LogsTab } from "views/SettingsPage/LogsTab/LogsTab";
import { GoBackMsg } from "../messages";
import { BackButton, BackButtonArea } from "../helpers";
import styles from "./Logs.module.css";

export default ({ onSendBack }) => (
  <>
    <BackButtonArea className={styles.backButtonArea}>
      <Tooltip content={<GoBackMsg />}>
        <BackButton onClick={onSendBack} />
      </Tooltip>
    </BackButtonArea>
    <div>
      <LogsTab />
    </div>
  </>
);
