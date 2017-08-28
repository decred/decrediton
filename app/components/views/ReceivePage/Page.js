import React from "react";
import ReactTooltip from "react-tooltip";
import Select from "react-select";
import { Link } from "react-router";
import KeyBlueButton from "../../KeyBlueButton";
import SideBar from "../../SideBar";
import Header from "../../Header";
import CopyToClipboardButton from "../../CopyToClipboardButton";
import QRCode from "./QRCode";
import "../../../style/ReceivePage.less";
import "../../../style/MiscComponents.less";

const ReceivePage = ({
  account,
  visibleAccounts,
  nextAddress,
  onChangeAccountNumber,
  onRequestAddress
}) => (
  <div className="receive-body">
    <SideBar />
    <div className="receive-view">
      <Header
        headerTitleOverview={<div className="receive-header-title">Receive Funds</div>}
        headerMetaOverview={<div className="receive-header-meta">Each time you request a payment, create a new address to protect your privacy.</div>}
      />
      <div className="receive-content">
        <div className="receive-content-nest">
          <div className="receive-content-nest-for-address">
            <Link
              className="receive-accounts-button-icon"
              data-place="bottom"
              data-type="info"
              data-effect="solid"
              data-tip={"Accounts"}
              to={"/accounts"}
            />
            <div className="receive-content-nest-prefix">This address is for:</div>
            <div className="receive-select-account-input">
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
          <div className="receive-content-nest-qr">
            <div className="receive-content-nest-qrhash">
              <span key="addressSpan">{nextAddress}</span>
              <CopyToClipboardButton
                key="copyToClipboard"
                className="receive-content-nest-copy-to-clipboard-icon"
                textToCopy={nextAddress}
              />
            </div>
            <QRCode addr={nextAddress} />
            <div style={{clear: "both"}}></div>
          </div>
        </div>
        <div className="receive-toolbar">
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
