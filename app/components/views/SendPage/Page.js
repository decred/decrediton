import React from "react";
import { Link } from "react-router";
import AccountsSelect from "../../AccountsSelect";
import ReactTooltip from "react-tooltip";
import { FormattedMessage, injectIntl, defineMessages } from "react-intl";
import DecredLoading from "../../DecredLoading";
import SideBar from "../../SideBar";
import Balance from "../../Balance";
import Header from "../../Header";
import KeyBlueButton from "../../KeyBlueButton";
import PassphraseModal from "../../PassphraseModal";
import OutputRow from "./OutputRow";
import "../../../style/SendPage.less";
import "../../../style/MiscComponents.less";

const messages = defineMessages({
  accountsTip: {
    id: "send.accounts.tip",
    defaultMessage: "Accounts"
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
  <div className="page-body">
    <SideBar />
    <div className="page-view">
      <Header
        headerTitleOverview={<div className="header-title-send">
          <FormattedMessage id="send.title" defaultMessage="Send Funds" /></div>}
        headerMetaOverview={isTestNet ? (
          <div className="header-meta-send">
            <FormattedMessage id="send.testnetInfo"
              defaultMessage="Testnet Decred addresses always begin with letter T and contain 26-35 alphanumeric characters (e.g. TxxXXXXXxXXXxXXXXxxx0XxXXXxxXxXxX0)." />
          </div>
        ) : (
          <div className="header-meta-send">
            <FormattedMessage id="send.mainnetInfo" defaultMessage="Mainnet Decred addresses always begin with letter D and contain 26-35 alphanumeric characters (e.g. DxxXXXXXxXXXxXXXXxxx0XxXXXxxXxXxX0X)." />
          </div>
        )}
        headerTop={[
          publishTransactionError ? (
            <div key="pubError" className="send-view-notification-error">
              <div className="send-address-delete-icon-header" onClick={onClearPublishTxError}/>
              {publishTransactionError}
            </div>
          ) : null,
          signTransactionError ? (
            <div key="signError" className="send-view-notification-error">
              <div className="send-address-delete-icon-header" onClick={onClearSignTxError}/>
              {signTransactionError}
            </div>
          ) : null,
          publishedTransactionHash ? (
            <div key="pubSuccess" className="send-view-notification-success">
              <div className="send-address-delete-icon-header" onClick={onClearPublishTxSuccess}/>
              Published Tx: {publishedTransactionHash}
            </div>
          ) : null
        ]}
      />
      {(isSendingTransaction) ? (
        <div className="page-content"><DecredLoading/></div>
      ) : (
        <div>
          <PassphraseModal
            hidden={!isShowingConfirm}
            submitPassphrase={onAttemptSignTransaction}
            cancelPassphrase={onClearTransaction}
            heading={"Confirm Transaction"}
            description={<div>
              <FormattedMessage id="send.confirmAmountLabel" defaultMessage="Please confirm your transaction for" />
              : <Balance amount={totalSpent}/></div>}
          />
          <div className={!isShowingConfirm ? "page-content" : "page-content-blur"}>
            <div className="send-flex-height">
              <div className="send-select-account-area">
                <div className="send-label"><FormattedMessage id="send.from" defaultMessage="From" />:</div>
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
                {!isSendAll ?
                <a onClick={onShowSendAll}><FormattedMessage id="send.sendAllBtn" defaultMessage="Send All" /></a> :
                <a onClick={onClearTransaction}><FormattedMessage id="send.cancelSendAll" defaultMessage="Close" /></a>  }
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
              ><FormattedMessage id="send.sendBtn" defaultMessage="Send" /></KeyBlueButton>
              {constructTxError ? (
                <div className="send-construct-error">
                  {constructTxError}
                </div>
              ) : null}
              <div className="estimation-area-send">
                <div className="total-amount-send">
                  <div className="total-amount-send-text">
                    <FormattedMessage id="send.totalAmountEstimation" defaultMessage="Total amount sending" />
                    :</div>
                  <div className="total-amount-send-amount">
                    <Balance amount={totalSpent}/>
                  </div>
                </div>
                <div className="total-amount-send">
                  <div className="total-amount-send-text">
                    <FormattedMessage id="send.feeEstimation" defaultMessage="Estimated Fee" />
                    :</div>
                  <div className="total-amount-send-amount">
                    <Balance amount={estimatedFee} />
                  </div>
                </div>
                <div className="total-amount-send">
                  <div className="total-amount-send-text">
                    <FormattedMessage id="send.sizeEstimation" defaultMessage="Estimated Size" />
                    :</div>
                  <div className="total-amount-send-amount">{estimatedSignedSize} bytes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    <ReactTooltip />
  </div>
);

export default injectIntl(SendPage);
