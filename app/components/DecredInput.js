import React from "react";
import NumericInput from "./NumericInput";
import balanceConnector from "../connectors/balance";

const DcrInput = ({
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
  currencyDisplay
}) => {
  return (
    <div>
      <NumericInput
        showErrors={showErrors}
        invalidMessage={invalidMessage}
        requiredMessage={requiredMessage}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        required={required}
        invalid={invalid}
        value={value}
        onChange={onChange}
        unit= {currencyDisplay}
      />

    </div>
  );
};

export default balanceConnector(DcrInput);
