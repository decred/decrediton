import React from "react";
import ReactTooltip from "react-tooltip";
import Select from "react-select";
import { Link } from "react-router";
import KeyBlueButton from "../../KeyBlueButton";
import SideBar from "../../SideBar";
import Header from "../../Header";
import CopyToClipboardButton from "../../CopyToClipboardButton";
import { ReceiveStyles } from "../ViewStyles";
import QRCode from "./QRCode";
import "../../../style/MiscComponents.less";

const ReceivePage = ({
  account,
  visibleAccounts,
  nextAddress,
  onChangeAccountNumber,
  onRequestAddress
}) => (
  <div style={ReceiveStyles.body}>
    <SideBar />
    <div style={ReceiveStyles.view}>
      <Header
        headerTitleOverview={<div style={ReceiveStyles.headerTitleReceive}>Receive Funds</div>}
        headerMetaOverview={<div style={ReceiveStyles.headerMetaReceive}>Each time you request a payment, create a new address to protect your privacy.</div>}
      />
      <div style={ReceiveStyles.content}>
        <div style={ReceiveStyles.contentNestReceive}>
          <div style={ReceiveStyles.contentNestReceiveForAddress}>
            <Link
              className="accounts-button-icon"
              data-place="bottom"
              data-type="info"
              data-effect="solid"
              data-tip={"Accounts"}
              to={"/accounts"}
            />
            <div style={ReceiveStyles.contentNestPrefixReceive}>This address is for:</div>
            <div style={ReceiveStyles.receiveSelectAccountInput}>
              <Select
                clearable={false}
                style={{zIndex:"9"}}
                onChange={onChangeAccountNumber}
                placeholder={"Select account..."}
                multi={false}
                value={account}
                valueKey="value" labelKey="label"
                options={visibleAccounts}
              />
            </div>
            <div style={{clear: "both"}}></div>
          </div>
          <div style={ReceiveStyles.contentNestQR}>
            <div style={ReceiveStyles.contentNestQRHash}>
              <span key="addressSpan">{nextAddress}</span>
              <CopyToClipboardButton
                key="copyToClipboard"
                style={ReceiveStyles.contentNestCopyToClipboardIcon}
                textToCopy={nextAddress}
              />
            </div>
            <QRCode addr={nextAddress} />
            <div style={{clear: "both"}}></div>
          </div>
        </div>
        <div style={ReceiveStyles.contentReceive}>
          <KeyBlueButton size="large" block={false} onClick={onRequestAddress}>
            Generate new address
          </KeyBlueButton>
        </div>
      </div>
      <ReactTooltip />
    </div>
  </div>
);

export default ReceivePage;
