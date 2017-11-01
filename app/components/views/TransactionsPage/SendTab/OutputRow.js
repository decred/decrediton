import React from "react";
import compose from "lodash/fp/compose";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { AddressInput, DcrInput } from "inputs";
import "../../../../style/SendPage.less";

const messages = defineMessages({
  destinationAddrPlaceholder: {
    id: "send.destinationAddrPlaceholder",
    defaultMessage: "Destination Address"
  },
  amountPlaceholder: {
    id: "send.amountPlaceholder",
    defaultMessage: "Amount"
  }
});

const SendOutputRow = ({
  index,
  outputs,
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
  intl
}) => (
  <div className="send-row">
    <div className="send-output-row">
      <div className="send-label"><T id="send.to" m="To" />:</div>
      <div className="send-address">
        <div className="send-input-form">
          <AddressInput
            value={destination}
            className="send-address-hash-to"
            placeholder={intl.formatMessage(messages.destinationAddrPlaceholder)}
            onChange={compose(getOnChangeOutputDestination(index), e => e.target.value)}
            onBlur={onAttemptConstructTransaction}
          />
        </div>
        {index === 0 && !isSendAll ? (
          <div className="send-address-wallet-icon" onClick={onAddOutput}></div>
        ) : (index === 0 && isSendAll) ? (
          <div className="send-address-icon-spacer"></div>
        ) : (index === (outputs.length - 1)) && !isSendAll ? (
          <div className="send-address-delete-icon" onClick={getOnRemoveOutput(index)}></div>
        ) : ( null ) }
      </div>
      <div className="send-amount">
        <div className="send-amount-label">
          {index === 0 ? <span><T id="send.amount" m="Amount" />:</span> : null}
        </div>
        <div className="send-address-amount-sum-and-currency">
          <DcrInput
            hidden={!isSendAll}
            className="send-address-input-amount"
            disabled={true}
            value={totalSpent !== null ? totalSpent / unitDivisor : ""}
          />
          <DcrInput
            hidden={isSendAll}
            value={amountStr}
            className="send-address-input-amount"
            placeholder={intl.formatMessage(messages.amountPlaceholder)}
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

export default injectIntl(SendOutputRow);
