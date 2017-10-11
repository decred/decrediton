import React from "react";
import TabContent from "../../../TabbedPage/TabContent";
import ReactTooltip from "react-tooltip";
import AccountsSelect from "../../../AccountsSelect";
import { Link } from "react-router";
import KeyBlueButton from "../../../KeyBlueButton";
import Header from "../../../Header";
import CopyToClipboardButton from "../../../CopyToClipboardButton";
import QRCode from "./QRCode";
import { defineMessages, FormattedMessage as T, injectIntl } from "react-intl";
import "../../../../style/Layout.less";
import "../../../../style/ReceivePage.less";
import "../../../../style/MiscComponents.less";

const messages = defineMessages({
  accountsTip: {
    id: "receive.accounts.tip",
    defaultMessage: "Accounts",
  },
});

const ReceivePage = ({
                       nextAddress,
                       intl,
                       onChangeAccountNumber,
                       onRequestAddress,
                     }) => (
  <TabContent>
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
          <AccountsSelect onChange={onChangeAccountNumber} accountsType="visible" />
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

export default injectIntl(ReceivePage);
