import IntegerInput from "./IntegerInput";
import "style/NumTicketsInput.less";
import { FormattedMessage as T } from "react-intl";

const NumTicketsInput = ({
  numTickets,
  incrementNumTickets,
  decrementNumTickets,
  onChangeNumTickets
}) => (
  <div className="num-tickets-input-area">
    <div className="num-tickets-input">
      <IntegerInput
        className="num-tickets-input-value"
        value={numTickets}
        onChange={e => onChangeNumTickets && onChangeNumTickets(e.target.value)}
        data-max-width="70"
        unit={<T id="numTicketsInput.unit" m="tickets" />}
      />
    </div>
    <div className="num-tickets-more-less">
      <a key="more" className="num-tickets-more" onClick={incrementNumTickets}></a>
      <a key="less" className="num-tickets-less" onClick={decrementNumTickets}></a>
    </div>
  </div>
);

export default NumTicketsInput;
