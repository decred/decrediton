import { VerticalAccordion } from "shared";
import { FormattedMessage as T } from "react-intl";
import { DangerButton } from "buttons";
import { Documentation } from "shared";

@autobind
class RecoveryButtons extends React.Component {
  constructor(props) {
    super(props);
    this.state = { show: false };
  }

  onToggleAccordion() {
    this.setState({ show: !this.state.show });
  }

  render() {

    const header = (
      <Aux>
        <T id="trezor.recoveryButtons.header" m="Device Recovery" />
      </Aux>
    );

    const { loading, onWipeDevice, onRecoverDevice, onInitDevice } = this.props;

    return (
      <VerticalAccordion
        height={250}
        header={header}
        show={this.state.show}
        onToggleAccordion={this.onToggleAccordion}
        className="trezor-config-accordion trezor-config-regular-buttons"
      >
        <div className="trezor-wipe-warning">
          <Documentation name="TrezorWipeWarning" />
        </div>
        <DangerButton onClick={onWipeDevice} loading={loading} disabled={loading}>
          <T id="trezorPage.wipeDeviceBtn" m="Wipe Device" />
        </DangerButton>

        <DangerButton onClick={onRecoverDevice} loading={loading} disabled={loading}>
          <T id="trezorPage.recoverDeviceBtn" m="Recover Device" />
        </DangerButton>

        <DangerButton onClick={onInitDevice} loading={loading} disabled={loading}>
          <T id="trezorPage.initDeviceBtn" m="Init Device" />
        </DangerButton>
      </VerticalAccordion>

    );
  }
}

export default RecoveryButtons;
