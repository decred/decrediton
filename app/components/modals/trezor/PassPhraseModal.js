import { PassphraseModal } from "modals";
import { FormattedMessage as T } from "react-intl";

@autobind
class TrezorPassphraseModal extends React.Component {
  constructor(props) {
    super(props);
  }

  onSubmit(passPhrase) {
    this.props.submitPassPhrase(passPhrase);
  }

  render() {
    const { onCancelModal } = this.props;
    const { onSubmit } = this;

    const trezorLabel = this.props.device
      ? this.props.deviceLabel
      : "";

    const className = [
      "trezor-passphrase-modal",
      this.props.isGetStarted ? "get-started" : ""
    ].join(" ");

    return (
      <PassphraseModal
        show={true}
        modalTitle={
          <T id="trezor.passphraseModal.title" m="Enter Trezor Passphrase" />
        }
        modalClassName={className}
        modalDescription={
          <p>
            <T
              id="trezor.passphraseModal.description"
              m="Type the secret passphrase for the wallet stored in Trezor {label}"
              values={{
                label: <span className="trezor-label">'{trezorLabel}'</span>
              }}
            />
          </p>
        }
        {...{ onCancelModal, onSubmit }}
      />
    );
  }
}

export default TrezorPassphraseModal;
