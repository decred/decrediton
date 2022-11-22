import { CopyableText, classNames } from "pi-ui";
import { FormattedMessage as T } from "react-intl";
import { DescriptionHeader } from "layout";
import { Subtitle } from "shared";
import { InfoDocModalButton } from "buttons";
import BackupInfoHeader from "./BackupInfoHeader/BackupInfoHeader";
import BackupInfoDetails from "./BackupInfoDetails/BackupInfoDetails";
import styles from "./AdvancedTab.module.css";
import { useAdvancedTab } from "./hooks";
import BalancesHeader from "../BalancesHeader";
import Network from "./Network";
import Watchtowers from "./Watchtowers";

export const AdvancedTabHeader = () => (
  <DescriptionHeader
    description={
      <>
        <T
          id="ln.advancedTab.description.header"
          m="On-chain balance and actions of the LN Wallet"
        />
        <BalancesHeader />
      </>
    }
  />
);

const AdvancedTab = () => {
  const { info, scbPath, scbUpdatedTime, onBackup, onVerifyBackup } =
    useAdvancedTab();

  const { alias, identityPubkey } = info;

  return (
    <div className={styles.container}>
      <Subtitle title={<T id="ln.advancedTab.infos" m="Infos" />} />
      <div className={styles.nodeInfos}>
        <T id="ln.advancedTab.nodeInfos.alias" m="Node Alias" />
        <div className={styles.nodeAlias}>{alias}</div>
      </div>
      <div className={classNames(styles.nodeInfos, styles.lastItem)}>
        <T id="ln.advancedTab.nodeInfos.ID" m="Node ID" />
        <CopyableText id="copyablePubkey" className={styles.copyableText}>
          {identityPubkey}
        </CopyableText>
      </div>
      <Subtitle
        title={<T id="ln.advancedTab.backup" m="Backup" />}
        className={styles.backupSubtitle}>
        <div className={styles.backupInfoBtn}>
          <InfoDocModalButton document="LNBackupInfo" double draggable />
        </div>
      </Subtitle>
      <div className={styles.backupPanel}>
        <BackupInfoHeader scbPath={scbPath} scbUpdatedTime={scbUpdatedTime} />
        <BackupInfoDetails
          onBackup={onBackup}
          onVerifyBackup={onVerifyBackup}
        />
      </div>
      <Subtitle
        title={
          <T id="ln.watchtowersTab.addWatchtowerHeader" m="Add Watchtower" />
        }
      />
      <Watchtowers />
      <Subtitle
        title={<T id="ln.advancedTab.network" m="Network" />}
        className={styles.networkTitle}
      />
      <Network />
    </div>
  );
};

export default AdvancedTab;
