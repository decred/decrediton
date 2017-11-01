import SecurityPageHeader from "./Header";
import { securityPage } from "connectors";
import { autobind } from "core-decorators";
import FormSelector from "./FormSelector";
import { injectIntl, defineMessages, intlShape } from "react-intl";
import { substruct } from "fp";

@autobind
class SecurityPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      form: 0,
      isShowingSignMessageInfo: false,
      isShowingVerifyMessageInfo: false,
      submittingSignMessage: false,
    };
  }

  componentWillMount() {
    if (!this.props.walletService) {
      this.context.router.push("/error");
    }
  }

  componentWillUnmount() {
    this.props.getSignMessageCleanStore();
  }

  render() {
    return (
      <Aux>
        <SecurityPageHeader />
        <FormSelector
          {...{
            ...this.props,
            ...this.state,
            formatMessage: this.props.intl.formatMessage,
            rpcError: false,
            ...substruct({
              onSubmitSignMessage: null,
              onShowSignMessageInfo: null,
              onHideSignMessageInfo: null,
            }, this)

          }}
        />
      </Aux>
    );
  }
  onSubmitSignMessage(props) {
    this.setState({
      submittingSignMessage: true
    })
    this.props.getSignMessageAttempt(props);
  }
  onShowSignMessageInfo() {
    this.setState({ isShowingSignMessageInfo: true });
  }
  onHideSignMessageInfo() {
    this.setState({ isShowingSignMessageInfo: false });
  }
}

export default injectIntl(securityPage(SecurityPage));
