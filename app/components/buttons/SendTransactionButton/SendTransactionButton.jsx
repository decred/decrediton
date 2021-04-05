import { PassphraseModalButton } from "../index";
import KeyBlueButton from "../KeyBlueButton";
import { FormattedMessage as T } from "react-intl";
import { useSendTransactionButton } from "./hooks";

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
    onAttemptSignTransaction,
    onAttemptSignTransactionTrezor
  } = useSendTransactionButton();

  const signTransaction = (privpass) => {
    if (!privpass || disabled) return;
    onAttemptSignTransaction?.(privpass, unsignedTransaction, account);
  };

  const signTransactionTrezor = () => {
    if (disabled) return;
    onAttemptSignTransactionTrezor?.(unsignedTransaction, constructTxResponse);
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
        buttonLabel={
          buttonLabel ? buttonLabel : <T id="send.sendBtn" m="Send" />
        }
      />
    );
  }
};

export default SendTransactionButton;
