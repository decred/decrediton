import { PassphraseModalButton } from "../index";
import KeyBlueButton from "../KeyBlueButton";
import { FormattedMessage as T } from "react-intl";
import { useSendTransactionButton } from "./hooks";
import styles from "./SendTransactionButton.module.css";

const SendTransactionButton = ({
  disabled,
  account,
  onSubmit,
  children,
  buttonLabel
}) => {
  const {
    constructTxResponse,
    unsignedTransaction,
    isSendingTransaction,
    isTrezor,
    isLedger,
    onAttemptSignTransaction,
    onAttemptSignTransactionTrezor,
    onAttemptSignTransactionLedger
  } = useSendTransactionButton();

  const signTransaction = (privpass) => {
    if (!privpass || disabled) return;
    onAttemptSignTransaction?.(privpass, unsignedTransaction, account.value);
  };

  const signTransactionTrezor = () => {
    if (disabled) return;
    onAttemptSignTransactionTrezor?.(unsignedTransaction, constructTxResponse);
    onSubmit?.();
  };

  const signTransactionLedger = () => {
    if (disabled) return;
    onAttemptSignTransactionLedger?.(unsignedTransaction);
    onSubmit?.();
  };

  if (isTrezor) {
    return (
      <KeyBlueButton
        onClick={signTransactionTrezor}
        disabled={disabled || isSendingTransaction}
        loading={isSendingTransaction}>
        {buttonLabel ? buttonLabel : <T id="send.sendBtn" m="Send" />}
      </KeyBlueButton>
    );
  } else if (isLedger) {
    return (
      <KeyBlueButton
        onClick={signTransactionLedger}
        disabled={disabled || isSendingTransaction}
        loading={isSendingTransaction}>
        {buttonLabel ? buttonLabel : <T id="send.sendBtn" m="Send" />}
      </KeyBlueButton>
    );
  } else {
    return (
      <PassphraseModalButton
        modalTitle={
          <T id="send.sendConfirmations" m="Transaction Confirmation" />
        }
        modalDescription={children}
        disabled={disabled || isSendingTransaction}
        onSubmit={signTransaction}
        loading={isSendingTransaction}
        modalClassName={styles.passphraseModal}
        buttonLabel={
          buttonLabel ? buttonLabel : <T id="send.sendBtn" m="Send" />
        }
      />
    );
  }
};

export default SendTransactionButton;
