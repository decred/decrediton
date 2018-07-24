import ChangeLabel from "views/TrezorPage/ChangeLabel";
import ConfigButtons from "views/TrezorPage/ConfigButtons";
import RecoveryButtons from "views/TrezorPage/RecoveryButtons";
import FirmwareUpdate from "views/TrezorPage/FirmwareUpdate";

export default ({
  onTogglePinProtection,
  onTogglePassPhraseProtection,
  onChangeHomeScreen,
  onChangeLabel,
  onWipeDevice,
  onRecoverDevice,
  onInitDevice,
  onUpdateFirmware,
  loading,
}) => (
  <Aux>
    <ConfigButtons {...{ onTogglePinProtection, onTogglePassPhraseProtection,
      onChangeHomeScreen, loading }}  />

    <ChangeLabel {...{ onChangeLabel, loading }} />

    <RecoveryButtons {...{ onWipeDevice, onRecoverDevice, onInitDevice, loading }} />

    <FirmwareUpdate {...{ onUpdateFirmware }} />
  </Aux>
);
