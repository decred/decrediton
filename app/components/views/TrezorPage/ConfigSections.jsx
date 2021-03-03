import ChangeLabel from "./ChangeLabel";
import ConfigButtons from "./ConfigButtons";
import RecoveryButtons from "./RecoveryButtons";
import FirmwareUpdate from "./FirmwareUpdate";
import "style/Trezor.less";

const TrezorConfigSections = ({
  togglePinProtection,
  togglePassPhraseProtection,
  changeToDecredHomeScreen,
  changeLabel,
  wipeDevice,
  recoverDevice,
  updateFirmware,
  initDevice,
  backupDevice,
  isPerformingUpdate,
  loading
}) => {
  const onTogglePinProtection = () => {
    togglePinProtection();
  };

  const onTogglePassPhraseProtection = () => {
    togglePassPhraseProtection();
  };

  const onChangeHomeScreen = () => {
    changeToDecredHomeScreen();
  };

  const onChangeLabel = (newLabel) => {
    changeLabel(newLabel);
  };

  const onWipeDevice = () => {
    wipeDevice();
  };

  const onRecoverDevice = () => {
    recoverDevice();
  };

  const onUpdateFirmware = (path) => {
    updateFirmware(path);
  };

  const onInitDevice = () => {
    initDevice();
  };

  const onBackupDevice = () => {
    backupDevice();
  };

  const isUpdating = () =>
    isPerformingUpdate;

  return (
    <>
      <ConfigButtons
        {...{
          onTogglePinProtection,
          onTogglePassPhraseProtection,
          onChangeHomeScreen,
          loading
        }}
      />

      <ChangeLabel {...{ onChangeLabel, loading }} />

      <RecoveryButtons
        {...{
          onWipeDevice,
          onRecoverDevice,
          onInitDevice,
          onBackupDevice,
          loading
        }}
      />

      <FirmwareUpdate {...{ onUpdateFirmware, loading, isUpdating }} />
    </>
  );
};

export default TrezorConfigSections;
