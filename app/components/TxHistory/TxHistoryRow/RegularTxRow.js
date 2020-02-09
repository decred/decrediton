import Row from "./Row";
import { Balance } from "shared";
import { createElement as h } from "react";
import { timeMessage } from "./index";
import { FormattedMessage as T } from "react-intl";

const RegularTxRow = ({
  txAmount, txDirection, overview, txAccountName, pending, txTs,
  txOutputAddresses, txInputOutpoints, ...props
}) => (
  <Row {...{ ...props, txAccountName, pending, overview }}>
    <div className="is-row">
      <span className="icon" />
      <span className="transaction-amount-number"><Balance amount={txDirection !== "in" ? -txAmount : txAmount} /></span>
      { !overview && (txDirection === "transfer" ?
        <div className="transaction-status">
          <span className="transaction-account-name">{txAccountName}</span>
        </div> : txDirection !== "in" ? (
          <div className="transaction-info is-row">
            <T id="txHistory.from" m="From " />
            <div className="transaction-status">
              <span className="transaction-account-name">{txAccountName}</span>
            </div>
            <T id="txHistory.to" m=" To " />
            <div className="transaction-status">
              <span className="transaction-account-name">{txOutputAddresses}</span>
            </div>
          </div>
        ) : (
          <div className="transaction-info is-row">
            <T id="txHistory.from" m="From " />
            <div className="transaction-status">
              <span className="address-shorter transaction-account-name">{txInputOutpoints}</span>
            </div>
            <T id="txHistory.to" m=" To " />
            <div className="transaction-status">
              <span className="transaction-account-name">{txAccountName}</span>
            </div>
          </div>
        ))}
      { !pending &&
        <div className="transaction-time-date-spacer">
          {timeMessage(txTs, props.intl)}
        </div>
      }
    </div>
    { overview &&
        <div className="transaction-amount-hash">
          { txDirection !== "in" ? (
            <>
              <T id="txHistory.from" m="From " />
              { txAccountName }
              <T id="txHistory.to" m=" To " />
              <span className="address-shorter">{ txOutputAddresses }</span>
            </>
          ) : (
            <>
              <T id="txHistory.from" m="From " />
              <span className="address-shorter">{ txInputOutpoints }</span>
              <T id="txHistory.to" m=" To " />
              { txAccountName }
            </>
          )}
        </div>
    }

  </Row>
);

export const RegularTxRowOfClass = (className) => {
  const Comp = ({ ...p }) => h(RegularTxRow, { className, ...p });
  Comp.displayName = `RegularTxRowOfClass: ${className}`;
  return Comp;
};
