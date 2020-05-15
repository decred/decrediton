import { useState } from "react";
import { ReceiveAccountsSelect, DcrInput } from "inputs";
import { Subtitle } from "shared";
import { KeyBlueButton } from "buttons";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import QRCodeModal from "./QRCodeModal";
import style from "./ReceiveTab.module.css";

const messages = defineMessages({
  amountPlaceholder: {
    id: "receive.amountPlaceholder",
    defaultMessage: "Amount"
  }
});

let timeout = null;

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
  const [tooltipText, setTooltipText] = useState(false);

  function updateCopy() {
    clearTimeout(timeout);
    setTooltip(true);
    timeout = setTimeout(() => {
      setTooltip(false);
    }, 2500);
  }

  return (
    <>
      {modal && <QRCodeModal {...{ amount, nextAddress, setModal }} />}
      <Subtitle title={<T id="receive.subtitle" m="Receive DCR" />} />
      <div className={style.receiveContent}>
        <div className={style.receiveContentNestForAddress}>
          <div className={style.receiveContentNestPrefix}>
            <T id="receive.accountLabel" m="This address is for" />:
          </div>
          <ReceiveAccountsSelect
            showAccountsButton
            className={style.receiveSelectAccountInput}
          />
        </div>
        <div className={style.receiveRequestedAmount}>
          <div className={style.receiveContentNestPrefix}>
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
              onChangeAmount={(e) => onValidateAmount(e)}
              onKeyDown={onKeyDown}
            />
          </div>
        </div>

        <div className={style.line}>
          <div
            className={
              style.receiveContentNestQR + " " + (tooltip && style.border)
            }>
            {nextAddress}
            <div
              className={
                style.receiveContentNestCopyQR +
                " " +
                (tooltip && style.opacity)
              }>
              <div className={style.receiveContentNestCopyQRArrow} />
              <div className={style.receiveContentNestCopyQRText}>
                {tooltipText ? (
                  <T
                    id="receive.tooltipGenerated"
                    m="&#x2b; New Address Generated"
                  />
                ) : (
                  <T
                    id="receive.tooltipCopied"
                    m="&#10003;  Copied to Clipboard"
                  />
                )}
              </div>
            </div>
          </div>
          <div className={style.copyParent}>
            <div
              className={style.receiveContentCopyButton}
              onClick={() => {
                setTooltipText(false);
                updateCopy();
              }}
            />
            <span>
              <T id="receive.copyHash" m="Copy" />
            </span>
          </div>
          <div className={style.viewQRParent}>
            <div
              className={style.receiveContentQRButton}
              onClick={() => setModal(true)}
            />
            <span>
              <T id="receive.viewQR" m="View QR" />
            </span>
          </div>
          {/* <div className={style.shareQRParent}>
            <div className={style.receiveContentShareButton} />
            <span>
              <T id="receive.shareQR" m="Share" />
            </span>
          </div> */}
        </div>
      </div>
      <div className={style.generateButton}>
        <KeyBlueButton
          size="large"
          block={false}
          className={style.blueButton}
          onClick={() => {
            setTooltipText(true);
            updateCopy();
            onRequestAddress();
          }}>
          <T id="receive.newAddressBtn" m="Generate new address" />
        </KeyBlueButton>
      </div>
    </>
  );
};

export default injectIntl(ReceivePage);
