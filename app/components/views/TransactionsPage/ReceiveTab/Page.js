import { useState } from "react";
import { ReceiveAccountsSelect, DcrInput } from "inputs";
import { Subtitle } from "shared";
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
  const [tooltip, setTooltip] = useState(false);
  const [sum, setSum] = useState(false);
  const [timeout, _setTimeout] = useState();

  function updateCopy() {
    clearTimeout(timeout);
    setTooltip(true);
    _setTimeout(setTimeout(() => {
      setTooltip(false);
    }, 2500));
  }

  return (
    <>
      {modal && (
        <div className={style.root}>
          <div className={style.modal}>
            <div className={style.decredLogo} />
            <div className={style.modalMain}>
              <div className={style.modalLabel}>
                <T id="receiveTab.modalLabel" m="{value}" values={{ value: "This is My Decred (DCR) Address" }} />
              </div>
              <div className={style.modalAddress}>{nextAddress}</div>
              <div className={style.modalQR}>
                <QRCode addr={nextAddress} amount={amount} />
              </div>
            </div>
            <div className={style.modalSecond}>
              <div className={style.modalClose} onClick={() => setModal(false)} >
                <T id="receiveTab.modalClose" m="Close" />
              </div>
              <div className={style.modalShare} />
            </div>
          </div>
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
              <ReceiveAccountsSelect showAccountsButton className={style.receiveSelectAccountInputValue} />
            </div>
          </div>
          <div className={style.receiveRequestedAmount}>
            <div className="receive-content-nest-prefix prefix-long">
              <T id="receive.requestedAmountLabel" m="Requested amount" />:
          </div>
            <div className={style.receiveSelectAmountInput}>
              <DcrInput
                className={style.requestedAmountInput}
                required={false}
                showErrors={error && error.amount}
                invalid={error && error.amount}
                invalidMessage={error && error.amount}
                amount={amountAtomValue}
                placeholder={intl.formatMessage(messages.amountPlaceholder)}
                onChangeAmount={e => onValidateAmount(e)}
                onKeyDown={onKeyDown}
              />
            </div>
          </div>

          <div className={style.line}>
            <div className={style.receiveContentNestQR + " " + (tooltip && style.border)}>
              {nextAddress}
              <div className={style.receiveContentNestCopyQR + " " + (tooltip && style.opacity)}>
                <div className={style.receiveContentNestCopyQRArrow} />
                <div className={style.receiveContentNestCopyQRText}>
                  {sum ?
                    <T id="receiveTab.tooltipCopied" m="&#10003;   Copied to Clipboard" /> :
                    <T id="receiveTab.tooltipGenerated" m="&#x2b;   New Address Generated" />}
                </div>
              </div>
            </div>
            <div className={style.receiveContentButtons}>
              <div>
                <div class={style.receiveContentCopyButton} onClick={() => {
                  setSum(false);
                  updateCopy()
                }} />
                <span><T id="receiveTab.copyHash" m="Copy" /></span>
              </div>
              <div><div class={style.receiveContentQRButton} onClick={() => setModal(true)} />
                <span><T id="receiveTab.viewQR" m="View QR" /></span>
              </div>
              <div><div class={style.receiveContentShareButton} />
                <span><T id="receiveTab.shareQR" m="Share" /></span>
              </div>
            </div>
          </div>
        </div>
        <div className={style.generateButton}>
          <KeyBlueButton size="large" block={false} onClick={() => {
            setSum(true)
            updateCopy()
            onRequestAddress();
          }}>
            <T id="receive.newAddressBtn" m="Generate new address" />
          </KeyBlueButton>
        </div>
    </>
  );
}

export default injectIntl(ReceivePage);
