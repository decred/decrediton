import { trezor } from "connectors";
import Page from "./Page";
import NoDevicePage from "./NoDevicePage";
import "style/Trezor.less";

@autobind
class TrezorPage extends React.Component {

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

  render() {
    const { device } = this.props;
    if (!device) return <NoDevicePage />;

    const loading = this.props.performingOperation;

    const {
      onTogglePinProtection,
      onTogglePassPhraseProtection,
      onChangeHomeScreen,
      onChangeLabel,
      onWipeDevice,
      onRecoverDevice,
      onInitDevice,
      onUpdateFirmware,
    } = this;

    return (
      <Page
        {...this.props}
        {...this.state}
        {...{
          loading,
          onTogglePinProtection,
          onTogglePassPhraseProtection,
          onChangeHomeScreen,
          onChangeLabel,
          onWipeDevice,
          onRecoverDevice,
          onInitDevice,
          onUpdateFirmware,
        }}
      />
    );
  }
}

export default trezor(TrezorPage);
