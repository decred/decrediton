import AccountsSelect from "../../../AccountsSelect";
import { defineMessages, FormattedMessage as T, injectIntl } from "react-intl";
import DecredLoading from "../../../DecredLoading";
import Balance from "../../../Balance";
import KeyBlueButton from "../../../KeyBlueButton";
import PassphraseModal from "../../../PassphraseModal";
import OutputRow from "./OutputRow";
import OutputAccountRow from "./OutputAccountRow";
import "style/SendPage.less";
import "style/MiscComponents.less";

const messages = defineMessages({
  sendAllTitle: {
    id: "send.sendAllTitle",
    defaultMessage: "Send all funds from selected account"
  },
  cancelSendAllTitle: {
    id: "send.cancelSendAllTitle",
    defaultMessage: "Cancel sending all funds"
  },
  sendSelfTitle: {
    id: "send.sendSelfTitle",
    defaultMessage: "Send funds to another account"
  },
  sendOthersTitle: {
    id: "send.sendOthersTitle",
    defaultMessage: "Send funds to another wallet"
  }
});

const SendPage = ({
                    account,
                    isSendingTransaction,
                    isShowingConfirm,
                    isSendAll,
                    isSendSelf,
                    outputs,
                    totalSpent,
                    estimatedFee,
                    estimatedSignedSize,
                    isValid,
                    onChangeAccount,
                    onChangeOutputAccount,
                    onAttemptSignTransaction,
                    onClearTransaction,
                    onShowConfirm,
                    onShowSendAll,
                    onHideSendAll,
                    onShowSendSelf,
                    onShowSendOthers,
                    getAddressError,
                    getAmountError,
                    intl,
                    ...props
                  }) => (
  <Aux>
    <PassphraseModal
        hidden={!isShowingConfirm}
        submitPassphrase={onAttemptSignTransaction}
        cancelPassphrase={onClearTransaction}
        heading={"Confirm Transaction"}
        description={<div>
          <T id="send.confirmAmountLabel" m="Please confirm your transaction for" />
          : <Balance amount={totalSpent} /></div>}
      />
      { isSendingTransaction ? <DecredLoading /> :
      <div className={ ["tab-card", isShowingConfirm ? "tab-card-blur" : null].join(" ").trim() }>
        <div className="send-flex-height">
          <div className="send-select-account-area">
            <div className="send-label"><T id="send.from" m="From" />:</div>
            <AccountsSelect className="send-select-account-input"
              {...{account}} onChange={onChangeAccount} showAccountsButton={true} />
            <div className="send-send-all-input">
              {!isSendSelf
                ? <a className="send-self-wallet-icon" onClick={onShowSendSelf} title={intl.formatMessage(messages.sendSelfTitle)} />
                : <a className="send-others-wallet-icon" onClick={onShowSendOthers} title={intl.formatMessage(messages.sendOthersTitle)} />
              }
              {!isSendAll
                ? <a className="send-all-wallet-icon" onClick={onShowSendAll} title={intl.formatMessage(messages.sendAllTitle)} />
                : <a className="send-all-cancel-wallet-icon" onClick={onHideSendAll} title={intl.formatMessage(messages.cancelSendAllTitle)} />
              }
            </div>
          </div>
          <div className="send-amount-area">
            {!isSendSelf
              ? outputs.map((output, index) => (
                <OutputRow
                  {...{ index, outputs, ...props, ...output, isSendAll, totalSpent }}
                  addressError={getAddressError(index)}
                  amountError={getAmountError(index)}
                /> ))
              : <OutputAccountRow
                {...{  index: 0, ...props, isSendAll, totalSpent, onChangeOutputAccount }}
                amountError={getAmountError(0)} />
            }
          </div>
        </div>
        <div className="send-button-area">
          <KeyBlueButton
            className="content-send"
            disabled={!isValid}
            onClick={onShowConfirm}
          ><T id="send.sendBtn" m="Send" /></KeyBlueButton>
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
            <div className="total-amount-send-amount">{estimatedSignedSize} bytes</div>
          </div>
        </div>
      </div> }
  </Aux>
);

export default injectIntl(SendPage);
