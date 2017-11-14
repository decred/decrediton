import { injectIntl } from "react-intl";
import SignMessageForm from "./Form";
import { signMessagePage } from "connectors";
import { CopyToClipboard } from "shared";
import "style/SecurityCenterMessagePage.less";
import SignMessageInfo from "SignMessageInfo";

@autobind
class SignMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      isShowingSignMessageInfo: false,
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
    const { signMessageError, signMessageSuccess } = this.props;
    const { isShowingSignMessageInfo } = this.state;
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
      isShowingSignMessageInfo ?
      <SignMessageInfo closeModal={this.onHideSignMessageInfo} /> :
      <div className="tab-card message message-sign">
        <SignMessageForm onShowSignMessageInfo={this.onShowSignMessageInfo} onSubmit={this.onSubmit} rpcError={signMessageError} formatMessage={this.props.intl.formatMessage} />
        {result}
      </div>
    );
  }

  onSubmit(props) {
    this.props.signMessageAttempt(props);
  }
  onShowSignMessageInfo() {
    this.setState({ isShowingSignMessageInfo: true });
  }
  onHideSignMessageInfo() {
    this.setState({ isShowingSignMessageInfo: false });
  }
}

SignMessage.propTypes = {
  intl: PropTypes.object.isRequired,
  walletService: PropTypes.object,
  signMessageCleanStore: PropTypes.func.isRequired,
  signMessageError: PropTypes.string,
  signMessageSuccess: PropTypes.shape({
    signature: PropTypes.string,
  }),
};

SignMessage.contextTypes = {
  router: PropTypes.object.isRequired,
};

export default signMessagePage(injectIntl(SignMessage));
