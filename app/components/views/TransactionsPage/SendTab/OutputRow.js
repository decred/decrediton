import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { AccountsSelect, AddressInput, DcrInput, ReceiveAccountsSelect } from "inputs";
import { Tooltip, Balance } from "shared";
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
  onShowSendAll, onHideSendAll, isSendSelf, outputs, onChangeAccount, onShowSendSelf,
  account, onShowSendOthers, 
}) => (
  <div className="is-row">
    <div>
      { index === 0 &&
        <div className="send-label"><T id="send.from" m="From" />:</div>
      }
      <div className="send-label"><span><T id="send.to" m="To" />:</span></div>
      <div className="send-label"><span><T id="send.amount" m="Amount" />:</span></div>
    </div>
    <div>
      { index===0 &&
        <AccountsSelect className="send-input"
          {...{ account }} onChange={onChangeAccount} onKeyDown={onKeyDown}/>
      }
      { isSendSelf ?
          <ReceiveAccountsSelect
            getAddressForSelected={true}
            showAccountsButton={false}
            onKeyDown={onKeyDown}
            className="send-input"
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
            className="send-input"
          />
      }
      { isSendAll ?
        <Balance flat amount={sendAllAmount} classNameWrapper="send-input send-all" />
        : <DcrInput
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
    <div>
      { index === 0  && (!isSendSelf ?
        <Tooltip text={<T id="send.sendSelfTitle" m="Send funds to another account"/>}>
          <a className="send-icon-wrapper self-account-icon" onClick={onShowSendSelf}/>
        </Tooltip> :
        <Tooltip text={<T id="send.sendOthersTitle" m="Send funds to another wallet"/>} >
          <a className="send-icon-wrapper cancel-icon " onClick={onShowSendOthers}/>
        </Tooltip>)
      }
      { isSendSelf ? <div className="send-icon-wrapper add disabled"></div> :
      (!isSendAll && (index === 0 ?
        <div className="send-icon-wrapper add" onClick={onAddOutput}></div> :
        <div className="send-icon-wrapper delete" onClick={() => onRemoveOutput(index)}></div> 
      ))}
      { index===0 && (outputs.length > 1 ?
        <Tooltip text={<T id="send.sendAllTitle.disabled" m="Send all funds from selected account - Disabled"/>}>
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
  </div>
);

export default injectIntl(SendOutputRow);
