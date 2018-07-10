import { VerticalAccordion } from "shared";
import { FormattedMessage as T } from "react-intl";
import { KeyBlueButton } from "buttons";

@autobind
class ConfigButtons extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {

    const ConfigButtonsHeader = (
      <Aux>
        <T id="trezor.configButtons.header" m="Config Trezor" />
      </Aux>
    );

    const { loading, onTogglePinProtection, onTogglePassPhraseProtection,
      onChangeHomeScreen } = this.props;

    return (
      <VerticalAccordion
        height={75}
        header={ConfigButtonsHeader}
        className="trezor-config-accordion trezor-config-regular-buttons"
      >
        <KeyBlueButton onClick={onTogglePinProtection} loading={loading} disabled={loading}>
          <T id="trezorPage.togglePinProtectionBtn" m="Toggle Pin Protection" />
        </KeyBlueButton>

        <KeyBlueButton onClick={onTogglePassPhraseProtection} loading={loading} disabled={loading}>
          <T id="trezorPage.togglePassPhraseProtectionBtn" m="Toggle Passphrase Protection" />
        </KeyBlueButton>

        <KeyBlueButton onClick={onChangeHomeScreen} loading={loading} disabled={loading}>
          <T id="trezorPage.changeHomeScreen" m="Change Home Screen" />
        </KeyBlueButton>
      </VerticalAccordion>

    );
  }
}

export default ConfigButtons;
