import { StandalonePage } from "layout";
import Header from "./Header";
import ChangeLabel from "./ChangeLabel";
import ConfigButtons from "./ConfigButtons";
import RecoveryButtons from "./RecoveryButtons";
import FirmwareUpdate from "./FirmwareUpdate";

export default ({
  onTogglePinProtection, onTogglePassPhraseProtection, onChangeHomeScreen,
  onChangeLabel, onWipeDevice, onRecoverDevice, onInitDevice, onUpdateFirmware,
  loading,
}) => (
  <StandalonePage header={<Header />}>
    <ConfigButtons {...{ onTogglePinProtection, onTogglePassPhraseProtection,
      onChangeHomeScreen, loading }}  />

    <ChangeLabel {...{ onChangeLabel, loading }} />

    <RecoveryButtons {...{ onWipeDevice, onRecoverDevice, onInitDevice, loading }} />

    <FirmwareUpdate {...{ onUpdateFirmware }} />
  </StandalonePage>
);
