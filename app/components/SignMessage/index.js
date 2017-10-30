import { FormattedMessage as T, injectIntl } from "react-intl";
import { Icon, Flex, Box, Heading, CopyToClipboard } from "shared";
import SignMessageForm from "./Form";
import { signMessagePage } from "connectors";
import "style/SecurityCenterMessagePage.less";

@autobind
class SignMessage extends React.Component {
  constructor(props) {
    super(props);
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
      <Box p={ 70 } bg="lightestGrey" >
        <Flex align="center" pb={ 10 }>
          <Icon i="cog" s={ 30 } pr={ 20 } />
          <Heading><T id="securitycenter.sign.header" m="Sign Message" /></Heading>
        </Flex>
        <div className="message">
          <SignMessageForm onSubmit={this.onSubmit} rpcError={signMessageError} formatMessage={this.props.intl.formatMessage} />
          {result}
        </div>
      </Box>
    );
  }

  onSubmit(props) {
    this.props.signMessageAttempt(props);
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
