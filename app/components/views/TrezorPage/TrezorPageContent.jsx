import { useTrezorPage } from "./hooks";
import { FormattedMessage as T } from "react-intl";
import {
  ChangeLabel,
  SecuritySection,
  FirmwareUpdate,
  DeviceSetupSection
} from "./TrezorPageSections";
import { InvisibleButton } from "buttons";
import styles from "./TrezorPageContent.module.css";

const NoDevicePage = ({ onConnect }) => (
  <>
    <div>
      <T
        id="trezor.noDevice.message"
        m="No Trezor device detected. Connect the device and check if Trezor bridge is installed and running."
      />
    </div>
    <div>
      <InvisibleButton onClick={onConnect}>
        <T id="trezor.noDevice.btnConnect" m="Connect to Trezor" />
      </InvisibleButton>
    </div>
  </>
);

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
    <NoDevicePage onConnect={connect} />
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
