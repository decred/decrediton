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
  onKeyDown
}) => {
  const ticketUnitLabel = numTickets === 1 ? <T id="numTicketInput.unit" m="ticket" /> : <T id="numTicketsInput.unit" m="tickets" />;
  return (
    <div className={"is-row stakepool-purchase-ticket-num-select " + (invalid && "error")} >
      <IntegerInput
        {...{ required, onKeyDown, showErrors, invalid, invalidMessage,
          value: numTickets }}
        className="ticket-numeric-input"
        onChange={e => onChangeNumTickets && onChangeNumTickets(e.target.value)}
        data-max-width="70"
        unit={!invalid && ticketUnitLabel}
      />
      <div key="less" className="num-tickets-icon less" onClick={decrementNumTickets} />
      <div key="more" className="num-tickets-icon more" onClick={incrementNumTickets} />
    </div>
  );
};

export default NumTicketsInput;
