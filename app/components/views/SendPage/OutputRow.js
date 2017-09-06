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
      ) : (index === (outputs.length - 1)) && !isSendAll ? (
        <div className="send-address-delete-icon" onClick={getOnRemoveOutput(index)}></div>
      ) : (
        <div style={{width:"39px", height: "34px", float: "left"}}></div>
      )}
      <div className="send-amount">
        {index === 0 ? <div className="send-amount-label">Amount:</div> : null}
        <div className="send-address-amount-sum-and-currency">
        <div className="send-address-amount-sum-gradient">{currencyDisplay}</div>
          <input
            disabled={isSendAll}
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
