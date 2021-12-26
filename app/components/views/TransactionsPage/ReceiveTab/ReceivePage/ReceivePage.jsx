import { useState, useRef } from "react";
import copy from "clipboard-copy";
import { FormattedMessage as T, injectIntl, defineMessages } from "react-intl";
import { ReceiveAccountsSelect, DcrInput } from "inputs";
import { Subtitle } from "shared";
import { KeyBlueButton } from "buttons";
import QRCodeModal from "./QRCodeModal";
import {
  classNames,
  Tooltip,
  ButtonIcon,
  useTheme,
  getThemeProperty,
  TextHighlighted
} from "pi-ui";
import styles from "./ReceivePage.module.css";

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
  const { theme } = useTheme();
  const iconColor = getThemeProperty(theme, "accent-blue");

  return (
    <>
      {modal && <QRCodeModal {...{ amount, nextAddress, setModal }} />}
      <Subtitle title={<T id="receive.subtitle" m="Receive DCR" />} />
      <div className={styles.receiveContent}>
        <div className={styles.inputs}>
          <div className={styles.inputWrapper}>
            <label htmlFor="receiveAccountSelect" className={styles.label}>
              <T id="receive.accountLabel" m="This address is for" />
            </label>
            <ReceiveAccountsSelect
              id="receiveAccountSelect"
              selectWithBigFont
              showAccountsButton
              className={styles.receiveSelectAccountSelect}
              selectClassName={styles.receiveSelectAccountSelectInput}
            />
          </div>
          <div
            className={classNames(
              styles.inputWrapper,
              styles.amountInputWrapper
            )}>
            <div className={styles.receiveSelectAmountInput}>
              <DcrInput
                newBiggerFontStyle
                id="amountInput"
                label={intl.formatMessage(messages.amountLabel)}
                className={styles.requestedAmountInput}
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

        <div className={styles.line}>
          <TextHighlighted
            truncate={false}
            className={classNames(styles.receiveContentNestQR)}>
            {nextAddress}
            <div
              className={classNames(
                styles.receiveContentNestCopyQR,
                tooltip && styles.opacity
              )}>
              <div className={styles.receiveContentNestCopyQRArrow} />
              <div className={styles.receiveContentNestCopyQRText}>
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
              <ButtonIcon
                type="copyToClipboard"
                className={styles.receiveContentCopyButton}
                iconBackgroundColor={iconColor}
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
              <ButtonIcon
                type="qr"
                iconColor={iconColor}
                onClick={() => setModal(true)}
              />
            </Tooltip>
          </div>
        </div>
      </div>
      <div className={styles.generateButton}>
        <KeyBlueButton
          size="large"
          block={false}
          className={styles.blueButton}
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
