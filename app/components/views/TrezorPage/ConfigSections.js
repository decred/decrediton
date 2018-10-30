import ChangeLabel from "./ChangeLabel";
import ConfigButtons from "./ConfigButtons";
import RecoveryButtons from "./RecoveryButtons";
import FirmwareUpdate from "./FirmwareUpdate";

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

  onReloadDeviceList() {
    this.props.reloadDeviceList();
  }

  onClearDeviceSession() {
    this.props.clearDeviceSession();
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
      onUpdateFirmware,
      onClearDeviceSession,
      loading,
    } = this;

    return (
      <>
        <ConfigButtons {...{ onTogglePinProtection, onTogglePassPhraseProtection,
          onChangeHomeScreen, onClearDeviceSession, loading }}  />

        <ChangeLabel {...{ onChangeLabel, loading }} />

        <RecoveryButtons {...{ onWipeDevice, onRecoverDevice, onInitDevice, loading }} />

        <FirmwareUpdate {...{ onUpdateFirmware, loading }} />
      </>
    );
  }

}

export default TrezorConfigSections;
