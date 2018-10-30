import { trezor } from "connectors";
import { FormattedMessage as T } from "react-intl";
import ConfigSections from "views/TrezorPage/ConfigSections";
import Page from "./Page";
import { InvisibleButton } from "buttons";
import "style/Trezor.less";

@autobind
class TrezorConfig extends React.Component {

  constructor(props) {
    super(props);
    props.enableTrezor();
  }

  renderNoDevice() {
    return <>
      <div><T id="trezor.getStartedConfig.noDeviceFound" m="No trezor device found. Check the connection and the trezor bridge software."/></div>
      <div>
        <InvisibleButton onClick={this.props.reloadDeviceList}>
          <T id="trezor.getStartedConfig.btnReloadDeviceList" m="Reload Device List"/>
        </InvisibleButton>
      </div>
    </>;
  }

  render() {
    const { device } = this.props;
    let children;

    if (!device) {
      children = this.renderNoDevice();
    } else {
      const loading = this.props.performingOperation;
      children = <ConfigSections device={device} loading={loading} { ...this.props } />;
    }

    return (
      <Page {...this.props} {...this.state}>
        {children}
      </Page>
    );
  }
}

export default trezor(TrezorConfig);
