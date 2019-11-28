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

const getSendAllFundsIcon = ({ isSendAll, onShowSendAll, onHideSendAll, outputs }) => outputs.length > 1 ?
  (<Tooltip text={<T id="send.sendAllTitle.disabled" m="Send all funds from selected account - Disabled"/>}>
    <a className="send-icon-wrapper wallet-icon disabled" />
  </Tooltip>) :
  (!isSendAll ?
    <Tooltip text={<T id="send.sendAllTitle" m="Send all funds from selected account"/>}>
      <a className="send-icon-wrapper wallet-icon" onClick={onShowSendAll}/>
    </Tooltip> :
    <Tooltip text={<T id="send.cancelSendAllTitle" m="Cancel sending all funds"/>}>
      <a className="send-icon-wrapper cancel-icon" onClick={onHideSendAll}/>
    </Tooltip>);

const getAddInputIcon = ({ isSendSelf, onAddOutput, onRemoveOutput, index, isSendAll }) => isSendSelf ?
  <div className="send-icon-wrapper add disabled"></div> :
  (!isSendAll && (index === 0 ?
    <div className="send-icon-wrapper add" onClick={onAddOutput}></div> :
    <div className="send-icon-wrapper delete" onClick={() => onRemoveOutput(index)}></div>
  ));

const getSendSelfIcon = ({ isSendSelf, onShowSendSelf, onShowSendOthers }) => !isSendSelf ?
  <Tooltip text={<T id="send.sendSelfTitle" m="Send funds to another account"/>}>
    <a className="send-icon-wrapper self-account-icon" onClick={onShowSendSelf}/>
  </Tooltip> :
  <Tooltip text={<T id="send.sendOthersTitle" m="Send funds to another wallet"/>} >
    <a className="send-icon-wrapper cancel-icon " onClick={onShowSendOthers}/>
  </Tooltip>;

const SendOutputRow = ({
  index, destination, amount, onAddOutput, onRemoveOutput,
  onValidateAmount, onValidateAddress, isSendAll, onKeyDown, sendAllAmount, error, intl,
  onShowSendAll, onHideSendAll, isSendSelf, outputs, onChangeAccount, onShowSendSelf,
  account, onShowSendOthers
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
        <div className="send-input-wrapper"><AccountsSelect className="send-input"
          {...{ account }} onChange={onChangeAccount} onKeyDown={onKeyDown}/></div>
      }
      <div className="send-input-wrapper">
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
      </div>
      <div className="send-input-wrapper">
        { isSendAll ?
          <Balance flat amount={sendAllAmount} classNameWrapper="send-input send-all" />
          : <DcrInput
            className = "send-input"
            required={true}
            showErrors={error && error.amount}
            invalid={error && error.amount}
            invalidMessage={error && error.amount}
            amount={amount}
            placeholder={intl.formatMessage(messages.amountPlaceholder)}
            onChangeAmount={ e => onValidateAmount({ index, atomValue: e.atomValue })}
            onKeyDown={onKeyDown}
          />
        }
      </div>
    </div>
    <div className="is-column">
      { index === 0 && getSendSelfIcon({ isSendSelf, onShowSendSelf, onShowSendOthers }) }
      { getAddInputIcon({ isSendSelf, onAddOutput, onRemoveOutput, index, isSendAll }) }
      { index===0 && getSendAllFundsIcon({ isSendAll, onShowSendAll, onHideSendAll, outputs })}
    </div>
  </div>
);

export default injectIntl(SendOutputRow);
