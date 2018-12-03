import { VerticalAccordion } from "shared";
import { FormattedMessage as T } from "react-intl";
import { DangerButton } from "buttons";
import { Documentation } from "shared";
import { PathBrowseInput } from "inputs";

@autobind
class FirmwareUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = { path: "", show: false };
  }

  onChangePath(path) {
    this.setState({ path });
  }

  onUpdateFirmware() {
    this.props.onUpdateFirmware(this.state.path);
  }

  onToggleAccordion() {
    this.setState({ show: !this.state.show });
  }

  render() {

    const header = (
      <Aux>
        <T id="trezor.firmwareUpdate.header" m="Firmware Update" />
      </Aux>
    );

    const { loading } = this.props;

    return (
      <VerticalAccordion
        height={250}
        header={header}
        show={this.state.show}
        onToggleAccordion={this.onToggleAccordion}
        className="trezor-config-accordion trezor-config-regular-buttons"
      >
        <div className="trezor-wipe-warning">
          <Documentation name="TrezorFirmwareUpdateWarning" />
        </div>

        <p><T id="trezorPage.updateFirmwarePah" m="Path to firmware file" /></p>
        <div><PathBrowseInput onChange={this.onChangePath} value={this.state.path} /></div>

        <DangerButton onClick={this.onUpdateFirmware} loading={loading} disabled={loading}>
          <T id="trezorPage.updateFirmwareBtn" m="Update Firmware" />
        </DangerButton>
      </VerticalAccordion>

    );
  }
}

export default FirmwareUpdate;
