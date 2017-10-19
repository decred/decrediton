import React from "react";
import ReactTooltip from "react-tooltip";
import ReceiveAccountsSelect from "../../ReceiveAccountsSelect";
import { Link } from "react-router";
import KeyBlueButton from "../../KeyBlueButton";
import Header from "../../Header";
import { CopyToClipboard } from "shared";
import QRCode from "./QRCode";
import { defineMessages, FormattedMessage as T, injectIntl } from "react-intl";
import "../../../style/Layout.less";
import "../../../style/ReceivePage.less";
import "../../../style/MiscComponents.less";

const messages = defineMessages({
  accountsTip: {
    id: "receive.accounts.tip",
    defaultMessage: "Accounts",
  },
});

const ReceivePage = ({
                       nextAddress,
                       intl,
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
          <Link
            className="receive-accounts-button-icon"
            data-place="bottom"
            data-type="info"
            data-effect="solid"
            data-tip={intl.formatMessage(messages.accountsTip)}
            to={"/accounts"}
          />
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
            <CopyToClipboard textToCopy={nextAddress} className="receive-content-nest-copy-to-clipboard-icon" />
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
    <ReactTooltip />
  </div>
);

export default injectIntl(ReceivePage);
