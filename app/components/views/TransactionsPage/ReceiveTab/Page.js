import ReceiveAccountsSelect from "ReceiveAccountsSelect";
import { Link } from "react-router";
import { CopyToClipboard, Tooltip } from "shared";
import KeyBlueButton from "KeyBlueButton";
import QRCode from "./QRCode";
import { FormattedMessage as T } from "react-intl";
import "style/Layout.less";
import "style/ReceivePage.less";
import "style/MiscComponents.less";

const ReceivePage = ({
                       nextAddress,
                       onRequestAddress,
                     }) => (
  <div className="tab-card">
    <div className="receive-content-nest">
      <div className="receive-content-nest-for-address">
        <Tooltip text={ <T id="receive.accounts.tip" m="Accounts" /> }>
          <Link to={"/accounts"} className="accounts-button-icon" />
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
);

export default ReceivePage;
