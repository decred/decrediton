import { FormattedMessage as T } from "react-intl";
import { DangerButton, KeyBlueButton } from "buttons";
import { Documentation } from "shared";
import TrezorPageAccordion from "../TrezorPageAccordion";

const RecoveryButtons = ({
  performingOperation,
  wipeDevice,
  recoverDevice,
  initDevice,
  backupDevice
}) => (
  <TrezorPageAccordion
    label={<T id="trezor.recoveryButtons.header" m="Device Recovery" />}>
    <Documentation name="TrezorWipeWarning" />
    <DangerButton
      onClick={wipeDevice}
      loading={performingOperation}
      disabled={performingOperation}>
      <T id="trezorPage.wipeDeviceBtn" m="Wipe Device" />
    </DangerButton>
    <DangerButton
      onClick={recoverDevice}
      loading={performingOperation}
      disabled={performingOperation}>
      <T id="trezorPage.recoverDeviceBtn" m="Recover Device" />
    </DangerButton>
    <DangerButton
      onClick={initDevice}
      loading={performingOperation}
      disabled={performingOperation}>
      <T id="trezorPage.initDeviceBtn" m="Init Device" />
    </DangerButton>
    <KeyBlueButton
      onClick={backupDevice}
      loading={performingOperation}
      disabled={performingOperation}>
      <T id="trezorPage.backupDeviceBtn" m="Backup Device" />
    </KeyBlueButton>
  </TrezorPageAccordion>
);

export default RecoveryButtons;
