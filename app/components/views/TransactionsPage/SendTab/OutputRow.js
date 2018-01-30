import { compose } from "fp";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { AddressInput, DcrInput } from "inputs";
import "style/SendPage.less";

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
  amount,
  addressError,
  amountError,
  onAddOutput,
  getOnRemoveOutput,
  getOnChangeOutputDestination,
  getOnChangeOutputAmount,
  isSendAll,
  totalSpent,
  intl
}) => (
  <div className="send-row">
    <div className="send-output-row">
      <div className="send-label">{index === 0 && <span><T id="send.to" m="To" />:</span>}</div>
      <div className="send-address">
        <div className="send-input-form">
          <AddressInput
            autoFocus={index == 0}
            showErrors={true}
            invalid={!!addressError}
            invalidMessage={addressError}
            value={destination}
            className="send-address-hash-to"
            placeholder={intl.formatMessage(messages.destinationAddrPlaceholder)}
            onChange={compose(getOnChangeOutputDestination(index), e => e.target.value)}
          />
        </div>
        {index === 0 && !isSendAll ? (
          <div className="send-address-wallet-icon" onClick={onAddOutput}></div>
        ) : (index === 0 && isSendAll) ? (
          <div className="send-address-icon-spacer"></div>
        ) : (index === (outputs.length - 1)) && !isSendAll ? (
          <div className="send-address-delete-icon" onClick={getOnRemoveOutput}></div>
        ) : ( null ) }
      </div>
      <div className="send-amount">
        <div className="send-amount-label">
          {index === 0 ? <span><T id="send.amount" m="Amount" />:</span> : null}
        </div>
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

export default injectIntl(SendOutputRow);
