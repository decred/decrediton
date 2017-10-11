import React from "react";
import { Link } from "react-router";
import AccountsSelect from "../../../AccountsSelect";
import ReactTooltip from "react-tooltip";
import { defineMessages, FormattedMessage as T, injectIntl } from "react-intl";
import DecredLoading from "../../../DecredLoading";
import Balance from "../../../Balance";
import Header from "../../../Header";
import KeyBlueButton from "../../../KeyBlueButton";
import PassphraseModal from "../../../PassphraseModal";
import OutputRow from "./OutputRow";
import TabContent from "../../../TabbedPage/TabContent";
import "../../../../style/SendPage.less";
import "../../../../style/MiscComponents.less";

const messages = defineMessages({
  accountsTip: {
    id: "send.accounts.tip",
    defaultMessage: "Accounts",
  },
  sendAllTitle: {
    id: "send.sendAllTitle",
    defaultMessage: "Send all funds from selected account"
  },
  cancelSendAllTitle: {
    id: "send.cancelSendAllTitle",
    defaultMessage: "Cancel sending all funds"
  }
});

const SendPage = ({
                    isSendingTransaction,
                    isTestNet,
                    isShowingConfirm,
                    isSendAll,
                    outputs,
                    totalSpent,
                    estimatedFee,
                    estimatedSignedSize,
                    publishedTransactionHash,
                    isValid,
                    constructTxError,
                    signTransactionError,
                    publishTransactionError,
                    onClearPublishTxError,
                    onClearSignTxError,
                    onClearPublishTxSuccess,
                    onChangeAccount,
                    onAttemptSignTransaction,
                    onClearTransaction,
                    onShowConfirm,
                    onShowSendAll,
                    getAddressError,
                    getAmountError,
                    intl,
                    ...props
                  }) => (
  <TabContent>
    <PassphraseModal
        hidden={!isShowingConfirm}
        submitPassphrase={onAttemptSignTransaction}
        cancelPassphrase={onClearTransaction}
        heading={"Confirm Transaction"}
        description={<div>
          <T id="send.confirmAmountLabel" m="Please confirm your transaction for" />
          : <Balance amount={totalSpent} /></div>}
      />

    {(isSendingTransaction) ? (
      <DecredLoading />
    ) : (
        <div className={isShowingConfirm ? "tab-content-blur" : ""}>
          <div className="send-flex-height">
            <div className="send-select-account-area">
              <div className="send-label"><T id="send.from" m="From" />:</div>
              <div className="send-select-account-input">
                <AccountsSelect
                  onChange={onChangeAccount}
                />
              </div>
              <Link
                className="accounts-button-icon"
                data-place="bottom"
                data-type="info"
                data-effect="solid"
                data-tip={intl.formatMessage(messages.accountsTip)}
                to={"/accounts"}
              />
              <div className="send-send-all-input">
                {!isSendAll
                  ? <a className="send-all-wallet-icon" onClick={onShowSendAll} title={intl.formatMessage(messages.sendAllTitle)} ></a>
                  : <a className="send-all-cancel-wallet-icon" onClick={onClearTransaction} title={intl.formatMessage(messages.cancelSendAllTitle)} ></a>
                }
              </div>
            </div>
            <div className="send-amount-area">
              {outputs.map((output, index) => (
                <OutputRow
                  {...{ index, outputs, ...props, ...output, isSendAll, totalSpent }}
                  addressError={getAddressError(index)}
                  amountError={getAmountError(index)}
                />
              ))}
            </div>
          </div>
          <div className="send-button-area">
            <KeyBlueButton
              className="content-send"
              disabled={!isValid}
              onClick={onShowConfirm}
            ><T id="send.sendBtn" m="Send" /></KeyBlueButton>
            {constructTxError ? (
              <div className="send-construct-error">
                {constructTxError}
              </div>
            ) : null}
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
    )}
    < ReactTooltip />
  </TabContent>
);

export default injectIntl(SendPage);
