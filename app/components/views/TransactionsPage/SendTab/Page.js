import { AccountsSelect } from "inputs";
import { FormattedMessage as T } from "react-intl";
import { Tooltip } from "shared";
import Balance from "Balance";
import PassphraseModalButton from "PassphraseModalButton";
import OutputAccountRow from "./OutputAccountRow";
import "style/SendPage.less";
import "style/MiscComponents.less";
import TransitionMotionWrapper from "TransitionMotionWrapper";

const wrapperComponent = props => <div className="output-row" { ...props } />;

const SendPage = ({
                    account,
  isSendingTransaction,
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
  ...props
                  }) => (
    <Aux>
      <div className="tab-card">
        <div className="send-flex-height">
          <div className="send-select-account-area">
            <div className="send-label"><T id="send.from" m="From" />:</div>
            <AccountsSelect className="send-select-account-input"
              {...{account}} onChange={onChangeAccount} showAccountsButton={true} />
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
                    {...{ index: 0, ...props, ...outputs[0], isSendAll, totalSpent }}
                    amountError={getAmountError(0)} />
              }
            </div>
          </div>
          <div className="send-button-area">
            <PassphraseModalButton
                modalTitle={<T id="send.sendConfirmations" m="Transaction Confirmation" />}
                modalDescription={<Aux><T id="send.confirmAmountLabel" m="Please confirm your transaction for" />:  <Balance amount={totalSpent} /></Aux>}
                disabled={!isValid}
                className="content-send"
                onSubmit={onAttemptSignTransaction}
                loading={isSendingTransaction}
            >
              <T id="send.sendBtn" m="Send" />
            </PassphraseModalButton>
            <div className="estimation-area-send">
              <div className="total-amount-send">
                <div className="total-amount-send-text">
                  <T id="send.totalAmountEstimation" m="Total amount sending" />
                  :
              </div>
                <div className="total-amount-send-amount">
                  <Balance amount={totalSpent} />
                </div>
              </div>
              <div className="total-amount-send">
                <div className="total-amount-send-text">
                  <T id="send.feeEstimation" m="Estimated Fee" />
                  :
              </div>
                <div className="total-amount-send-amount">
                  <Balance amount={estimatedFee} />
                </div>
              </div>
              <div className="total-amount-send">
                <div className="total-amount-send-text">
                  <T id="send.sizeEstimation" m="Estimated Size" />
                  :
              </div>
                <div className="total-amount-send-amount">{estimatedSignedSize} bytes</div>
              </div>
            </div>
          </div>
        </div>
    </Aux>
  );

export default SendPage;
