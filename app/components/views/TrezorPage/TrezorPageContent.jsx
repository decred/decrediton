import { useTrezorPage } from "./hooks";
import {
  ChangeLabel,
  SecuritySection,
  FirmwareUpdate,
  DeviceSetupSection
} from "./TrezorPageSections";
import styles from "./TrezorPageContent.module.css";
import NoDevicePage from "./NoDevicePage";

const TrezorPageContent = ({ ContainerComponent }) => {
  const {
    isPerformingUpdate,
    performingOperation,
    device,
    performingTogglePinProtection,
    performingTogglePassphraseProtection,
    performingTogglePassphraseOnDeviceProtection,
    pinProtection,
    passphraseProtection,
    passphraseOnDeviceProtection,
    deviceLabel,
    intl,
    connect,
    performingRecoverDevice,
    togglePinProtection,
    togglePassPhraseProtection,
    togglePassphraseOnDevice,
    changeToDecredHomeScreen,
    changeLabel,
    wipeDevice,
    recoverDevice,
    initDevice,
    backupDevice,
    updateFirmware
  } = useTrezorPage();

  const loading = performingOperation || performingRecoverDevice;

  return !device ? (
    <div className={styles.container}>
      <NoDevicePage onConnect={connect} />
    </div>
  ) : (
    <div className={styles.container}>
      <SecuritySection
        {...{
          ContainerComponent,
          performingTogglePinProtection,
          performingTogglePassphraseProtection,
          performingTogglePassphraseOnDeviceProtection,
          pinProtection,
          passphraseProtection,
          passphraseOnDeviceProtection,
          togglePinProtection,
          togglePassPhraseProtection,
          togglePassphraseOnDevice,
          changeToDecredHomeScreen,
          performingOperation: loading
        }}
      />
      <ChangeLabel
        {...{
          ContainerComponent,
          deviceLabel,
          intl,
          changeLabel,
          changeToDecredHomeScreen,
          performingOperation: loading
        }}
      />
      <DeviceSetupSection
        {...{
          ContainerComponent,
          wipeDevice,
          recoverDevice,
          initDevice,
          backupDevice,
          performingOperation: loading
        }}
      />
      <FirmwareUpdate
        {...{
          ContainerComponent,
          intl,
          updateFirmware,
          performingOperation: loading,
          isPerformingUpdate
        }}
      />
    </div>
  );
};

export default TrezorPageContent;
