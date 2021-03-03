import { useState } from "react";
import { VerticalAccordion } from "shared";
import { FormattedMessage as T } from "react-intl";
import { TextInput } from "inputs";
import { KeyBlueButton } from "buttons";

const ChangeLabel = ({
  loading,
  onChangeLabel
}) => {
  const [newLabel, setNewLabel] = useState("");
  const [show, setShow] = useState(false);

  const onChangeLabelClicked = () => {
    onChangeLabel(newLabel);
  };

  const onNewLabelChanged = (e) => {
    setNewLabel(e.target.value);
  };

  const onToggleAccordion = () => {
    setShow(!show);
  };

  return (
    <VerticalAccordion
      header={<T id="trezor.changeLabel.header" m="Change Label" />}
      show={show}
      onToggleAccordion={onToggleAccordion}
      headerClassName="vertical-accordion-header"
      className="trezor-config-accordion">
      <div>
        <T id="trezor.changeLabel.description" m="New Label" />
      </div>
      <div>
        <TextInput
          value={newLabel}
          onChange={onNewLabelChanged}
          className="input-and-unit"
        />
      </div>
      <div>
        <KeyBlueButton
          onClick={onChangeLabelClicked}
          disabled={loading}
          loading={loading}>
          <T id="trezor.changeLabel.changeButton" m="Change" />
        </KeyBlueButton>
      </div>
    </VerticalAccordion>
  );
};

export default ChangeLabel;
