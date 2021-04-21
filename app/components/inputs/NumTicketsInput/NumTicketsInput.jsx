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
      <T id="numTicketsInput.ticket" m="ticket" />
    ) : (
      <T id="numTicketsInput.tickets" m="tickets" />
    );
  return (
    <div className={style.container}>
      <IntegerInput
        newBiggerFontStyle
        {...{
          required,
          onKeyDown,
          showErrors,
          invalid,
          invalidMessage,
          value: numTickets
        }}
        inputClassNames={classNames(
          style.integerInput,
          invalid && style.invalid
        )}
        className={classNames(
          style.integerInputWrapper,
          invalid && style.invalid
        )}
        onChange={(e) =>
          onChangeNumTickets && onChangeNumTickets(e.target.value)
        }
        data-max-width="70"
        {...props}>
        <div className={style.ticketUnitLabel}>{ticketUnitLabel}</div>
      </IntegerInput>
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
