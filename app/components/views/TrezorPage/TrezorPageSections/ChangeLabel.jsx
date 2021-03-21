import { useState } from "react";
import { FormattedMessage as T } from "react-intl";
import { TextInput } from "inputs";
import { KeyBlueButton } from "buttons";
import TrezorPageAccordion from "../TrezorPageAccordion";

const ChangeLabel = ({ performingOperation, changeLabel }) => {
  const [newLabel, setNewLabel] = useState("");

  const changeLabelClicked = () => {
    changeLabel(newLabel);
  };

  const onNewLabelChanged = (e) => {
    setNewLabel(e.target.value);
  };

  return (
    <TrezorPageAccordion
      label={<T id="trezor.changeLabel.header" m="Change Label" />}>
      <div>
        <T id="trezor.changeLabel.description" m="New Label" />
      </div>
      <div>
        <TextInput value={newLabel} onChange={onNewLabelChanged} />
      </div>
      <div>
        <KeyBlueButton
          onClick={changeLabelClicked}
          disabled={performingOperation}
          loading={performingOperation}>
          <T id="trezor.changeLabel.changeButton" m="Change" />
        </KeyBlueButton>
      </div>
    </TrezorPageAccordion>
  );
};

export default ChangeLabel;
