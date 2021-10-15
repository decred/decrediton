import { useState } from "react";
import { FormattedMessage as T } from "react-intl";
import { TextInput } from "inputs";
import { KeyBlueButton } from "buttons";

const ChangeLabel = ({
  ContainerComponent,
  performingOperation,
  changeLabel,
  changeToDecredHomeScreen
}) => {
  const [newLabel, setNewLabel] = useState("");

  const changeLabelClicked = () => {
    changeLabel(newLabel);
  };

  const onNewLabelChanged = (e) => {
    setNewLabel(e.target.value);
  };

  return (
    <ContainerComponent
      label={<T id="trezor.changeLabel.header" m="Change Label" />}>
      <div>
        <T id="trezor.changeLabel.description" m="New Label" />
      </div>
      <div>
        <TextInput
          id="newLabelInput"
          value={newLabel}
          onChange={onNewLabelChanged}
        />
      </div>
      <div>
        <KeyBlueButton
          onClick={changeLabelClicked}
          disabled={performingOperation}
          loading={performingOperation}>
          <T id="trezor.changeLabel.changeButton" m="Change" />
        </KeyBlueButton>
        <KeyBlueButton
          onClick={changeToDecredHomeScreen}
          loading={performingOperation}
          disabled={performingOperation}>
          <T id="trezorPage.changeHomeScreen" m="Change Home Screen" />
        </KeyBlueButton>
      </div>
    </ContainerComponent>
  );
};

export default ChangeLabel;
