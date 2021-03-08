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
    togglePinProtection,
    togglePassPhraseProtection,
    changeToDecredHomeScreen,
    changeLabel,
    wipeDevice,
    recoverDevice,
    initDevice,
    backupDevice,
    updateFirmware
  } = useTrezorPage();

  return !device ? (
    <NoDevicePage onConnect={connect} />
  ) : (
    <>
      <ConfigButtons
        {...{
          togglePinProtection,
          togglePassPhraseProtection,
          changeToDecredHomeScreen,
          performingOperation
        }}
      />
      <ChangeLabel {...{ changeLabel, performingOperation }} />
      <RecoveryButtons
        {...{
          wipeDevice,
          recoverDevice,
          initDevice,
          backupDevice,
          performingOperation
        }}
      />
      <FirmwareUpdate
        {...{ updateFirmware, performingOperation, isPerformingUpdate }}
      />
    </>
  );
};

export default TrezorPageContent;
