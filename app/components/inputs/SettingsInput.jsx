import Select from "react-select";
import { injectIntl } from "react-intl";
import { useState } from "react";

const SettingsInput = ({
  className,
  value,
  valueKey,
  labelKey,
  options,
  disabled,
  ariaLabelledBy,
  onChange
}) => {
  const [inputValue, setInputValue] = useState(value ?? null);

  const selectKeyDown = (e) => {
    switch (e.keyCode) {
      case 8:
      case 46:
        e.preventDefault();
        break;
    }
  };

  const onChangeSelect = (value) => {
    setInputValue(value);
    onChange?.(value);
  };

  return (
    <div className={className}>
      <Select
        clearable={false}
        multi={false}
        value={inputValue}
        valueKey={valueKey}
        labelKey={labelKey}
        options={options}
        onChange={onChangeSelect}
        onInputKeyDown={selectKeyDown}
        disabled={disabled}
        aria-labelledby={ariaLabelledBy}
      />
    </div>
  );
};

SettingsInput.propTypes = {
  className: PropTypes.string
};

export default injectIntl(SettingsInput);
