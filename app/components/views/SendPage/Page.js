import React from "react";
import { Link } from "react-router";
import Select from "react-select";
import ReactTooltip from "react-tooltip";
import DecredLoading from "../../DecredLoading";
import SideBar from "../../SideBar";
import Balance from "../../Balance";
import Header from "../../Header";
import KeyBlueButton from "../../KeyBlueButton";
import PassphraseModal from "../../PassphraseModal";
import OutputRow from "./OutputRow";
import "../../../style/SendPage.less";
import "../../../style/MiscComponents.less";

const SendPage = ({
  isSendingTransaction,
  isTestNet,
  isShowingConfirm,
  account,
  spendingAccounts,
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
  getAddressError,
  getAmountError,
  ...props
}) => (
  <div className="send-body">
    <SideBar />
    <div className="send-view">
      <Header
        headerTitleOverview={<div className="header-title-send">Send Funds</div>}
        headerMetaOverview={isTestNet ? (
          <div className="header-meta-send">Testnet Decred addresses always begin with letter T and contain 26-35 alphanumeric characters (e.g. <span className="send-styles.header-meta-span-send">TxxXXXXXxXXXxXXXXxxx0XxXXXxxXxXxX0X</span>).</div>
        ) : (
          <div className="header-meta-send">Mainnet Decred addresses always begin with letter D and contain 26-35 alphanumeric characters (e.g. <span className="send-styles.header-meta-span-send">DxxXXXXXxXXXxXXXXxxx0XxXXXxxXxXxX0X</span>).</div>
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
        <div className="send-content"><DecredLoading/></div>
      ) : (
        <div>
          <PassphraseModal
            hidden={!isShowingConfirm}
            submitPassphrase={onAttemptSignTransaction}
            cancelPassphrase={onClearTransaction}
            heading={"Confirm Transaction"}
            description={<div>Please confirm your transaction for <Balance amount={totalSpent}/></div>}
          />
          <div className={!isShowingConfirm ? "send-content" : "send-content-blur"}>
            <div className="send-flex-height">
              <div className="send-select-account-area">
                <div className="send-label">From:</div>
                <div className="send-select-account-input">
                  <Select
                    clearable={false}
                    style={{zIndex:"9"}}
                    onChange={onChangeAccount}
                    placeholder={"Select account..."}
                    multi={false}
                    value={account}
                    valueKey="value" labelKey="label"
                    options={spendingAccounts}
                  />
                </div>
                <Link
                  className="send-accounts-button-icon"
                  data-place="bottom"
                  data-type="info"
                  data-effect="solid"
                  data-tip={"Accounts"}
                  to={"/accounts"}
                />
              </div>
              <div id="dynamicInput">
                {outputs.map((output, index) => (
                  <OutputRow
                    {...{ index, outputs, ...props, ...output }}
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
              >Send</KeyBlueButton>
              {constructTxError ? (
                <span style={{color: "red", width: "330px", float: "left", paddingLeft: "20px", paddingTop: "30px"}}>
                  {constructTxError}
                </span>
              ) : null}
              <div className="estimation-area-send">
                <div className="total-amount-send">
                  <div className="total-amount-send-text">Total amount sending:</div>
                  <div className="total-amount-send-amount">
                    <Balance amount={totalSpent}/>
                  </div>
                </div>
                <div className="total-amount-send">
                  <div className="total-amount-send-text">Estimated Fee:</div>
                  <div className="total-amount-send-amount">
                    <Balance amount={estimatedFee} />
                  </div>
                </div>
                <div className="total-amount-send">
                  <div className="total-amount-send-text">Estimated Size:</div>
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

export default SendPage;
