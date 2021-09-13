import { useTrezorPage } from "./hooks";
import { FormattedMessage as T } from "react-intl";
import {
  ChangeLabel,
  ConfigButtons,
  FirmwareUpdate,
  RecoveryButtons
} from "./TrezorPageSections";
import { InvisibleButton } from "buttons";

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

const TrezorPageContent = () => {
  const {
    isPerformingUpdate,
    performingOperation,
    device,
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
    <>
      <ConfigButtons
        {...{
          togglePinProtection,
          togglePassPhraseProtection,
          togglePassphraseOnDevice,
          changeToDecredHomeScreen,
          performingOperation: loading
        }}
      />
      <ChangeLabel {...{ changeLabel, performingOperation: loading }} />
      <RecoveryButtons
        {...{
          wipeDevice,
          recoverDevice,
          initDevice,
          backupDevice,
          performingOperation: loading
        }}
      />
      <FirmwareUpdate
        {...{
          updateFirmware,
          performingOperation: loading,
          isPerformingUpdate
        }}
      />
    </>
  );
};

export default TrezorPageContent;
