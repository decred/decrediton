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
  unit,
  hidden,
  type,
  onFocus,
  onBlur,
}) => {
  let inputUnitDiv = null;
  const onInputFocus = (e) => {
    inputUnitDiv.classList.add("active");
    onFocus && onFocus(e);
  };
  const onInputBlur = (e) => {
    inputUnitDiv.classList.remove("active");
    onBlur && onBlur(e);
  };

  const divClassName =
    "input-and-unit "
    + (className || "")
    + (disabled ? " disabled " : "");

  return (
    hidden ? null :
    <Aux>
      <div className={divClassName} ref={div => { inputUnitDiv = div; }}>
        <input
          type={type||"text"}
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
