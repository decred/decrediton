import Modal from "../Modal";
import { FormattedMessage as T } from "react-intl";
import { Documentation } from "shared";
import { PasswordInput, PassphraseModalField } from "inputs";
import { ButtonsToolbar } from "../PassphraseModal";

@autobind
class TrezorWalletCreationPassphraseModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { passphraseValue: "", passphraseConfirmValue: "",
      submitAttempted: false, mismatchedValues: false };
  }

  componentWillUnmount() {
    this.setState = { passphraseValue: "", passphraseConfirmValue: "" };
  }

  onSubmit() {
    const { passphraseValue, passphraseConfirmValue } = this.state;
    if (passphraseValue != passphraseConfirmValue) {
      this.setState({ submitAttempted: true, mismatchedValues: true });
      return;
    }

    this.props.submitPassPhrase(passphraseValue);
    this.setState({ passphraseValue: "", passphraseConfirmValue: "" });
  }

  onChangePassphraseValue(passphraseValue) {
    this.setState({ passphraseValue, submitAttempted: false,
      mismatchedValues: false });
  }

  onChangePassphraseConfirmValue(passphraseConfirmValue) {
    this.setState({ passphraseConfirmValue, submitAttempted: false,
      mismatchedValues: false });
  }

  render() {
    const { onCancelModal } = this.props;
    const { onSubmit, onChangePassphraseValue, onChangePassphraseConfirmValue } = this;
    const { submitAttempted, passphraseValue, passphraseConfirmValue,
      mismatchedValues } = this.state;

    const trezorLabel = this.props.device ? this.props.device.features.label : "";

    const className = [
      "trezor-passphrase-modal",
      this.props.isGetStarted ? "get-started" : ""
    ].join(" ");

    return (
      <Modal className={className} onCancelModal={onCancelModal}>
        <h1><T id="trezor.walletCreationPassPhraseModal.title" m="Type Wallet Creation PassPhrase" /></h1>
        <p>
          <T id="trezor.walletCreationpassphraseModal.description"
            m={"Type the secret passphrase of the wallet to restore from the trezor device {label}"}
            values={{ label: <span className="trezor-label">'{trezorLabel}'</span> }} />
        </p>
        <Documentation name="TrezorWalletCreationPassPhraseWarning" />

        <PassphraseModalField
          label={<T id="trezor.walltCreationPrivatePassphrase" m="Wallet PassPhrase" />}
        >
          <PasswordInput
            autoFocus
            placeholder=""
            value={passphraseValue}
            onChange={e => onChangePassphraseValue(e.target.value)}
            onKeyDownSubmit={onSubmit}
            showErrors={submitAttempted}
          />
        </PassphraseModalField>

        <PassphraseModalField
          label={<T id="trezor.walltCreationPrivatePassphraseConfirm" m="Confirm Wallet PassPhrase" />}
        >
          <PasswordInput
            placeholder=""
            value={passphraseConfirmValue}
            onChange={e => onChangePassphraseConfirmValue(e.target.value)}
            onKeyDownSubmit={onSubmit}
            showErrors={submitAttempted}
            invalid={mismatchedValues}
            invalidMessage={<T id="trezor.walletCreationPassphrasesMismatched" m="Passphrases are different" />}
          />
        </PassphraseModalField>

        <ButtonsToolbar {... { onCancelModal, onSubmit }} />
      </Modal>
    );
  }
}

export default TrezorWalletCreationPassphraseModal;
