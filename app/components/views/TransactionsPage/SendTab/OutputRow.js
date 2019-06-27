import { compose } from "fp";
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
  index, destination, value, addressError, onAddOutput, onRemoveOutput,
  onValidateAmount, onValidateAddress, isSendAll, onKeyDown, sendAllAmount, error, intl,
  onShowSendAll, onHideSendAll, isSendSelf
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
              autoFocus={index == 0}
              showErrors={true}
              invalid={!!addressError}
              invalidMessage={addressError}
              value={destination}
              placeholder={intl.formatMessage(messages.destinationAddrPlaceholder)}
              onChange={(e) => onValidateAddress({ address: e.target.value , index })}
              onKeyDown={onKeyDown}
            />
        }
      </div>
      { !isSendAll && (index === 0 ?
          <div className="send-add-output-icon" onClick={onAddOutput}></div> :
          <div className="send-address-delete-icon" onClick={() => onRemoveOutput(index)}></div> )}
    </div>
    <div className="send-row is-row">
      <div className="send-label amount-label">
        <span><T id="send.amount" m="Amount" />:</span>
      </div>
      {
        isSendAll ? <DcrInput
          className = "send-input"
          showErrors={true}
          disabled={true}
          amount={sendAllAmount}
          onKeyDown={onKeyDown}
          onChange={ (e) => onValidateAmount(e.target.value, index) }
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
      {index===0 && (!isSendAll ?
        <Tooltip text={<T id="send.sendAllTitle" m="Send all funds from selected account"/>}>
          <a className="send-icon-wrapper wallet-icon" onClick={onShowSendAll}/>
        </Tooltip> :
        <Tooltip text={<T id="send.cancelSendAllTitle" m="Cancel sending all funds"/>}>
          <a className="send-icon-wrapper cancel-icon" onClick={onHideSendAll}/>
        </Tooltip>
      )}
    </div>
  </>
);

export default injectIntl(SendOutputRow);
