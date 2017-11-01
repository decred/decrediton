import NumericInput from "./NumericInput";
import balanceConnector from "connectors/balance";

const DcrInput = ({...props, currencyDisplay}) =>
  <NumericInput {...{...props, unit: currencyDisplay}} />;

export default balanceConnector(DcrInput);
