import Row from "./Row";
import { Balance } from "shared";
import { createElement as h } from "react";
import { FormattedDate, FormattedTime, FormattedMessage as T } from "react-intl";

const timeMessage = (txTimestamp) => <T
  id="txHistory.statusSmall.date"
  defaultMessage="{day} {month} {year} {time}"
  values={{
    day: <FormattedDate value={txTimestamp} day="2-digit" />,
    month: <FormattedDate value={txTimestamp} month="short" />,
    year: <FormattedDate value={txTimestamp} year="numeric" />,
    time: <FormattedTime value={txTimestamp} hour12={false} />,
  }}
/>;

const RegularTxRow = ({ txAmount, txDescription, txDirection, overview, txAccountName, pending, txTimestamp, tsDate, ...props }) => (
  <Row {...{ ...props, txAccountName, pending, overview, tsDate, txTimestamp }}>
    <div className="is-row">
      <span className="icon" />
      <span className="transaction-amount-number"><Balance amount={txDirection !== "in" ? -txAmount : txAmount} /></span>
      {!overview &&
        <div className="transaction-status">
          <span className="transaction-account-name">{txAccountName}</span>
        </div>}
      {!pending &&
        <div className="transaction-time-date-spacer">
          {timeMessage(tsDate(txTimestamp))}
        </div>}
    </div>
    <div className="transaction-amount-hash">{(txDescription.addressStr || []).join(", ")}</div>
  </Row>
);

export const RegularTxRowOfClass = (className) => {
  const Comp = ({ ...p }) => h(RegularTxRow, { className, ...p });
  Comp.displayName = `RegularTxRowOfClass: ${className}`;
  return Comp;
};
