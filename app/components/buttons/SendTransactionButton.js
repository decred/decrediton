import { send } from "connectors";
import { PassphraseModalButton } from "./index";
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

  render() {
    const { disabled, isSendingTransaction, onShow, showModal, children } = this.props;

    return (
      <PassphraseModalButton
        modalTitle={<T id="send.sendConfirmations" m="Transaction Confirmation" />}
        modalDescription={children}
        showModal={showModal}
        onShow={onShow}
        disabled={disabled || isSendingTransaction}
        className="content-send"
        onSubmit={this.onAttemptSignTransaction}
        loading={isSendingTransaction}
        buttonLabel={<T id="send.sendBtn" m="Send" />}
      />
    );
  }
}

export default send(SendTransactionButton);
