import Row from "./Row";
import { Balance } from "shared";
import { createElement as h } from "react";
import { timeMessage } from "./index";
import { FormattedMessage as T } from "react-intl";

const RegularTxRow = ({
  txAmount, txDescription, txDirection, overview, txAccountName, pending, txTs,
  txOutputAddresses, txInputOutpoints, ...props
}) => (
  <Row {...{ ...props, txAccountName, pending, overview }}>
    <div className="is-row">
      <span className="icon" />
      <span className="transaction-amount-number"><Balance amount={txDirection !== "in" ? -txAmount : txAmount} /></span>
      { !overview &&
        <div className="transaction-status">
          <span className="transaction-account-name">{txAccountName}</span>
        </div>
      }
      { !pending &&
        <div className="transaction-time-date-spacer">
          {timeMessage(txTs, props.intl)}
        </div>
      }
    </div>
    <div className="transaction-amount-hash">
      {
        txDirection !== "in" ? (
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
        )
      }
      
    </div>
  </Row>
);

export const RegularTxRowOfClass = (className) => {
  const Comp = ({ ...p }) => h(RegularTxRow, { className, ...p });
  Comp.displayName = `RegularTxRowOfClass: ${className}`;
  return Comp;
};
