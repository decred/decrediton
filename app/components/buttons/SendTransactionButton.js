import { send } from "connectors";
import { PassphraseModalButton } from "./index";
import KeyBlueButton from "./KeyBlueButton";
import { FormattedMessage as T } from "react-intl";

@autobind
class SendTransactionButton extends React.Component {
  constructor(props) {
    super(props);
  }

  async onAttemptSignTransaction(privpass) {
    const { unsignedTransaction, onAttemptSignTransaction, disabled, onSubmit } = this.props;
    if (!privpass || disabled || !onAttemptSignTransaction) return;
    await onAttemptSignTransaction(privpass, unsignedTransaction);
    onSubmit && onSubmit();
  }

  async onAttemptSignTransactionTrezor() {
    const { unsignedTransaction, onAttemptSignTransactionTrezor,
      constructTxResponse, disabled, onSubmit } = this.props;
    if (disabled || !onAttemptSignTransactionTrezor) return;
    await onAttemptSignTransactionTrezor(unsignedTransaction, constructTxResponse);
    onSubmit && onSubmit();
  }

  render() {
    const { disabled, isSendingTransaction, children, isTrezor } = this.props;

    if (isTrezor) {
      return (
        <KeyBlueButton
          onClick={this.onAttemptSignTransactionTrezor}
          disabled={disabled || isSendingTransaction}
          className="content-send"
          loading={isSendingTransaction}
        >
          <T id="send.sendBtn" m="Send" />
        </KeyBlueButton>
      );
    } else {
      return (
        <PassphraseModalButton
          modalTitle={<T id="send.sendConfirmations" m="Transaction Confirmation" />}
          modalDescription={children}
          disabled={disabled || isSendingTransaction}
          className="content-send"
          onSubmit={this.onAttemptSignTransaction}
          loading={isSendingTransaction}
          buttonLabel={<T id="send.sendBtn" m="Send" />}
        />
      );
    }
  }
}

export default send(SendTransactionButton);
