import React from "react";
import ReceiveAccountsSelect from "../../ReceiveAccountsSelect";
import { Link } from "react-router";
import KeyBlueButton from "../../KeyBlueButton";
import Header from "../../Header";
import CopyToClipboardButton from "../../CopyToClipboardButton";
import QRCode from "./QRCode";
import { Tooltip } from "shared";
import { FormattedMessage as T } from "react-intl";
import "style/Layout.less";
import "style/ReceivePage.less";
import "style/MiscComponents.less";

const ReceivePage = ({
                       nextAddress,
                       onRequestAddress,
                     }) => (
  <div className="page-view">
    <Header
      headerTitleOverview={<div className="receive-header-title">
        <T id="receive.title" m="Receive Funds" />
      </div>}
      headerMetaOverview={<div className="receive-header-meta">
        <T id="receive.titleInfo" m="Each time you request a payment, create a new address to protect your privacy." />
      </div>}
    />
    <div className="page-content">
      <div className="receive-content-nest">
        <div className="receive-content-nest-for-address">
          <Tooltip text={ <T id="receive.accounts.tip" m="Accounts" /> }>
            <Link to={"/accounts"} className="receive-accounts-button-icon" />
          </Tooltip>
          <div className="receive-content-nest-prefix">
            <T id="receive.accountLabel" m="This address is for" />:
          </div>
          <div className="receive-select-account-input">
            <ReceiveAccountsSelect />
          </div>
          <div style={{ clear: "both" }}></div>
        </div>
        <div className="receive-content-nest-qr">
          <div className="receive-content-nest-qrhash">
            <span key="addressSpan">{nextAddress}</span>
            <CopyToClipboardButton textToCopy={nextAddress} className="receive-content-nest-copy-to-clipboard-icon" />
          </div>
          <QRCode addr={nextAddress} />
          <div style={{ clear: "both" }}></div>
        </div>
      </div>
      <div className="receive-toolbar">
        <KeyBlueButton size="large" block={false} onClick={onRequestAddress}>
          <T id="receive.newAddressBtn" m="Generate new address" />
        </KeyBlueButton>
      </div>
    </div>
  </div>
);

export default ReceivePage;
