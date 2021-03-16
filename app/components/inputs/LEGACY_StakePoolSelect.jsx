import { Creatable } from "react-select";
import Select from "react-select";
import { FormattedMessage as T, defineMessages } from "react-intl";
import { useIntl } from "react-intl";
import { useState } from "react";

const messages = defineMessages({
  placeholder: {
    id: "selectStakepool.placeholder.legacy",
    defaultMessage: "Select VSP..."
  }
});

const StakePoolSelect = ({
  onChange,
  addCustomStakePool,
  creatable,
  options: optionsProp,
  ...props
}) => {
  const intl = useIntl();
  const [lastInput, setLastInput] = useState("");

  const onChangeLocal = (value) => {
    if (!value || !value.Host) return;

    if (!onChange) return;

    if (value.newOption) {
      if (!addCustomStakePool) return;

      const formattedHost = value.Host.replace(/\/$/, "");
      addCustomStakePool(formattedHost).then((poolInfo) => {
        if (!poolInfo) return;
        const opt = {
          ...poolInfo,
          label: poolInfo.Host,
          value: poolInfo,
          isVersionValid: true
        };
        onChange(opt);
      });
      return;
    }
    onChange(value);
  };

  const addStakePoolLabel = () => {
    return (
      <T
        id="stakePoolSelect.addNewPrompt"
        m="Add VSP {host}"
        values={{ host: lastInput }}
      />
    );
  };

  const newOptionCreator = () => {
    return {
      value: { Host: lastInput },
      label: lastInput,
      Host: lastInput,
      newOption: true
    };
  };

  const onInputChange = (input) => {
    setLastInput(input);
  };

  const getOptions = () => {
    if (!creatable || lastInput) return optionsProp;
    const options = [...optionsProp];
    options.unshift({
      label: (
        <T id="stakePoolSelect.addNewPromptEmpty" m="Type to add new VSP" />
      ),
      Host: null
    });
    return options;
  };

  const isValidNewOption = () => {
    return true;
  };

  const Component = creatable ? Creatable : Select;

  return (
    <Component
      {...props}
      options={getOptions()}
      placeholder={intl.formatMessage(messages.placeholder)}
      promptTextCreator={addStakePoolLabel}
      onChange={onChangeLocal}
      newOptionCreator={newOptionCreator}
      onInputChange={onInputChange}
      isValidNewOption={isValidNewOption}
    />
  );
};

StakePoolSelect.defaultProps = {
  clearable: false
};

export default StakePoolSelect;
