import { useState } from "react";
import { FormattedMessage as T } from "react-intl";
import { DangerButton } from "buttons";
import { Documentation } from "shared";
import { PathBrowseInput } from "inputs";

const FirmwareUpdate = ({
  ContainerComponent,
  updateFirmware,
  performingOperation,
  isPerformingUpdate
}) => {
  const [path, setPath] = useState("");

  const onChangePath = (path) => {
    setPath(path);
  };

  const _updateFirmware = () => {
    updateFirmware(path);
  };

  return (
    <ContainerComponent
      label={<T id="trezor.firmwareUpdate.header" m="Firmware Update" />}>
      <Documentation name="TrezorFirmwareUpdateWarning" />
      <p>
        <T id="trezorPage.updateFirmwarePah" m="Path to firmware file" />
      </p>
      <div>
        <PathBrowseInput id="fileInput" onChange={onChangePath} value={path} />
      </div>
      <DangerButton
        onClick={_updateFirmware}
        loading={performingOperation || isPerformingUpdate}
        disabled={performingOperation || isPerformingUpdate}>
        <T id="trezorPage.updateFirmwareBtn" m="Update Firmware" />
      </DangerButton>
    </ContainerComponent>
  );
};

export default FirmwareUpdate;
