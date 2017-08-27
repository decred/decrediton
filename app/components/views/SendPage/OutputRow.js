import React from "react";
import compose from "lodash/fp/compose";
import { SendStyles } from "../ViewStyles";

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
  getOnChangeOutputAmount
}) => (
  <div style={SendStyles.sendRow}>
    <div style={SendStyles.sendOutputRow}>
      <div style={SendStyles.sendLabel}>To:</div>
      <div style={SendStyles.sendAddress}>
        <div style={SendStyles.inputForm}>
          <input
            value={destination}
            type="text"
            style={SendStyles.sendAddressHashTo}
            placeholder="Destination Address"
            onChange={compose(getOnChangeOutputDestination(index), e => e.target.value)}
            onBlur={onAttemptConstructTransaction}
          />
        </div>
      </div>
      {index === 0 ? (
        <div style={SendStyles.sendAddressWalletIcon} onClick={onAddOutput}></div>
      ) : (index === (outputs.length - 1)) ? (
        <div style={SendStyles.sendAddressDeleteIcon} onClick={getOnRemoveOutput(index)}></div>
      ) : (
        <div style={{width:"39px", height: "34px", float: "left"}}></div>
      )}
      <div style={SendStyles.sendAmount}>
        {index === 0 ? <div style={SendStyles.sendAmountLabel}>Amount:</div> : null}
        <div style={SendStyles.sendAddressAmountSumAndCurrency}>
        <div style={SendStyles.sendAddressAmountSumGradient}>{currencyDisplay}</div>
          <input
            value={amountStr}
            type="text"
            style={SendStyles.sendAddressInputAmount}
            placeholder="Amount"
            onChange={compose(getOnChangeOutputAmount(index), e => e.target.value)}
            onBlur={onAttemptConstructTransaction}
          />
        </div>
      </div>
    </div>
    {hastAttemptedConstruct ? (
      <div style={SendStyles.sendOutputErrorRow}>
        <div style={SendStyles.sendOutputAddressError}>{addressError}</div>
        <div style={SendStyles.sendOutputAmountError}>{amountError}</div>
      </div>
    ) : null}
  </div>
);

export default SendOutputRow;
