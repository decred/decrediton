import React from "react";
import TabContent from "../../../TabbedPage/TabContent";
import ReactTooltip from "react-tooltip";
import ReceiveAccountsSelect from "../../../ReceiveAccountsSelect";
import { Link } from "react-router";
import KeyBlueButton from "../../../KeyBlueButton";
import CopyToClipboardButton from "../../../CopyToClipboardButton";
import QRCode from "./QRCode";
import { FormattedMessage as T } from "react-intl";
import "style/Layout.less";
import "style/ReceivePage.less";
import "style/MiscComponents.less";

const ReceivePage = ({
                       nextAddress,
                       onRequestAddress,
                     }) => (
  <TabContent>
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
          <CopyToClipboardButton
            key="copyToClipboard"
            className="receive-content-nest-copy-to-clipboard-icon"
            textToCopy={nextAddress}
          />
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
  </TabContent>
);

export default ReceivePage;
