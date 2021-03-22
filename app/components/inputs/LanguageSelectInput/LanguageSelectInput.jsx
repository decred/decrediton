import { useState } from "react";
import Select from "react-select";
import { injectIntl } from "react-intl";
import { classNames } from "pi-ui";
import { useMountEffect } from "hooks";
import styles from "./LanguageSelectInput.module.css";

const LanguageSelectInput = ({
  className,
  value,
  onChange,
  valueKey,
  labelKey,
  options,
  ariaLabelledBy
}) => {
  const [stateValue, setValue] = useState(null);

  useMountEffect(() => {
    if (value) {
      setValue(value);
    }
  });

  const selectKeyDown = (e) => {
    switch (e.keyCode) {
      case 8:
      case 46:
        e.preventDefault();
        break;
    }
  };

  const valueRenderer = (option) => (
    <div className={styles.label}>
      <div className={classNames(styles.flag, styles[option.language])} />
      <div className={styles.name}>{option.description}</div>
    </div>
  );

  const onChangeSelect = (value) => {
    setValue(value);
    onChange?.(value);
  };

  return (
    <div className={classNames(styles.input, className)}>
      <Select
        clearable={false}
        multi={false}
        value={stateValue}
        valueKey={valueKey}
        labelKey={labelKey}
        options={options}
        valueRenderer={valueRenderer}
        optionRenderer={valueRenderer}
        onChange={onChangeSelect}
        onInputKeyDown={selectKeyDown}
        aria-labelledby={ariaLabelledBy}
      />
    </div>
  );
};

LanguageSelectInput.propTypes = {
  className: PropTypes.string
};

export default injectIntl(LanguageSelectInput);
