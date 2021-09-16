import { FormattedMessage as T } from "react-intl";
import { InvisibleButton } from "buttons";

const BackupInfoDetails = ({ onBackup, onVerifyBackup }) => (
  <div>
    <InvisibleButton onClick={onBackup}>
      <T id="ln.backup.backupBtn" m="Backup Now" />
    </InvisibleButton>
    <InvisibleButton onClick={onVerifyBackup}>
      <T id="ln.backup.verifyBtn" m="Verify Backup" />
    </InvisibleButton>
  </div>
);

export default BackupInfoDetails;
