import { AccountsSelect } from "inputs";
import { FormattedMessage as T } from "react-intl";
import { Balance, Tooltip, TransitionMotionWrapper } from "shared";
import { SendTransactionButton } from "buttons";
import { CopyToClipboard } from "shared";
import OutputAccountRow from "./OutputAccountRow";
import "style/SendPage.less";
import "style/MiscComponents.less";

const wrapperComponent = props => <div className="output-row" { ...props } />;

const SendPage = ({
  account,
  isSendAll,
  isSendSelf,
  outputs,
  totalSpent,
  estimatedFee,
  estimatedSignedSize,
  isValid,
  onChangeAccount,
  onAttemptSignTransaction,
  onShowSendAll,
  onHideSendAll,
  onShowSendSelf,
  onShowSendOthers,
  getAmountError,
  getStyles,
  willLeave,
  willEnter,
  nextAddressAccount,
  onKeyDown,
  showPassphraseModal,
  resetShowPassphraseModal,
  unsignedRawTx,
  isWatchingOnly,
  isTrezor,
  ...props
}) => (
  <Aux>
    <div className="tabbed-page-subtitle"><T id="send.subtitle" m="Send DCR"/></div>
    <div className="send-flex-height">
      <div className="send-select-account-area">
        <div className="send-label"><T id="send.from" m="From" />:</div>
        <AccountsSelect className="send-select-account-input"
          {...{ account }} onChange={onChangeAccount} showAccountsButton={true} onKeyDown={onKeyDown}/>
        <div className="send-send-all-input">
          {!isSendSelf ?
            <Tooltip text={<T id="send.sendSelfTitle" m="Send funds to another account"/>}>
              <a className="send-self-wallet-icon" onClick={onShowSendSelf}/>
            </Tooltip> :
            <Tooltip text={<T id="send.sendOthersTitle" m="Send funds to another wallet"/>} >
              <a className="send-others-wallet-icon" onClick={onShowSendOthers}/>
            </Tooltip>
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
      </div>
      <div className="send-amount-area">
        {
          !isSendSelf
            ? <TransitionMotionWrapper {...{ styles: getStyles(), willLeave, willEnter, wrapperComponent }} />
            : <OutputAccountRow
              {...{ index: 0, ...props, ...outputs[0].data, isSendAll, totalSpent, onKeyDown }}
              amountError={getAmountError(0)} />
        }
      </div>
    </div>
    <div className="send-button-area">
      { ( (isTrezor && isWatchingOnly) || !isWatchingOnly ) &&
        <SendTransactionButton
          disabled={!isValid}
          showModal={showPassphraseModal}
          onShow={resetShowPassphraseModal}
          onSubmit={onAttemptSignTransaction} >
          <div className="passphrase-modal-confirm-send">
            {!isSendSelf ?
              <Aux>
                <div className="passphrase-modal-confirm-send-label">{outputs.length > 1 ? <T id="send.confirmAmountAddresses" m="Destination addresses" /> : <T id="send.confirmAmountAddress" m="Destination address" /> }:</div>
                {outputs.map((output, index) => {
                  return (
                    <div className="passphrase-modal-confirm-send-address" key={"confirm-" + index}>{output.data.destination}</div>
                  );}
                )}
              </Aux> :
              <Aux>
                <div className="passphrase-modal-confirm-send-label"><T id="send.confirmAmountAccount" m="Destination account" />:</div>
                <div className="passphrase-modal-confirm-send-address">{nextAddressAccount.name}</div>
              </Aux>
            }
            <div className="passphrase-modal-confirm-send-label"><T id="send.confirmAmountLabelFor" m="Total Spent" />:</div>
            <div className="passphrase-modal-confirm-send-balance"><Balance amount={totalSpent} /></div>
          </div>
        </SendTransactionButton>
      }
      <div className="estimation-area-send">
        <div className="total-amount-send">
          <div className="total-amount-send-text">
            <T id="send.totalAmountEstimation" m="Total amount sending" />
                :
          </div>
          <div className="total-amount-send-amount">
            <Balance flat amount={totalSpent} />
          </div>
        </div>
        <div className="total-amount-send">
          <div className="total-amount-send-text">
            <T id="send.feeEstimation" m="Estimated Fee" />
                :
          </div>
          <div className="total-amount-send-amount">
            <Balance flat amount={estimatedFee} />
          </div>
        </div>
        <div className="total-amount-send">
          <div className="total-amount-send-text">
            <T id="send.sizeEstimation" m="Estimated Size" />
                :
          </div>
          <div className="total-amount-send-amount">{estimatedSignedSize}<span className="total-amount-send-amount-bytes"> bytes</span></div>
        </div>
      </div>
    </div>
    {
      unsignedRawTx && isWatchingOnly && !isTrezor &&
        (
          <div className="unsigned-raw-tx-area">
            <div className="unsigned-raw-tx-title"><T id="send.unsignedRawTxTite" m="Unsigned Raw Transaction:" /></div>
            <div className="unsigned-raw-tx">
              {unsignedRawTx}
            </div>
            <CopyToClipboard textToCopy={unsignedRawTx} className="unsigned-raw-tx-copy-to-clipboard-icon" />
          </div>
        )
    }
  </Aux>
);

export default SendPage;
