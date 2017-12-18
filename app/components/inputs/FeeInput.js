import balanceConnector from "connectors/balance";
import ReduxFormInput from "./ReduxFormInput";

// FeeInput is an input that restricts values to a fee (DCR/KB or similar)
const FeeInput = ({...props, currencyDisplay}) => {
  console.log(props);
  return <ReduxFormInput {...{...props, unit: currencyDisplay + "/KB"}}
    component="input"
  />;
};

export default balanceConnector(FeeInput);
