import { useState } from "react";
import { ReceiveAccountsSelect, DcrInput } from "inputs";
import { CopyToClipboard, Subtitle } from "shared";
import { KeyBlueButton } from "buttons";
import QRCode from "./QRCode";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import "style/ReceivePage.less";
import "style/MiscComponents.less";
import style from "./ReceiveTab.module.css";

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
}) => {
  const [modal, setModal] = useState(false);

  return (
    <>
      {modal && (
        <div className={style.root}>
          <div className={style.modal}>
            <div className={style.decredLogo}/>
            <div className={style.modalMain}>
              <div className={style.modalLabel}>
                This is My Decred (DCR) Address
            </div>
              <div className={style.modalAddress}>{nextAddress}</div>
              <div className={style.modalQR}>
                <QRCode addr={nextAddress} amount={amount} />
              </div>
            </div>
            <div className={style.modalSecond}>
              <div className={style.modalClose} onClick={() => setModal(false)} >Close</div>
              <div className={style.modalShare} />
            </div>
          </div>
          {/* </div> */}
        </div>)}
      <Subtitle title={<T id="receive.subtitle" m="Receive DCR" />} />
      <div className={style.receiveContent}>
        <div className={style.receiveContentNestForAddress}>
          <div className="receive-content-nest-prefix prefix-long">
            <T id="receive.accountLabel" m="This address is for" />:
          </div>
          <div className="receive-content-nest-prefix prefix-short">
            <T id="receive.shortAccountLabel" m="Address is for" />:
          </div>
          <div className={style.receiveSelectAccountInput}>
            <ReceiveAccountsSelect showAccountsButton />
          </div>
        </div>
        <div className={style.receiveRequestedAmount}>
          <div className="receive-content-nest-prefix prefix-long">
            <T id="receive.requestedAmountLabel" m="Requested amount" />:
          </div>
          <div className="receive-content-nest-prefix prefix-short">
            <T id="receive.shortRequestedAmountLabel" m="Amount" />:
          </div>
          <div className={style.receiveSelectAccountInput}>
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

        <div className={style.line}>
          <div className={style.receiveContentNestQR}>
            {nextAddress}
            <div className={style.receiveContentNestCopyQR}>
              <div className={style.receiveContentNestCopyQRArrow} />
              <div className={style.receiveContentNestCopyQRText}>
                &#10003;   Copied to Clipboard
              </div>
            </div>
          </div>
          <div className={style.receiveContentButtons}>
            <div>
              <div class={style.receiveContentCopyButton}></div><span>Copy</span>
            </div>
            <div><div class={style.receiveContentQRButton} onClick={() => setModal(true)} /><span>View QR</span></div>
            <div><div class={style.receiveContentShareButton} /><span>Share</span></div>
          </div>
        </div>
      </div>
      {/* <QRCode addr={nextAddress} amount={amount} /> */}
      <div className="receive-toolbar">
        <KeyBlueButton size="large" block={false} onClick={onRequestAddress}>
          <T id="receive.newAddressBtn" m="Generate new address" />
        </KeyBlueButton>
      </div>
    </>
  );
}

export default injectIntl(ReceivePage);
