import { securityPage } from "connectors";
import { autobind } from "core-decorators";
import Page from "./Page";
import { injectIntl } from "react-intl";
import { substruct } from "fp";

@autobind
class SecurityPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      form: 0,
      isShowingSignMessageInfo: false,
      isShowingVerifyMessageInfo: false,
    };
  }

  componentWillMount() {
    if (!this.props.walletService) {
      this.context.router.push("/error");
    }
    this.props.getMessageVerificationServiceAttempt();
  }

  componentWillUnmount() {
    const {form} = this.state;
    if(form === 0)
      this.props.getSignMessageCleanStore();
    else if (form === 1)
      this.props.getVerifyMessageCleanStore();
  }

  render() {
    return (
      <Aux>
        <Page
          {...{
            ...this.props,
            ...this.state,
            formatMessage: this.props.intl.formatMessage,
            ...substruct({
              onSubmitSignMessage: null,
              onShowSignMessageInfo: null,
              onHideSignMessageInfo: null,
              onSubmitVerifyMessage: null,
              onShowVerifyMessageInfo: null,
              onHideVerifyMessageInfo: null,
              onSetForm: null,
            }, this)

          }}
        />
      </Aux>
    );
  }

  onSetForm(formNumber){
    this.setState({form: formNumber});
  }

  onSubmitSignMessage(props) {
    this.props.getSignMessageAttempt(props);
  }

  onShowSignMessageInfo() {
    this.setState({ isShowingSignMessageInfo: true });
  }

  onHideSignMessageInfo() {
    this.setState({ isShowingSignMessageInfo: false });
  }

  onSubmitVerifyMessage(props) {
    this.props.getVerifyMessageAttempt(props);
  }

  onShowVerifyMessageInfo() {
    this.setState({ isShowingVerifyMessageInfo: true });
  }

  onHideVerifyMessageInfo() {
    this.setState({ isShowingVerifyMessageInfo: false });
  }

}

export default injectIntl(securityPage(SecurityPage));
