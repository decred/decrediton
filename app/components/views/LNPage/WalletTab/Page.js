import { FormattedMessage as T } from "react-intl";
import { Balance, VerticalAccordion } from "shared";
import { InfoDocModalButton, InvisibleButton } from "buttons";

const BackupInfoHeader = ({ scbPath, scbUpdatedTime }) => (
  <div className="ln-backup-info-header">
    <div className="backup-icon" />
    <div className="info">
      <div className="text">
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
      <div className="info-btn">
        <InfoDocModalButton
          document="LNBackupInfo"
          modalClassName="info-modal-fields"
          double
          draggable
        />
      </div>
    </div>
  </div>
);

const BackupInfoDetails = ({ onBackup, onVerifyBackup }) => (
  <div className="ln-backup-info-details">
    <InvisibleButton onClick={onBackup}>
      <T id="ln.backup.backupBtn" m="Backup Now" />
    </InvisibleButton>
    <InvisibleButton onClick={onVerifyBackup}>
      <T id="ln.backup.verifyBtn" m="Verify Backup" />
    </InvisibleButton>
  </div>
);

export default ({
  alias,
  identityPubkey,
  confirmedBalance,
  totalBalance,
  unconfirmedBalance,
  isShowingBackupInfo,
  scbPath,
  scbUpdatedTime,
  onToggleShowBackupInfo,
  onBackup,
  onVerifyBackup
}) => (
  <>
    <div className="ln-wallet-balances">
      <div>
        <T id="ln.walletTab.alias" m="Node Alias" />
      </div>
      <span>{alias}</span>
      <div>
        <T id="ln.walletTab.pubkey" m="Node Pubkey" />
      </div>
      <span>{identityPubkey}</span>
      <div>
        <T id="ln.walletTab.confirmedBalance" m="Confirmed" />
      </div>
      <Balance amount={confirmedBalance} />
      <div>
        <T id="ln.walletTab.unconfirmedBalance" m="Unconfirmed" />
      </div>
      <Balance amount={unconfirmedBalance} />
      <div>
        <T id="ln.walletTab.totalBalance" m="Total" />
      </div>
      <Balance amount={totalBalance} />
    </div>

    <div className="ln-backup-info">
      <VerticalAccordion
        header={
          <BackupInfoHeader scbPath={scbPath} scbUpdatedTime={scbUpdatedTime} />
        }
        onToggleAccordion={onToggleShowBackupInfo}
        show={isShowingBackupInfo}
        className={""}>
        <BackupInfoDetails
          onBackup={onBackup}
          onVerifyBackup={onVerifyBackup}
        />
      </VerticalAccordion>
    </div>
  </>
);
