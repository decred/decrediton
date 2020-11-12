import ChangeLabel from "./ChangeLabel";
import ConfigButtons from "./ConfigButtons";
import RecoveryButtons from "./RecoveryButtons";
import FirmwareUpdate from "./FirmwareUpdate";
import "style/Trezor.less";

@autobind
class TrezorConfigSections extends React.Component {
  constructor(props) {
    super(props);
  }

  onTogglePinProtection() {
    this.props.togglePinProtection();
  }

  onTogglePassPhraseProtection() {
    this.props.togglePassPhraseProtection();
  }

  onChangeHomeScreen() {
    this.props.changeToDecredHomeScreen();
  }

  onChangeLabel(newLabel) {
    this.props.changeLabel(newLabel);
  }

  onWipeDevice() {
    this.props.wipeDevice();
  }

  onRecoverDevice() {
    this.props.recoverDevice();
  }

  onUpdateFirmware(path) {
    this.props.updateFirmware(path);
  }

  onInitDevice() {
    this.props.initDevice();
  }

  onBackupDevice() {
    this.props.backupDevice();
  }

  isUpdating() {
   return this.props.isPerformingUpdate;
  }

  render() {
    const {
      onTogglePinProtection,
      onTogglePassPhraseProtection,
      onChangeHomeScreen,
      onChangeLabel,
      onWipeDevice,
      onRecoverDevice,
      onInitDevice,
      onBackupDevice,
      onUpdateFirmware,
      isUpdating,
      loading
    } = this;

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
          {...{ onWipeDevice, onRecoverDevice, onInitDevice, onBackupDevice, loading }}
        />

        <FirmwareUpdate {...{ onUpdateFirmware, loading, isUpdating }} />
      </>
    );
  }
}

export default TrezorConfigSections;
