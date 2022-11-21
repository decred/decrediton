import { useState } from "react";
import { FormattedMessage as T, defineMessages } from "react-intl";
import { KeyBlueButton } from "buttons";
import { Documentation } from "shared";
import { PathBrowseInput } from "inputs";
import styles from "./FirmwareUpdate.module.css";
import { classNames } from "pi-ui";

const messages = defineMessages({
  pathInputPlaceholder: {
    id: "trezorPage.pathInputPlaceholder",
    defaultMessage: "Select a path..."
  },
  pathInputLabel: {
    id: "trezorPage.updateFirmwarePah",
    defaultMessage: "Path to firmware file"
  }
});

const FirmwareUpdate = ({
  ContainerComponent,
  intl,
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
      <Documentation
        name="TrezorFirmwareUpdateWarning"
        className={styles.documentation}
      />

      <div className={classNames("flex-row", styles.pathInputWrapper)}>
        <PathBrowseInput
          newBiggerFontStyle
          label={intl.formatMessage(messages.pathInputLabel)}
          placeholder={intl.formatMessage(messages.pathInputPlaceholder)}
          className={styles.pathBrowseInput}
          id="fileInput"
          onChange={onChangePath}
          value={path}
          disabled={performingOperation || isPerformingUpdate}
        />
        <KeyBlueButton
          className={styles.updateFirmwareButton}
          onClick={_updateFirmware}
          loading={performingOperation || isPerformingUpdate}
          disabled={performingOperation || isPerformingUpdate}>
          <T id="trezorPage.updateFirmwareBtn" m="Update Firmware" />
        </KeyBlueButton>
      </div>
    </ContainerComponent>
  );
};

export default FirmwareUpdate;
