import Modal from "../Modal";
import { FormattedMessage as T } from "react-intl";
import { PasswordInput } from "inputs";
import { ButtonsToolbar } from "../PassphraseModal";
import { InvisibleButton } from "buttons";

const PinButton = ({ index, label, onClick }) =>
  <div className="pin-pad-button" onClick={() => onClick(index)}>{label}</div>;

@autobind
class PinModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = { currentPin: "" };
  }

  onPinButtonClick(index) {
    this.setState({ currentPin: this.state.currentPin + index });
  }

  onCancelModal() {
    this.setState({ currentPin: "" });
    this.props.onCancelModal();
  }

  onSubmit() {
    this.props.submitPin(this.state.currentPin);
  }

  onClearPin() {
    this.setState({ currentPin: "" });
  }

  render() {
    const { onCancelModal, onSubmit, onPinButtonClick, onClearPin } = this;

    const labels = "ABCDEFGHI";
    const currentPin = this.state.currentPin.split("").map(v => labels[parseInt(v)-1]).join("");

    const Button = ({ index }) =>
      <PinButton label={labels[index-1]} index={index} onClick={onPinButtonClick} />;

    const trezorLabel = this.props.device ? this.props.device.features.label : "";
    const className = [
      "passphrase-modal",
      "trezor-pin-modal",
      this.props.isGetStarted ? "get-started" : ""
    ].join(" ");

    return (
      <Modal {...{ className, onCancelModal }}>
        <h1><T id="trezor.pinModal.title" m="Enter Pin" /></h1>
        <p><T id="trezor.pinModal.description" m="Click button sequence that corresponds to your pin on trezor {label}"
          values={{ label: <span className="trezor-label">'{trezorLabel}'</span> }} /></p>
        <div className="pin-pad">
          <Button index={7} />
          <Button index={8} />
          <Button index={9} />
          <Button index={4} />
          <Button index={5} />
          <Button index={6} />
          <Button index={1} />
          <Button index={2} />
          <Button index={3} />
        </div>
        <div>
          <InvisibleButton onClick={onClearPin} className="pin-pad-clear-btn">
            <T id="trezor.pinModal.clear" m="clear" />
          </InvisibleButton>
        </div>
        <div className="password-field">
          <PasswordInput value={currentPin} />
        </div>
        <ButtonsToolbar {... { onCancelModal, onSubmit }} />
      </Modal>
    );
  }
}

export default PinModal;
