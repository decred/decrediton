import { trezor } from "connectors";
import { FormattedMessage as T } from "react-intl";
import Form from "./Form";
import Page from "./Page";
import "style/Trezor.less";

@autobind
class TrezorConfig extends React.Component {

  constructor(props) {
    super(props);
    props.enableTrezor();
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

  onInitDevice() {
    this.props.initDevice();
  }

  onUpdateFirmware(path) {
    this.props.updateFirmware(path);
  }

  render() {
    const { device } = this.props;
    let children;

    if (!device) {
      children = (<div><T id="trezor.getStartedConfig.noDeviceFound" m="No trezor device found. Check the connection and the trezor bridge software."/></div>);
    } else {
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

      children = (
        <Form
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

    return (
      <Page {...this.props} {...this.state}>
        {children}
      </Page>
    );
  }
}

export default trezor(TrezorConfig);
