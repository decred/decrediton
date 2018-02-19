import Modal from "./Modal";
import { injectIntl, defineMessages } from "react-intl";

const messages = defineMessages({
  copyConfirmationPhrase: {
    id: "seedCopyConfirmModal.copyConfirmationPhrase",
    defaultMessage: "I understand the risks"
  },
});

@autobind
class SeedCopyConfirmModal extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      copyConfirmationPhrase: props.intl.formatMessage(messages.copyConfirmationPhrase),
      typedConfirmationPhrase: ""
    };
  }

  onTypedConfirmationPhraseChanged(typedConfirmationPhrase) {
    this.setState({ typedConfirmationPhrase });
  }

  onSubmit() {
    this.props.onSubmit();
    this.setState({ typedConfirmationPhrase: "" });
  }

  onCancelModal() {
    this.props.onCancelModal();
    this.setState({ typedConfirmationPhrase: "" });
  }

  render() {
    const { onTypedConfirmationPhraseChanged, onSubmit, onCancelModal } = this;
    return <Modal
      {...this.props}
      {...this.state}
      onTypedConfirmationPhraseChanged={onTypedConfirmationPhraseChanged}
      onSubmit={onSubmit}
      onCancelModal={onCancelModal}
    />;
  }

}

export default injectIntl(SeedCopyConfirmModal);
