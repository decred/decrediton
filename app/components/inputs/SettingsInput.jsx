import Select from "react-select";
import { injectIntl } from "react-intl";

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
  const selectKeyDown = (e) => {
    switch (e.keyCode) {
      case 8:
      case 46:
        e.preventDefault();
        break;
    }
  };

  const onChangeSelect = (value) => {
    onChange?.(value);
  };

  return (
    <div className={className}>
      <Select
        clearable={false}
        multi={false}
        value={value}
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
