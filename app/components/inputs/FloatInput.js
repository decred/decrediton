import NumericInput from "./NumericInput";
import { restrictToStdDecimalNumber } from "helpers/strings";

const FloatInput = ({...props}) => {

  var value = props.value;

  const onChange = (e) => {
    const newValue = restrictToStdDecimalNumber(e.target.value);
    if (value !== newValue) {
      value = newValue;
      e.target.value = newValue;
      props.onChange && props.onChange(e);
    }
  };

  return <NumericInput {...props} onChange={onChange} value={value}/>;
};

export default FloatInput;
