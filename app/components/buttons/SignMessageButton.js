import { signMessagePage } from "connectors";
import { PassphraseModalButton, KeyBlueButton } from "./index";
import { FormattedMessage as T } from "react-intl";

@autobind
class SignMessageButton extends React.Component {

  constructor(props) {
    super(props);
  }

  async onAttemptSignMessage(passphrase) {
    const { address, message, disabled, signMessageAttempt, onSubmit } = this.props;
    if (!passphrase || disabled || !signMessageAttempt) return;
    await signMessageAttempt(address, message, passphrase);
    onSubmit && onSubmit();
  }

  async onAttemptSignMessageTrezor() {
    const { address, message, disabled, signMessageAttemptTrezor, onSubmit } = this.props;
    if (disabled || !signMessageAttemptTrezor) return;
    await signMessageAttemptTrezor(address, message);
    onSubmit && onSubmit();
  }

  render() {
    const { disabled, isSigningMessage, className, isTrezor } = this.props;

    if (isTrezor) {
      return (
        <KeyBlueButton
          className={className}
          disabled={disabled}
          onClick={this.onAttemptSignMessageTrezor}
          loading={isSigningMessage}
        >
          <T id="securitycenter.signMessageBtn" m="Sign Message" />
        </KeyBlueButton>
      );
    } else {
      return (
        <PassphraseModalButton
          modalTitle={<T id="securitycenter.signMessageModal" m="Sign Message" />}
          className={className}
          disabled={disabled}
          onSubmit={this.onAttemptSignMessage}
          loading={isSigningMessage}
          buttonLabel={<T id="securitycenter.signMessageBtn" m="Sign Message" />}
        />
      );
    }
  }
}

SignMessageButton.propTypes = {
  message: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  signMessageAttempt: PropTypes.func.isRequired,
};

export default signMessagePage(SignMessageButton);
