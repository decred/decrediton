import { injectIntl } from "react-intl";
import SignMessageForm from "./Form";
import { signMessagePage } from "connectors";
import { CopyToClipboard } from "shared";
import "style/SecurityCenterMessagePage.less";

@autobind
class SignMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      isShowingSignMessageInfo: false,
      address: "",
      addressError: null,
      message: "",
      messageError: null,
    };
  }

  componentWillMount() {
    if (!this.props.walletService) {
      this.context.router.push("/error");
    }
  }

  componentWillUnmount() {
    this.props.signMessageCleanStore();
  }

  render() {
    const { signMessageSuccess, isSigningMessage, intl } = this.props;
    const { onChangeAddress, onChangeMessage, onSubmit } = this;
    const { address, addressError, message, messageError } = this.state;
    let result = null;
    if (signMessageSuccess) {
      result = (
        <div className="message-nest">
          <div className="message-content">
            <div>
              {signMessageSuccess.signature}
            </div>
            <CopyToClipboard textToCopy={signMessageSuccess.signature} className="message-content-nest-copy-to-clipboard-icon" />
          </div>
        </div>
      );
    }

    return (
      <div className="message message-sign">
        <SignMessageForm {...{ onSubmit, onChangeAddress, onChangeMessage, address, addressError, message, messageError, formatMessage: intl.formatMessage, isSigningMessage } }/>
        {result}
      </div>
    );
  }

  onChangeAddress(address){
    if (address == "") this.setState({ address: "", addressError: "Please enter an address" });
    else {
      this.props.validateAddress(address)
        .then(resp => {
          this.setState({ address, addressError: !resp.getIsValid() ? "Please enter a valid address" : null });
        })
        .catch(error => {
          console.error(error);
          this.setState({ address, addressError: "Error: Address validation failed, please try again." });
        });
    }
  }

  onChangeMessage(message){
    if (message == "") this.setState({ message: "", messageError: "Please enter a message" });
    else this.setState({ message, messageError: null });
  }

  onSubmit(passphrase) {
    const { address, addressError, message, messageError } = this.state;
    if (addressError || messageError) return;
    this.props.signMessageAttempt(address, message, passphrase);
  }
}

SignMessage.propTypes = {
  intl: PropTypes.object.isRequired,
  walletService: PropTypes.object,
  signMessageCleanStore: PropTypes.func.isRequired,
  signMessageSuccess: PropTypes.shape({
    signature: PropTypes.string,
  }),
};

SignMessage.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default signMessagePage(injectIntl(SignMessage));
