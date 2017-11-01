import React from "react";
import compose from "lodash/fp/compose";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import ReceiveAccountsSelect from "inputs/ReceiveAccountsSelect";
import "../../../../style/SendPage.less";

const messages = defineMessages({
  amountPlaceholder: {
    id: "send.amountPlaceholder",
    defaultMessage: "Amount"
  }
});

const SendOutputAccountRow = ({
  index,
  currencyDisplay,
  amountStr,
  amountError,
  onAttemptConstructTransaction,
  hastAttemptedConstruct,
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
        <ReceiveAccountsSelect
          getAddressForSelected={true}
          showAccountsButton={true} />
      </div>

      <div className="send-amount">
        <div className="send-amount-label"><T id="send.amount" m="Amount" />:</div>
        <div className="send-address-amount-sum-and-currency">
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
            placeholder={intl.formatMessage(messages.amountPlaceholder)}
            onChange={compose(getOnChangeOutputAmount(index), e => e.target.value)}
            onBlur={onAttemptConstructTransaction}
          />
          <div className="send-address-amount-sum-gradient">{currencyDisplay}</div>
        </div>
      </div>
    </div>
    {hastAttemptedConstruct ? (
      <div className="send-output-error-row">
        <div className="send-output-amount-error">{amountError}</div>
      </div>
    ) : null}
  </div>
);

export default injectIntl(SendOutputAccountRow);
