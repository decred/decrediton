import { useState } from "react";
import { VerticalAccordion } from "shared";
import { FormattedMessage as T } from "react-intl";
import { DangerButton } from "buttons";
import { Documentation } from "shared";
import { PathBrowseInput } from "inputs";

const FirmwareUpdate = ({ onUpdateFirmware, loading, isUpdating }) => {
  const [show, setShow] = useState(false);
  const [path, setPath] = useState("");

  const onToggleAccordion = () => {
    setShow(!show);
  };

  const onChangePath = (path) => {
    setPath(path);
  };

  const _onUpdateFirmware = () => {
    onUpdateFirmware(path);
  };

  return (
    <VerticalAccordion
      header={<T id="trezor.firmwareUpdate.header" m="Firmware Update" />}
      show={show}
      onToggleAccordion={onToggleAccordion}
      headerClassName="vertical-accordion-header"
      className="trezor-config-accordion trezor-config-regular-buttons">
      <div className="trezor-wipe-warning">
        <Documentation name="TrezorFirmwareUpdateWarning" />
      </div>

      <p>
        <T id="trezorPage.updateFirmwarePah" m="Path to firmware file" />
      </p>
      <div>
        <PathBrowseInput onChange={onChangePath} value={path} />
      </div>

      <DangerButton
        onClick={_onUpdateFirmware}
        loading={loading || isUpdating()}
        disabled={loading || isUpdating()}>
        <T id="trezorPage.updateFirmwareBtn" m="Update Firmware" />
      </DangerButton>
    </VerticalAccordion>
  );
};

export default FirmwareUpdate;
