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
    const { signMessageSignature, isSigningMessage, isSignMessageDisabled, intl } = this.props;
    const { onChangeAddress, onChangeMessage } = this;
    const { address, addressError, message, messageError } = this.state;
    let result = null;
    if (signMessageSignature) {
      result = (
        <div className="message">
          <div className="message-nest">
            <div className="message-content">
              <div>
                {signMessageSignature}
              </div>
              <CopyToClipboard textToCopy={signMessageSignature} className="message-content-nest-copy-to-clipboard-icon" />
            </div>
          </div>
        </div>
      );
    }

    return (
      <Aux>
        <SignMessageForm {...{
          onChangeAddress, onChangeMessage, address, addressError, message,
          messageError, formatMessage: intl.formatMessage, isSigningMessage,
          isSignMessageDisabled,
        } }/>
        {result}
      </Aux>
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
}

SignMessage.propTypes = {
  intl: PropTypes.object.isRequired,
  walletService: PropTypes.object,
  signMessageCleanStore: PropTypes.func.isRequired,
  signMessageSignature: PropTypes.string,
};

SignMessage.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default signMessagePage(injectIntl(SignMessage));
