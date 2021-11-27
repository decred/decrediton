import { useState, useRef } from "react";
import copy from "clipboard-copy";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { ReceiveAccountsSelect, DcrInput } from "inputs";
import { Subtitle } from "shared";
import { KeyBlueButton, SmallButton } from "buttons";
import QRCodeModal from "./QRCodeModal";
import { classNames, Tooltip, TextHighlighted } from "pi-ui";
import style from "./ReceivePage.module.css";

const messages = defineMessages({
  amountPlaceholder: {
    id: "receive.amountPlaceholder",
    defaultMessage: "Amount"
  },
  amountLabel: {
    id: "receive.requestedAmountLabel",
    defaultMessage: "Requested Amount"
  }
});

const ReceivePage = ({
  nextAddress,
  onRequestAddress,
  amountAtomValue,
  amount,
  error,
  intl,
  onValidateAmount
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
        <div className={style.inputs}>
          <div className={style.inputWrapper}>
            <label htmlFor="receiveAccountSelect">
              <T id="receive.accountLabel" m="This address is for" />
            </label>
            {
              // `selectWithBigFont` className is
              // temp solution to skinning from ReactSelectGlobal.css.
              // When react-select will be replaced by the `pi-ui` component,
              // this className can be deleted.
            }
            <ReceiveAccountsSelect
              id="receiveAccountSelect"
              showAccountsButton
              className={classNames(
                style.receiveSelectAccountSelect,
                "selectWithBigFont"
              )}
              selectClassName={style.receiveSelectAccountSelectInput}
            />
          </div>
          <div
            className={classNames(
              style.inputWrapper,
              style.amountInputWrapper
            )}>
            <div className={style.receiveSelectAmountInput}>
              <DcrInput
                newBiggerFontStyle
                id="amountInput"
                label={intl.formatMessage(messages.amountLabel)}
                className={style.requestedAmountInput}
                required={false}
                showErrors={error && error.amount}
                invalid={error && error.amount}
                invalidMessage={error && error.amount}
                amount={amountAtomValue}
                placeholder={intl.formatMessage(messages.amountPlaceholder)}
                onChangeAmount={(e) => onValidateAmount(e)}
              />
            </div>
          </div>
        </div>

        <div className={style.line}>
          <TextHighlighted
            truncate={false}
            className={classNames(style.receiveContentNestQR)}>
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
          </TextHighlighted>
          <div>
            <Tooltip content={<T id="receiveTab.copy" m="Copy" />}>
              <SmallButton
                className={style.receiveContentCopyButton}
                onClick={() => {
                  copy(nextAddress);
                  setTooltipText(false);
                  showTooltip();
                }}
              />
            </Tooltip>
          </div>
          <div>
            <Tooltip content={<T id="receiveTab.QRCode" m="QR code" />}>
              <SmallButton
                className={style.receiveContentQRButton}
                onClick={() => setModal(true)}
              />
            </Tooltip>
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
