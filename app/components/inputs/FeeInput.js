import NumericInput from "./NumericInput";
import balanceConnector from "connectors/balance";

// FeeInput is an input that restricts values to a fee (DCR/KB or similar)
const FeeInput = ({ currencyDisplay, ...props }) =>
  <NumericInput {...{ ...props, unit: currencyDisplay + "/KB" }} />;

export default balanceConnector(FeeInput);
