import { Select } from "inputs";
import { isString } from "lodash";

const SettingsInput = ({
  value,
  options,
  valueKey,
  labelKey,
  ariaLabelledBy,
  className,
  ...props
}) => {
  const normalizeOption = (option) => {
    if (!option) return null;
    return {
      ...option,
      value: option[valueKey],
      label: option[labelKey]
    };
  };

  const normalizedValue = isString(value)
    ? normalizeOption(
        options.find((option) => option[valueKey]?.toString() === value)
      )
    : value;

  const normalizedOptions = options?.map((option) => normalizeOption(option));

  return (
    <div className={className}>
      <Select
        {...{
          value: normalizedValue,
          options: normalizedOptions,
          ariaLabelledBy,
          ...props
        }}
      />
    </div>
  );
};

export default SettingsInput;
