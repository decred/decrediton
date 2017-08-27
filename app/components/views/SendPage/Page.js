import React from "react";
import { Link } from "react-router";
import Select from "react-select";
import ReactTooltip from "react-tooltip";
import DecredLoading from "../../DecredLoading";
import SideBar from "../../SideBar";
import Balance from "../../Balance";
import Header from "../../Header";
import KeyBlueButton from "../../KeyBlueButton";
import { SendStyles } from "../ViewStyles";
import PassphraseModal from "../../PassphraseModal";
import OutputRow from "./OutputRow";
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
  publishTransactionResponse,
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
  <div style={SendStyles.body}>
    <SideBar />
    <div style={SendStyles.view}>
      <Header
        headerTitleOverview={<div style={SendStyles.headerTitleSend}>Send Funds</div>}
        headerMetaOverview={isTestNet ? (
          <div style={SendStyles.headerMetaSend}>Testnet Decred addresses always begin with letter T contain 26-35 alphanumeric characters e.g. <span style={SendStyles.headerMetaSpanSend}>TxxXXXXXxXXXxXXXXxxx0XxXXXxxXxXxX0X</span>.</div>
        ) : (
          <div style={SendStyles.headerMetaSend}>Mainnet Decred addresses always begin with letter D contain 26-35 alphanumeric characters e.g. <span style={SendStyles.headerMetaSpanSend}>DxxXXXXXxXXXxXXXXxxx0XxXXXxxXxXxX0X</span>.</div>
        )}
        headerTop={[
          publishTransactionError ? (
            <div key="pubError" style={SendStyles.viewNotificationError}>
              <div style={SendStyles.sendAddressDeleteIconHeader} onClick={onClearPublishTxError}/>
              {publishTransactionError}
            </div>
          ) : null,
          signTransactionError ? (
            <div key="signError"  style={SendStyles.viewNotificationError}>
              <div style={SendStyles.sendAddressDeleteIconHeader} onClick={onClearSignTxError}/>
              {signTransactionError}
            </div>
          ) : null,
          publishTransactionResponse ? (
            <div key="pubSuccess"  style={SendStyles.viewNotificationSuccess}>
              <div style={SendStyles.sendAddressDeleteIconHeader} onClick={onClearPublishTxSuccess}/>
              Published Tx: {publishedTransactionHash}
            </div>
          ) : null
        ]}
      />
      {(isSendingTransaction) ? (
        <div style={SendStyles.content}><DecredLoading/></div>
      ) : (
        <div>
          <PassphraseModal
            hidden={!isShowingConfirm}
            submitPassphrase={onAttemptSignTransaction}
            cancelPassphrase={onClearTransaction}
            heading={"Confirm Transaction"}
            description={<div>Please confirm your transaction for <Balance amount={totalSpent}/></div>}
          />
          <div style={!isShowingConfirm ? SendStyles.content : SendStyles.contentBlur}>
            <div style={SendStyles.flexHeight}>
              <div style={SendStyles.sendSelectAccountArea}>
                <div style={SendStyles.sendLabel}>From:</div>
                <div style={SendStyles.sendSelectAccountInput}>
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
                  className="accounts-button-icon"
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
            <div style={SendStyles.sendButtonArea}>
              <KeyBlueButton
                style={SendStyles.contentSend}
                disabled={!isValid}
                onClick={onShowConfirm}
              >Send</KeyBlueButton>
              {constructTxError ? (
                <span style={{color: "red", width: "330px", float: "left", paddingLeft: "20px", paddingTop: "30px"}}>
                  {constructTxError}
                </span>
              ) : null}
              <div style={SendStyles.estimationAreaSend}>
                <div style={SendStyles.totalAmountSend}>
                  <div style={SendStyles.totalAmountSendText}>Total amount sending:</div>
                  <div style={SendStyles.totalAmountSendAmount}>
                    <Balance amount={totalSpent}/>
                  </div>
                </div>
                <div style={SendStyles.totalAmountSend}>
                  <div style={SendStyles.totalAmountSendText}>Estimated Fee:</div>
                  <div style={SendStyles.totalAmountSendAmount}>
                    <Balance amount={estimatedFee} />
                  </div>
                </div>
                <div style={SendStyles.totalAmountSend}>
                  <div style={SendStyles.totalAmountSendText}>Estimated Size:</div>
                  <div style={SendStyles.totalAmountSendAmount}>{estimatedSignedSize} bytes</div>
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
