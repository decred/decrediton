import { FormattedMessage as T } from "react-intl";
import styles from "./BackupInfoHeader.module.css";

const BackupInfoHeader = ({ scbPath, scbUpdatedTime }) => (
  <div className={styles.header}>
    <div className={styles.text}>
      <div>
        <T
          id="ln.backupInfo.location"
          m="SCB backup file location: {path}"
          values={{ path: scbPath }}
        />
      </div>
      <div>
        <T
          id="ln.backupInfo.lastUpdated"
          m="Last Updated: {lastUpdate, date} {lastUpdate, time, short}"
          values={{ lastUpdate: scbUpdatedTime }}
        />
      </div>
    </div>
  </div>
);

export default BackupInfoHeader;
