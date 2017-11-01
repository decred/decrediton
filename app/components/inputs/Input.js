import React from "react";
import { FormattedMessage as T } from "react-intl";
import "style/Input.less";

const Input = ({
  showErrors,
  invalidMessage,
  requiredMessage,
  required,
  invalid,
  value,
  placeholder,
  onChange,
  disabled,
  readOnly,
  className,
  unit
}) => {
  let inputUnitDiv = null;
  const onInputFocus = () => { inputUnitDiv.classList.add("active"); };
  const onInputBlur = () => { inputUnitDiv.classList.remove("active"); };

  return (
    <Aux>
      <div className={"input-and-unit " + (className || "")} ref={div => { inputUnitDiv = div; }}>
        <input
          type="text"
          className="input"
          disabled={disabled ? disabled : null}
          readOnly={readOnly ? readOnly : null}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onInputFocus}
          onBlur={onInputBlur}
        />
        {unit ? <div className="unit-area">{unit}</div> : null}
      </div>
      {showErrors ? (
        <div className="input-errors-area">
          {invalid && value ? (
            <div className="input-error">
              {invalidMessage ? invalidMessage :
                <T id="input.invalidInput" m="This field is wrong" />}
            </div>
          ) : null}
          {required && !value ? (
            <div className="input-error">
            {requiredMessage ? requiredMessage :
                <T id="input.requiredInput" m="This field is required" />}
            </div>
          ) : null}
        </div>
      ) : null}
    </Aux>
  );
};

export default Input;
