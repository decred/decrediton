import NumericInput from "../NumericInput";
import { useFeeInput } from "./hooks.js";

// FeeInput is an input that restricts values to a fee (DCR/KB or similar)
const FeeInput = (props) => {
  const { currencyDisplay } = useFeeInput();
  return <NumericInput {...{ ...props, unit: `${currencyDisplay}/KB` }} />;
};

export default FeeInput;
