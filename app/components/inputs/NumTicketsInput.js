import IntegerInput from "./IntegerInput";
import { FormattedMessage as T } from "react-intl";

const NumTicketsInput = ({
  numTickets,
  incrementNumTickets,
  decrementNumTickets,
  onChangeNumTickets,
  required,
  invalid,
  invalidMessage,
  showErrors,
  onKeyDown,
  className
}) => (
  <div className={"is-row " + className} >
    <div>
      <IntegerInput
        required={required}
        onKeyDown={onKeyDown}
        showErrors={showErrors}
        invalid={invalid}
        invalidMessage={invalidMessage}
        value={numTickets}
        onChange={e => onChangeNumTickets && onChangeNumTickets(e.target.value)}
        data-max-width="70"
        unit={<T id="numTicketsInput.unit" m="tickets" />}
      />
    </div>
    <div key="more" className="num-tickets-icon more" onClick={incrementNumTickets} />
    <div key="less" className="num-tickets-icon less" onClick={decrementNumTickets} />
  </div>
);

export default NumTicketsInput;
