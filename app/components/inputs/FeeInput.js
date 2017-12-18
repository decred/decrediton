import balanceConnector from "connectors/balance";
import NumericInput from "./NumericInput";

// FeeInput is an input that restricts values to a fee (DCR/KB or similar)
const FeeInput = ({...props, currencyDisplay}) =>
  <NumericInput {...{...props, unit: currencyDisplay + "/KB"}} />;


export default balanceConnector(FeeInput);
