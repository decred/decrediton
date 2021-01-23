import { FormattedMessage as T } from "react-intl";
import style from "./Input.module.css";
import { useRef } from "react";
import { classNames } from "pi-ui";
import { useMountEffect } from "hooks";

const Input = ({
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
  errorClassName,
  inputErrorsAreaClassName,
  unitAreaClassName,
  autoFocus,
  dataTestId
}) => {
  const inputUnitDiv = useRef(null);
  const input = useRef(null);

  useMountEffect(() => {
    autoFocus && input?.current.focus();
  });

  const onInputFocus = (e) => {
    inputUnitDiv?.current.classList.add("active");
    onFocus?.(e);
  };

  const onInputBlur = (e) => {
    inputUnitDiv?.current.classList.remove("active");
    onBlur?.(e);
  };

  const onInputKeyDown = (e) => {
    e.keyCode === 13 && onKeyDownSubmit?.(e);
    !e.defaultPrevented && onKeyDown?.(e);
  };

  const hasErrorToShow =
    showErrors && ((invalid && value) || (required && !value));

  return hidden ? null : (
    <>
      <div
        className={classNames(
          style.inputAndUnit,
          className,
          disabled && style.disabled,
          hasErrorToShow && (errorClassName || style.error),
          showSuccess && style.success
        )}
        data-testid={dataTestId}
        ref={inputUnitDiv}>
        <input
          id={id}
          ref={input}
          type={type ?? "text"}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          value={value ?? ""}
          onChange={(e) => onChange?.(e)}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
          onKeyDown={onInputKeyDown}
        />
        {unit && (
          <span
            className={classNames(
              style.unitArea,
              unitAreaClassName,
              hasErrorToShow && style.error
            )}>
            {unit}
          </span>
        )}
      </div>
      {showErrors ? (
        <div
          className={classNames(
            style.inputErrorsArea,
            inputErrorsAreaClassName && inputErrorsAreaClassName
          )}>
          {invalid && value ? (
            <div className={style.inputError}>
              {invalidMessage ? (
                invalidMessage
              ) : (
                <T id="input.invalidInput" m="This field is wrong" />
              )}
            </div>
          ) : null}
          {required && !value ? (
            <div className={style.inputError}>
              {requiredMessage ? (
                requiredMessage
              ) : (
                <T id="input.requiredInput" m="This field is required" />
              )}
            </div>
          ) : null}
        </div>
      ) : null}
      {showSuccess ? (
        <div className={style.inputSuccessArea}>
          {successMessage ? successMessage : null}
        </div>
      ) : null}
    </>
  );
};

export default Input;
