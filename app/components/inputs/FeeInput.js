import balanceConnector from "connectors/balance";
import NumericInput from "./NumericInput";

// FeeInput is an input that restricts values to a fee (DCR/KB or similar)
const FeeInput = ({...props, currencyDisplay}) => {
  console.log(props);
  return <NumericInput {...{...props, unit: currencyDisplay + "/KB"}} />;
//   return <ReduxFormInput {...{...props, unit: currencyDisplay + "/KB"}}
//   component="input"
// />;
};

export default balanceConnector(FeeInput);
