import { SettingsInput } from "inputs";
import { classNames } from "pi-ui";
import styles from "./LanguageSelectInput.module.css";
import { components } from "react-select";

const LanguageSelectInput = ({
  valueKey,
  labelKey,
  ariaLabelledBy,
  className,
  ...props
}) => {
  const SingleValue = (props) => (
    <components.SingleValue {...props}>
      <div className={styles.label}>
        <div className={classNames(styles.flag, styles[props.data.value])} />
        <div className={styles.singleValue}>{props.data.label}</div>
      </div>
    </components.SingleValue>
  );

  const Option = (props) => (
    <components.Option {...props}>
      <div className={styles.label}>
        <div className={classNames(styles.flag, styles[props.data.value])} />
        <div className={styles.option}>{props.data.label}</div>
      </div>
    </components.Option>
  );

  return (
    <div className={classNames(styles.input, className)}>
      <SettingsInput
        {...{
          valueKey,
          labelKey,
          ariaLabelledBy,
          customComponents: { SingleValue, Option },
          ...props
        }}
      />
    </div>
  );
};

export default LanguageSelectInput;
