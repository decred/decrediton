import NumericInput from "./NumericInput";
import { restrictToStdDecimalNumber, limitFractionalDigits } from "helpers/strings";

const FloatInput = ({ maxFracDigits, ...props }) => {

  var value = props.value;

  const onChange = (e) => {
    let newValue = restrictToStdDecimalNumber(e.target.value);
    newValue = maxFracDigits ? limitFractionalDigits(newValue, maxFracDigits) : newValue;
    if (value !== newValue) {
      value = newValue;
      e.target.value = newValue;
      props.onChange && props.onChange(e);
    }
  };

  return <NumericInput {...props} onChange={onChange} value={value}/>;
};

export default FloatInput;
