import { compose } from "fp";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { AddressInput, DcrInput } from "inputs";
import { Tooltip } from "shared";
import "style/SendPage.less";

const messages = defineMessages({
  destinationAddrPlaceholder: {
    id: "send.destinationAddrPlaceholder",
    defaultMessage: "Address"
  },
  amountPlaceholder: {
    id: "send.amountPlaceholder",
    defaultMessage: "Amount"
  }
});

const SendOutputRow = ({
  index, outputs, destination, value, addressError, onAddOutput, getOnRemoveOutput,
  onValidateAmount, onValidateAddress, isSendAll, onKeyDown, sendAllAmount, error, intl,
  onShowSendAll, onHideSendAll,
}) => (
  <>
    <div className="send-row is-row">
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
            onChange={(e) => onValidateAddress({ address: e.target.value , index })}
            onKeyDown={onKeyDown}
          />
        </div>
        {(index === 0 && isSendAll) ? (
          <div className="send-address-icon-spacer"></div>
        ) : (index === (outputs.length - 1)) && !isSendAll ? (
          <div className="send-address-delete-icon" onClick={getOnRemoveOutput}></div>
        ) : ( null ) }
      </div>
      {index === 0 && !isSendAll && 
        <div className="send-address-wallet-icon" onClick={onAddOutput}></div>}
    </div>
    <div className="send-row is-row">
      <div className="send-label">
        {index === 0 ? <span><T id="send.amount" m="Amount" />:</span> : null}
      </div>
      {
        isSendAll ? <DcrInput
          showErrors={true}
          className="send-address-input-amount"
          disabled={true}
          amount={sendAllAmount}
          onKeyDown={onKeyDown}
          onChange={ (e) => onValidateAmount(e.target.value, index) }
        /> : <DcrInput
          required={true}
          showErrors={error && error.amount}
          invalid={error && error.amount}
          invalidMessage={error && error.amount}
          amount={value}
          className="send-address-input-amount"
          placeholder={intl.formatMessage(messages.amountPlaceholder)}
          onChange={ e => onValidateAmount({ value: e.value , index, atomValue: e.atomValue })}
          onKeyDown={onKeyDown}
        />
      }
      {!isSendAll ?
        <Tooltip text={<T id="send.sendAllTitle" m="Send all funds from selected account"/>}>
          <a className="send-all-wallet-icon" onClick={onShowSendAll}/>
        </Tooltip> :
        <Tooltip text={<T id="send.cancelSendAllTitle" m="Cancel sending all funds"/>}>
          <a className="send-all-cancel-wallet-icon" onClick={onHideSendAll}/>
        </Tooltip>
      }
    </div>
  </>
);

export default injectIntl(SendOutputRow);
