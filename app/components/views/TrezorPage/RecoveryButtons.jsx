import { useState } from "react";
import { VerticalAccordion } from "shared";
import { FormattedMessage as T } from "react-intl";
import { DangerButton, KeyBlueButton } from "buttons";

import { Documentation } from "shared";

const RecoveryButtons = ({
  loading,
  onWipeDevice,
  onRecoverDevice,
  onInitDevice,
  onBackupDevice
}) => {
  const [show, setShow] = useState(false);

  const onToggleAccordion = () => {
    setShow(!show);
  };

  return (
    <VerticalAccordion
      header={<T id="trezor.recoveryButtons.header" m="Device Recovery" />}
      show={show}
      onToggleAccordion={onToggleAccordion}
      headerClassName="vertical-accordion-header"
      className="trezor-config-accordion trezor-config-regular-buttons">
      <div className="trezor-wipe-warning">
        <Documentation name="TrezorWipeWarning" />
      </div>
      <DangerButton onClick={onWipeDevice} loading={loading} disabled={loading}>
        <T id="trezorPage.wipeDeviceBtn" m="Wipe Device" />
      </DangerButton>

      <DangerButton
        onClick={onRecoverDevice}
        loading={loading}
        disabled={loading}>
        <T id="trezorPage.recoverDeviceBtn" m="Recover Device" />
      </DangerButton>

      <DangerButton onClick={onInitDevice} loading={loading} disabled={loading}>
        <T id="trezorPage.initDeviceBtn" m="Init Device" />
      </DangerButton>

      <KeyBlueButton
        onClick={onBackupDevice}
        loading={loading}
        disabled={loading}>
        <T id="trezorPage.backupDeviceBtn" m="Backup Device" />
      </KeyBlueButton>
    </VerticalAccordion>
  );
};

export default RecoveryButtons;
