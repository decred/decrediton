import NumericInput from "./NumericInput";

// PercentInput is an input that shows a percent value (e.g. 50%)
const PercentInput = ({ ...props }) => (
  <NumericInput {...{ ...props, unit: "%" }} />
);

export default PercentInput;
