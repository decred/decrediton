import { CopyableText, classNames } from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import { Subtitle, Balance, VerticalAccordion } from "shared";
import { InfoDocModalButton, InvisibleButton } from "buttons";
import { ConfirmModal } from "modals";
import styles from "./WalletTab.module.css";

const BalanceHeader = ({
  confirmedBalance,
  unconfirmedBalance,
  totalBalance
}) => (
    <div className={styles.balanceHeader}>
      <div className={`${styles.balanceTile} ${confirmedBalance === 0 ?
        styles.zeroFunds
        : styles.hasFunds}
        `}>
        <div className={styles.balanceValue}>
          <Balance amount={confirmedBalance} />
        </div>
        <T
          id="ln.walletTab.balance.confirmed"
          m="Confirmed balance"
        />
      </div>
      <div className={classNames(styles.balanceTile, styles.unconfirmed)}>
        <div className={styles.balanceValue}>
          <Balance amount={unconfirmedBalance} />
        </div>
        <T
          id="ln.walletTab.balance.unconfirmed"
          m="Unconfirmed balance"
        />
      </div>
      <div className={classNames(styles.balanceTile,
        totalBalance === 0 ?
          styles.zeroFunds
          : null)
      }>
        <div className={styles.balanceValue}>
          <Balance amount={totalBalance} />
        </div>
        <T
          id="ln.walletTab.balance.totalBalance"
          m="Total balance"
        />
      </div>
    </div>
  );

const BackupInfoHeader = ({ scbPath, scbUpdatedTime }) => (
  <div className={styles.backupInfoHeader}>
    <div className={styles.backupIcon} />
    <div className={styles.backupInfo}>
      <div className={styles.backupInfoText}>
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
  </div>
);

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

export default ({
  alias,
  identityPubkey,
  confirmedBalance,
  totalBalance,
  unconfirmedBalance,
  isShowingBackupInfo,
  scbPath,
  scbUpdatedTime,
  confirmFileOverwrite,
  onToggleShowBackupInfo,
  onBackup,
  onVerifyBackup,
  onCancelFileOverwrite,
  onConfirmFileOverwrite
}) => (
    <>
      <Subtitle title={
        <T id="ln.walletTab.balances" m="Balances" />
      } />
      <BalanceHeader
        confirmedBalance={confirmedBalance}
        unconfirmedBalance={unconfirmedBalance}
        totalBalance={totalBalance}
      />
      <Subtitle title={
        <T id="ln.walletTab.infos" m="Infos" />
      } />
      <div className={styles.nodeInfos}>
        <T id="ln.walletTab.nodeInfos.alias" m="Node Alias" />
        <div className={styles.nodeAlias}>
          {alias}
        </div>
      </div>
      <div className={classNames(styles.nodeInfos, styles.lastItem)}>
        <T id="ln.walletTab.nodeInfos.ID" m="Node ID" />
        <CopyableText id="copyablePubkey" className={styles.copyableText}>
          {identityPubkey}
        </CopyableText>
      </div>

      <Subtitle title={
        <T id="ln.walletTab.backup" m="Backup" />
      } className={styles.backupSubtitle}>
        <div className={styles.backupInfoBtn}>
          <InfoDocModalButton
            document="LNBackupInfo"
            modalClassName="info-modal-fields"
            double
            draggable
          />
        </div>
      </Subtitle>
      <div>
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

      <ConfirmModal
        show={!!confirmFileOverwrite}
        onCancelModal={onCancelFileOverwrite}
        onSubmit={onConfirmFileOverwrite}
        modalTitle={<T id="ln.confirmBackupOverwrite.title" m="Confirm Backup Overwrite" />}
        modalContent={
          <>
            <T
              id="ln.confirmBackupOverwrite.content"
              m="Really overwrite the backup file {file}? The existing backup data will be LOST."
              values={{ file: <span className="mono">{confirmFileOverwrite}</span> }}
            />
          </>
        }
      >

      </ConfirmModal>
    </>
  );
