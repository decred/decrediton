import IntegerInput from "../IntegerInput";
import { FormattedMessage as T } from "react-intl";
import style from "./NumTicketsInput.module.css";
import { classNames } from "pi-ui";

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
  ...props
}) => {
  const ticketUnitLabel =
    parseInt(numTickets) === 1 ? (
      <T id="numTicketInput.unit" m="Ticket" />
    ) : (
      <T id="numTicketsInput.unit" m="Tickets" />
    );
  return (
    <div className={classNames(style.container, invalid && style.error)}>
      <IntegerInput
        {...{
          required,
          onKeyDown,
          showErrors,
          invalid,
          invalidMessage,
          value: numTickets
        }}
        className={style.integerInput}
        errorClassName={style.inputError}
        inputErrorsAreaClassName={style.inputErrorsArea}
        onChange={(e) =>
          onChangeNumTickets && onChangeNumTickets(e.target.value)
        }
        data-max-width="70"
        unit={!invalid && ticketUnitLabel}
        {...props}
      />
      <button
        key="less"
        aria-label="less"
        className={classNames(style.icon, style.less)}
        onClick={decrementNumTickets}
      />
      <button
        key="more"
        aria-label="more"
        className={classNames(style.icon, style.more)}
        onClick={incrementNumTickets}
      />
    </div>
  );
};

export default NumTicketsInput;
