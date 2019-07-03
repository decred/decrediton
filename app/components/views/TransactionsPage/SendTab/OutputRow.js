import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { AddressInput, DcrInput, ReceiveAccountsSelect } from "inputs";
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
  index, destination, value, onAddOutput, onRemoveOutput,
  onValidateAmount, onValidateAddress, isSendAll, onKeyDown, sendAllAmount, error, intl,
  onShowSendAll, onHideSendAll, isSendSelf, outputs
}) => (
  <>
    <div className="send-row is-row">
      <div className="send-label to-label"><span><T id="send.to" m="To" />:</span></div>
      <div className="send-input">
        {
          isSendSelf ?
            <ReceiveAccountsSelect
              getAddressForSelected={true}
              showAccountsButton={false}
              onKeyDown={onKeyDown}
            /> : <AddressInput
              required = {true}
              autoFocus={index === 0}
              showErrors={ error && error.address }
              invalid={error && error.address}
              invalidMessage={error && error.address}
              value={destination}
              placeholder={intl.formatMessage(messages.destinationAddrPlaceholder)}
              onChange={(e) => onValidateAddress({ address: e.target.value , index })}
              onKeyDown={onKeyDown}
            />
        }
      </div>
      {
        isSendSelf ? <div className="send-add-output-icon disabled"></div> :
          (
            !isSendAll && (index === 0 ?
              <div className="send-add-output-icon" onClick={onAddOutput}></div> :
              <div className="send-address-delete-icon" onClick={() => onRemoveOutput(index)}></div> )
          )
      }
    </div>
    <div className="send-row is-row">
      <div className="send-label amount-label">
        <span><T id="send.amount" m="Amount" />:</span>
      </div>
      <div className="is-column">
        {
          isSendAll ? <DcrInput
            className = "send-input"
            showErrors={true}
            disabled={true}
            amount={sendAllAmount}
            onKeyDown={onKeyDown}
            onChange={ (e) => onValidateAmount({ value: e.value , index, atomValue: e.atomValue }) }
          /> : <DcrInput
            className = "send-input"
            required={true}
            showErrors={error && error.amount}
            invalid={error && error.amount}
            invalidMessage={error && error.amount}
            amount={value}
            placeholder={intl.formatMessage(messages.amountPlaceholder)}
            onChange={ e => onValidateAmount({ value: e.value , index, atomValue: e.atomValue })}
            onKeyDown={onKeyDown}
          />
        }
      </div>
      {
        index===0 && (outputs.length > 1 ? <Tooltip text={<T id="send.sendAllTitle.disabled" m="Send all funds from selected account - Disabled"/>}>
          <a className="send-icon-wrapper wallet-icon disabled" />
        </Tooltip> : (!isSendAll ?
          <Tooltip text={<T id="send.sendAllTitle" m="Send all funds from selected account"/>}>
            <a className="send-icon-wrapper wallet-icon" onClick={onShowSendAll}/>
          </Tooltip> :
          <Tooltip text={<T id="send.cancelSendAllTitle" m="Cancel sending all funds"/>}>
            <a className="send-icon-wrapper cancel-icon" onClick={onHideSendAll}/>
          </Tooltip>
        ))}
    </div>
  </>
);

export default injectIntl(SendOutputRow);
