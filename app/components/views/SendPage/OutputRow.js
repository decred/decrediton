import React from "react";
import compose from "lodash/fp/compose";
import "../../../style/SendPage.less";

const SendOutputRow = ({
  index,
  outputs,
  currencyDisplay,
  destination,
  amountStr,
  addressError,
  amountError,
  onAttemptConstructTransaction,
  onAddOutput,
  hastAttemptedConstruct,
  getOnRemoveOutput,
  getOnChangeOutputDestination,
  getOnChangeOutputAmount,
  isSendAll,
  totalSpent,
  unitDivisor,
}) => (
  <div className="send-row">
    <div className="send-output-row">
      <div className="send-label">To:</div>
      <div className="send-address">
        <div className="send-input-form">
          <input
            value={destination}
            type="text"
            className="send-address-hash-to"
            placeholder="Destination Address"
            onChange={compose(getOnChangeOutputDestination(index), e => e.target.value)}
            onBlur={onAttemptConstructTransaction}
          />
        </div>
      </div>
      {index === 0 && !isSendAll ? (
        <div className="send-address-wallet-icon" onClick={onAddOutput}></div>
      ) : (index === 0 && isSendAll) ? (
        <div className="send-address-icon-spacer"></div>
      ) : (index === (outputs.length - 1)) && !isSendAll ? (
        <div className="send-address-delete-icon" onClick={getOnRemoveOutput(index)}></div>
      ) : (index !== 0) ? (
        <div className="send-address-icon-spacer send-address-amount-spacer" ></div>
      ) : ( null ) }
      <div className="send-amount">
        {index === 0 ? <div className="send-amount-label">Amount:</div> : null}
        <div className="send-address-amount-sum-and-currency">
        <div className="send-address-amount-sum-gradient">{currencyDisplay}</div>
          <input
            hidden={!isSendAll}
            className="send-address-input-amount"
            disabled={true}
            type="text"
            value={totalSpent !== null ? totalSpent / unitDivisor : ""}
          />
          <input
            hidden={isSendAll}
            value={amountStr}
            type="text"
            className="send-address-input-amount"
            placeholder="Amount"
            onChange={compose(getOnChangeOutputAmount(index), e => e.target.value)}
            onBlur={onAttemptConstructTransaction}
          />
        </div>
      </div>
    </div>
    {hastAttemptedConstruct ? (
      <div className="send-output-error-row">
        <div className="send-output-address-error">{addressError}</div>
        <div className="send-output-amount-error">{amountError}</div>
      </div>
    ) : null}
  </div>
);

export default SendOutputRow;
