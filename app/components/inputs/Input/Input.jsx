import { defineMessages } from "react-intl";
import styles from "./Input.module.css";
import { classNames, TextInput } from "pi-ui";
import { useIntl } from "react-intl";

const messages = defineMessages({
  invalidInput: {
    id: "input.invalidInput",
    defaultMessage: "This field is wrong"
  },
  requiredInput: {
    id: "input.requiredInput",
    defaultMessage: "This field is required"
  }
});

const Input = ({
  children,
  label,
  id,
  onFocus,
  onBlur,
  onKeyDownSubmit,
  onKeyDown,
  onChange,
  showErrors,
  showSuccess,
  invalidMessage,
  successMessage,
  requiredMessage,
  required,
  invalid,
  value,
  placeholder,
  disabled,
  readOnly,
  unit,
  hidden,
  type,
  className,
  inputClassNames,
  unitAreaClassName,
  autoFocus,
  dataTestId,
  ariaLabelledBy,
  newBiggerFontStyle
}) => {
  const onInputKeyDown = (e) => {
    e.keyCode === 13 && onKeyDownSubmit?.(e);
    !e.defaultPrevented && onKeyDown?.(e);
  };

  let error = null;

  const intl = useIntl();
  const hasErrorToShow =
    showErrors && ((invalid && value) || (required && !value));
  if (showErrors) {
    if (invalid && value) {
      error = invalidMessage
        ? invalidMessage
        : intl.formatMessage(messages.invalidInput);
    }
    if (required && !value) {
      error = requiredMessage
        ? requiredMessage
        : intl.formatMessage(messages.requiredInput);
    }
  }

  return hidden ? null : (
    <TextInput
      {...{
        id,
        label,
        error,
        inputClassNames,
        autoFocus,
        disabled,
        readOnly,
        placeholder
      }}
      type={type ?? "text"}
      success={showSuccess ? successMessage : ""}
      value={value ?? ""}
      onChange={(e) => onChange?.(e)}
      onFocus={(e) => onFocus?.(e)}
      onBlur={(e) => onBlur?.(e)}
      wrapperClassNames={classNames(className, styles.wrapper)}
      inputClassNames={classNames(
        inputClassNames,
        newBiggerFontStyle ? styles.newBiggerFontStyleInput : styles.input
      )}
      labelClassNames={styles.label}
      messageClassNames={!newBiggerFontStyle ? styles.message : null}
      onKeyDown={onInputKeyDown}
      data-testid={dataTestId}
      aria-labelledby={ariaLabelledBy}>
      {unit && (
        <span
          className={classNames(
            styles.unitArea,
            unitAreaClassName,
            hasErrorToShow && styles.error
          )}>
          {unit}
        </span>
      )}
      {children}
    </TextInput>
  );
};

export default Input;
