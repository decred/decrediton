import copy from "clipboard-copy";
import { useState } from "react";
import { ReceiveAccountsSelect, DcrInput } from "inputs";
import { Subtitle } from "shared";
import { KeyBlueButton } from "buttons";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import QRCodeModal from "./QRCodeModal";
import style from "./ReceiveTab.module.css";
import { classNames } from "pi-ui";
import { useRef } from "react";

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
  const [tooltipText, setTooltipText] = useState(false);
  const timeout = useRef();

  function showTooltip() {
    clearTimeout(timeout.current);
    setTooltip(true);
    timeout.current = setTimeout(() => {
      setTooltip(false);
    }, 1000);
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
            className={classNames(
              style.receiveContentNestQR,
              tooltip && style.border
            )}>
            {nextAddress}
            <div
              className={classNames(
                style.receiveContentNestCopyQR,
                tooltip && style.opacity
              )}>
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
                copy(nextAddress);
                setTooltipText(false);
                showTooltip();
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
        </div>
      </div>
      <div className={style.generateButton}>
        <KeyBlueButton
          size="large"
          block={false}
          className={style.blueButton}
          onClick={() => {
            setTooltipText(true);
            showTooltip();
            onRequestAddress();
          }}>
          <T id="receive.newAddressBtn" m="Generate new address" />
        </KeyBlueButton>
      </div>
    </>
  );
};

export default injectIntl(ReceivePage);
