import { useState } from "react";
import { FormattedMessage as T, defineMessages } from "react-intl";
import { TextInput } from "inputs";
import { KeyBlueButton, SmallButton } from "buttons";
import styles from "./ChangeLabel.module.css";
import { classNames } from "pi-ui";

const messages = defineMessages({
  changeLabelPlaceholder: {
    id: "trezor.changeLabel.changeLabelPlaceholder",
    defaultMessage: "New Label"
  },
  changeLabelLabel: {
    id: "trezor.changeLabel.description",
    defaultMessage: "Trezor Device Label"
  }
});

const ChangeLabel = ({
  ContainerComponent,
  deviceLabel,
  intl,
  performingOperation,
  changeLabel,
  changeToDecredHomeScreen
}) => {
  const [newLabel, setNewLabel] = useState(deviceLabel);

  const changeLabelClicked = () => {
    changeLabel(newLabel);
  };

  const onNewLabelChanged = (e) => {
    setNewLabel(e.target.value);
  };

  return (
    <ContainerComponent
      label={<T id="trezor.changeLabel.header" m="Label and Homescreen" />}>
      <div className={classNames("flex-row", "align-center")}>
        <SmallButton
          id="changeToDecredHomeScreen"
          className={classNames(
            styles.changeToDecredHomeScreen,
            performingOperation && styles.loading
          )}
          loading={performingOperation}
          onClick={changeToDecredHomeScreen}
          disabled={performingOperation}
        />
        <label htmlFor="changeToDecredHomeScreen" className={styles.label}>
          <T
            id="trezor.changeLabel.changeToDecredHomeScreen"
            m="Use Decred Symbol on homescreen"
          />
        </label>
      </div>
      <div className={classNames("flex-row", styles.changeLabelWrapper)}>
        <TextInput
          newBiggerFontStyle
          id="newLabelInput"
          value={newLabel}
          onChange={onNewLabelChanged}
          label={intl.formatMessage(messages.changeLabelLabel)}
          placeholder={intl.formatMessage(messages.changeLabelPlaceholder)}
          className={styles.newLabelInput}
          disabled={performingOperation}
        />
        <KeyBlueButton
          className={styles.newLabelButton}
          onClick={changeLabelClicked}
          disabled={performingOperation || !newLabel || newLabel === ""}
          loading={performingOperation}>
          <T id="trezor.changeLabel.changeButton" m="Change Label" />
        </KeyBlueButton>
      </div>
    </ContainerComponent>
  );
};

export default ChangeLabel;
