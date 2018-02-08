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
  amount,
  amountError,
  getOnChangeOutputAmount,
  isSendAll,
  totalSpent,
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
            amount={totalSpent}
          />
          <DcrInput
            showErrors={true}
            invalid={!!amountError}
            invalidMessage={amountError}
            hidden={isSendAll}
            amount={amount}
            className="send-address-input-amount"
            placeholder={intl.formatMessage(messages.amountPlaceholder)}
            onChangeAmount={getOnChangeOutputAmount(index)}
          />
        </div>
      </div>
    </div>
  </div>
);

export default injectIntl(SendOutputAccountRow);
