import { FormattedMessage as T } from "react-intl";
import { KeyBlueButton, DangerButton } from "buttons";
import TrezorPageAccordion from "../TrezorPageAccordion";

const ConfigButtons = ({
  performingOperation,
  togglePinProtection,
  togglePassPhraseProtection,
  changeToDecredHomeScreen
}) => (
  <TrezorPageAccordion
    label={<T id="trezor.configButtons.header" m="Config Trezor" />}>
    <KeyBlueButton
      onClick={togglePinProtection}
      loading={performingOperation}
      disabled={performingOperation}>
      <T id="trezorPage.togglePinProtectionBtn" m="Toggle Pin Protection" />
    </KeyBlueButton>
    <DangerButton
      onClick={togglePassPhraseProtection}
      loading={performingOperation}
      disabled={performingOperation}>
      <T
        id="trezorPage.togglePassPhraseProtectionBtn"
        m="Toggle Passphrase Protection"
      />
    </DangerButton>
    <KeyBlueButton
      onClick={changeToDecredHomeScreen}
      loading={performingOperation}
      disabled={performingOperation}>
      <T id="trezorPage.changeHomeScreen" m="Change Home Screen" />
    </KeyBlueButton>
  </TrezorPageAccordion>
);

export default ConfigButtons;
