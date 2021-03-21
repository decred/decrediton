import { CopyableText, classNames } from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import { DescriptionHeader } from "layout";
import { Subtitle } from "shared";
import { InfoDocModalButton } from "buttons";
import { ConfirmModal } from "modals";
import BalanceHeader from "./BalanceHeader/BalanceHeader";
import BackupInfoHeader from "./BackupInfoHeader/BackupInfoHeader";
import BackupInfoDetails from "./BackupInfoDetails/BackupInfoDetails";
import styles from "./WalletTab.module.css";
import { useWalletTab } from "./hooks";

export const WalletTabHeader = () => (
  <DescriptionHeader
    description={
      <T
        id="ln.description.wallet"
        m="On-chain balance and actions of the LN Wallet"
      />
    }
  />
);

const WalletTab = () => {
  const {
    walletBalances,
    info,
    scbPath,
    scbUpdatedTime,
    confirmFileOverwrite,
    onBackup,
    onVerifyBackup,
    onCancelFileOverwrite,
    onConfirmFileOverwrite
  } = useWalletTab();

  const { confirmedBalance, unconfirmedBalance, totalBalance } = walletBalances;

  const { alias, identityPubkey } = info;

  return (
    <>
      <Subtitle title={<T id="ln.walletTab.balances" m="Balances" />} />
      <BalanceHeader
        confirmedBalance={confirmedBalance}
        unconfirmedBalance={unconfirmedBalance}
        totalBalance={totalBalance}
      />
      <Subtitle title={<T id="ln.walletTab.infos" m="Infos" />} />
      <div className={styles.nodeInfos}>
        <T id="ln.walletTab.nodeInfos.alias" m="Node Alias" />
        <div className={styles.nodeAlias}>{alias}</div>
      </div>
      <div className={classNames(styles.nodeInfos, styles.lastItem)}>
        <T id="ln.walletTab.nodeInfos.ID" m="Node ID" />
        <CopyableText id="copyablePubkey" className={styles.copyableText}>
          {identityPubkey}
        </CopyableText>
      </div>
      <Subtitle
        title={<T id="ln.walletTab.backup" m="Backup" />}
        className={styles.backupSubtitle}>
        <div className={styles.backupInfoBtn}>
          <InfoDocModalButton
            document="LNBackupInfo"
            modalClassName="info-modal-fields"
            double
            draggable
          />
        </div>
      </Subtitle>
      <div className={styles.backupPanel}>
        <BackupInfoHeader scbPath={scbPath} scbUpdatedTime={scbUpdatedTime} />
        <BackupInfoDetails
          onBackup={onBackup}
          onVerifyBackup={onVerifyBackup}
        />
      </div>
      <ConfirmModal
        show={!!confirmFileOverwrite}
        onCancelModal={onCancelFileOverwrite}
        onSubmit={onConfirmFileOverwrite}
        modalTitle={
          <T
            id="ln.confirmBackupOverwrite.title"
            m="Confirm Backup Overwrite"
          />
        }
        modalContent={
          <>
            <T
              id="ln.confirmBackupOverwrite.content"
              m="Really overwrite the backup file {file}? The existing backup data will be LOST."
              values={{
                file: <span className="mono">{confirmFileOverwrite}</span>
              }}
            />
          </>
        }
      />
    </>
  );
};

export default WalletTab;
