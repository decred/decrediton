import { compose } from "fp";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { DcrInput, ReceiveAccountsSelect } from "inputs";
import "style/SendPage.less";

const messages = defineMessages({
  amountPlaceholder: {
    id: "send.amountPlaceholder",
    defaultMessage: "Amount"
  }
});

const SendOutputAccountRow = ({
  index,
  amountStr,
  amountError,
  getOnChangeOutputAmount,
  isSendAll,
  totalSpent,
  unitDivisor,
  intl,
}) => (
  <div className="send-row">
    <div className="send-output-row">
      <div className="send-label"><T id="send.to" m="To" />:</div>
      <div className="send-address">
        <ReceiveAccountsSelect
          getAddressForSelected={true}
          showAccountsButton={false}
          />
      </div>

      <div className="send-amount">
        <div className="send-amount-label"><T id="send.amount" m="Amount" />:</div>
        <div className="send-address-amount-sum-and-currency">
          <DcrInput
            showErrors={true}
            hidden={!isSendAll}
            className="send-address-input-amount"
            disabled={true}
            value={totalSpent !== null ? totalSpent / unitDivisor : ""}
          />
          <DcrInput
            showErrors={true}
            invalid={!!amountError}
            invalidMessage={amountError}
            hidden={isSendAll}
            value={amountStr}
            className="send-address-input-amount"
            placeholder={intl.formatMessage(messages.amountPlaceholder)}
            onChange={compose(getOnChangeOutputAmount(index), e => e.target.value)}
          />
        </div>
      </div>
    </div>
  </div>
);

export default injectIntl(SendOutputAccountRow);
