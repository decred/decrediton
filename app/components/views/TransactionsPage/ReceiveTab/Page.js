import React from "react";
import ReactTooltip from "react-tooltip";
import ReceiveAccountsSelect from "ReceiveAccountsSelect";
import { Link } from "react-router";
import { CopyToClipboard } from "shared";
import KeyBlueButton from "KeyBlueButton";
import QRCode from "./QRCode";
import { defineMessages, FormattedMessage as T, injectIntl } from "react-intl";
import "style/Layout.less";
import "style/ReceivePage.less";
import "style/MiscComponents.less";

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
  <div className="tab-content-wrapper">
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
    <ReactTooltip />
  </div>
);

export default injectIntl(ReceivePage);
