import { ReceiveAccountsSelect, DcrInput } from "inputs";
import { CopyToClipboard, Subtitle } from "shared";
import { KeyBlueButton } from "buttons";
import QRCode from "./QRCode";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import "style/ReceivePage.less";
import "style/MiscComponents.less";

const messages = defineMessages({
  amountPlaceholder: {
    id: "receive.amountPlaceholder",
    defaultMessage: "Amount"
  }
});

const ReceivePage = ({
  nextAddress,
  onRequestAddress,
  amountAtomValue,
  amount,
  error,
  intl,
  onValidateAmount,
  onKeyDown
}) => (
  <>
    <Subtitle title={<T id="receive.subtitle" m="Receive DCR" />} />
    <div className="receive-content-nest">
      <div className="receive-content-nest-address-and-qr">
        <div className="receive-content-nest-for-address">
          <div className="receive-content-nest-prefix prefix-long">
            <T id="receive.accountLabel" m="This address is for" />:
          </div>
          <div className="receive-content-nest-prefix prefix-short">
            <T id="receive.shortAccountLabel" m="Address is for" />:
          </div>
          <div className="receive-select-account-input">
            <ReceiveAccountsSelect showAccountsButton />
          </div>
          <div style={{ clear: "both" }}></div>
        </div>
        <div className="receive-requested-amount">
          <div className="receive-content-nest-prefix prefix-long">
            <T id="receive.requestedAmountLabel" m="Requested amount" />:
          </div>
          <div className="receive-content-nest-prefix prefix-short">
            <T id="receive.shortRequestedAmountLabel" m="Amount" />:
          </div>
          <div className="receive-select-account-input">
            <DcrInput
              className="requested-amount-input"
              required={false}
              showErrors={error && error.amount}
              invalid={error && error.amount}
              invalidMessage={error && error.amount}
              amount={amountAtomValue}
              placeholder={intl.formatMessage(messages.amountPlaceholder)}
              onChangeAmount={(e) => onValidateAmount(e)}
              onKeyDown={onKeyDown}
            />
          </div>
        </div>
        <div className="receive-content-nest-qr">
          <div className="receive-content-nest-qrhash">
            <div>{nextAddress}</div>
          </div>
          <CopyToClipboard
            textToCopy={nextAddress}
            className="receive-content-nest-copy-to-clipboard-icon"
          />
          <div style={{ clear: "both" }}></div>
        </div>
      </div>
      <QRCode addr={nextAddress} amount={amount} />
    </div>
    <div className="receive-toolbar">
      <KeyBlueButton size="large" block={false} onClick={onRequestAddress}>
        <T id="receive.newAddressBtn" m="Generate new address" />
      </KeyBlueButton>
    </div>
  </>
);

export default injectIntl(ReceivePage);
