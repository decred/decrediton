import { FormattedMessage as T } from "react-intl";
import styles from "./DeviceSetupSection.module.css";
import DeviceSetupRow from "./DeviceSetupRow";
import DeviceSetupDocumentation from "./DeviceSetupDocumentation";

const DeviceSetupSection = ({
  ContainerComponent,
  performingOperation,
  wipeDevice,
  recoverDevice,
  initDevice,
  backupDevice
}) => (
  <ContainerComponent
    label={<T id="trezor.deviceSetup.header" m="Device Setup and Recovery" />}>
    <DeviceSetupDocumentation name="TrezorDeviceSetup" />

    <div className={styles.deviceSetupRows}>
      <DeviceSetupRow
        className={styles.row}
        title={<T id="trezor.deviceSetup.wipeDevice" m="Wipe Device" />}
        docName="TrezorWipeDevice"
        onClick={wipeDevice}
        performingOperation={performingOperation}
        buttonLabel={<T id="trezorPage.wipeDeviceBtn" m="Wipe Device" />}
      />

      <DeviceSetupRow
        className={styles.row}
        title={
          <T
            id="trezor.deviceSetup.recoverDevice"
            m="Recover Device (from Trezor Backup)"
          />
        }
        docName="TrezorRecoverDevice"
        onClick={recoverDevice}
        performingOperation={performingOperation}
        buttonLabel={<T id="trezorPage.recoverDeviceBtn" m="Recover Device" />}
      />

      <DeviceSetupRow
        className={styles.row}
        title={
          <T
            id="trezor.deviceSetup.initDevice"
            m="Initalize Device (Create New Wallet)"
          />
        }
        docName="TrezorInitDevice"
        onClick={initDevice}
        performingOperation={performingOperation}
        buttonLabel={<T id="trezorPage.initDeviceBtn" m="Initialize Device" />}
      />

      <DeviceSetupRow
        className={styles.row}
        title={<T id="trezor.deviceSetup.backupDevice" m="Backup Device" />}
        docName="TrezorBackupDevice"
        onClick={backupDevice}
        performingOperation={performingOperation}
        buttonLabel={<T id="trezorPage.backupDeviceBtn" m="Backup Device" />}
      />
    </div>
  </ContainerComponent>
);

export default DeviceSetupSection;
