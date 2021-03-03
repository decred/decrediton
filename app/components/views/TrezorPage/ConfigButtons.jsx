import { useState } from "react";
import { VerticalAccordion } from "shared";
import { FormattedMessage as T } from "react-intl";
import { KeyBlueButton, DangerButton } from "buttons";

const ConfigButtons = ({
  loading,
  onTogglePinProtection,
  onTogglePassPhraseProtection,
  onChangeHomeScreen
}) => {
  const [show, setShow] = useState(false);

  const onToggleAccordion = () => {
    setShow(!show);
  };

  return (
    <VerticalAccordion
      header={<T id="trezor.configButtons.header" m="Config Trezor" />}
      show={show}
      onToggleAccordion={onToggleAccordion}
      headerClassName="vertical-accordion-header"
      className="trezor-config-accordion trezor-config-regular-buttons">
      <KeyBlueButton
        onClick={onTogglePinProtection}
        loading={loading}
        disabled={loading}>
        <T id="trezorPage.togglePinProtectionBtn" m="Toggle Pin Protection" />
      </KeyBlueButton>

      <DangerButton
        onClick={onTogglePassPhraseProtection}
        loading={loading}
        disabled={loading}>
        <T
          id="trezorPage.togglePassPhraseProtectionBtn"
          m="Toggle Passphrase Protection"
        />
      </DangerButton>

      <KeyBlueButton
        onClick={onChangeHomeScreen}
        loading={loading}
        disabled={loading}>
        <T id="trezorPage.changeHomeScreen" m="Change Home Screen" />
      </KeyBlueButton>
    </VerticalAccordion>
  );
};

export default ConfigButtons;
