import { ReceiveAccountsSelect } from "inputs";
import { CopyToClipboard } from "shared";
import { KeyBlueButton } from "buttons";
import QRCode from "./QRCode";
import { FormattedMessage as T } from "react-intl";
import "style/ReceivePage.less";
import "style/MiscComponents.less";

const ReceivePage = ({
  nextAddress,
  onRequestAddress,
}) => (
  <Aux>
    <div className="tabbed-page-subtitle"><T id="receive.subtitle" m="Receive DCR"/></div>
    <div className="receive-content-nest">
      <div className="receive-content-nest-for-address">
        <div className="receive-content-nest-prefix">
          <T id="receive.accountLabel" m="This address is for" />:
        </div>
        <div className="receive-select-account-input">
          <ReceiveAccountsSelect showAccountsButton />
        </div>
        <div style={{ clear: "both" }}></div>
      </div>
      <QRCode addr={nextAddress} />
      <div className="receive-content-nest-qr">
        <div className="receive-content-nest-qrhash">
          <div>{nextAddress}</div>
        </div>
        <CopyToClipboard textToCopy={nextAddress} className="receive-content-nest-copy-to-clipboard-icon" />
        <div style={{ clear: "both" }}></div>
      </div>
    </div>
    <div className="receive-toolbar">
      <KeyBlueButton size="large" block={false} onClick={onRequestAddress}>
        <T id="receive.newAddressBtn" m="Generate new address" />
      </KeyBlueButton>
    </div>
  </Aux>
);

export default ReceivePage;
