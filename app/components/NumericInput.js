import React from "react";
import { FormattedMessage as T } from "react-intl";
import "../style/Input.less";

const NumericInput = ({
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
  unit
}) => {
  return (
    <div>
      <input
        type="text"
        className="numeric-input"
        disabled={disabled ? disabled : null}
        readOnly={readOnly ? readOnly : null}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {unit ? <div className="unit-area"><span className="right-balance-small">{unit}</span></div> : null}
      {showErrors ? (
        <div className="errors-area">
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


    </div>
  );
};

export default NumericInput;
