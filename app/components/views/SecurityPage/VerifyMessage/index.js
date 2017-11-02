import { FormattedMessage as T, injectIntl } from "react-intl";
import VerifyMessageForm from "./Form";
import { verifyMessagePage } from "connectors";
import "style/SecurityCenterMessagePage.less";
import VerifyMessageInfo from "VerifyMessageInfo";

@autobind
class VerifyMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();
  }

  getInitialState() {
    return {
      isShowingVerifyMessageInfo: false,
    };
  }

  componentWillMount() {
    this.props.getMessageVerificationServiceAttempt();
  }

  componentWillUnmount() {
    this.props.verifyMessageCleanStore();
  }

  render() {
    const { verifyMessageError, verifyMessageSuccess, messageVerificationService } = this.props;
    const { isShowingVerifyMessageInfo } = this.state;

    if (!messageVerificationService) {
      return <div><T id="securitycenter.loading" m="Loading..." /></div>;
    }

    let result = null;
    if (verifyMessageSuccess) {
      const isValid = verifyMessageSuccess.valid;
      let isValidDisplay = null;
      if (isValid) {
        isValidDisplay = <T id="securitycenter.verify.result.valid" m="Valid signature!" />;
      } else {
        isValidDisplay = <T id="securitycenter.verify.result.invalid" m="Invalid signature!" />;
      }

      result = (
        <div className="message-nest">
          <div className={`message-content ${isValid ? "valid" : "invalid"}`}>
            {isValidDisplay}
          </div>
        </div>
      );
    }

    return (
      isShowingVerifyMessageInfo ?
      <VerifyMessageInfo closeModal={this.onHideVerifyMessageInfo} /> :
      <div className="page-content message message-verify">
        <VerifyMessageForm onShowVerifyMessageInfo={this.onShowVerifyMessageInfo} onSubmit={this.onSubmit} rpcError={verifyMessageError} formatMessage={this.props.intl.formatMessage} />
        {result}
      </div>
    );
  }

  onSubmit(props) {
    this.props.verifyMessageAttempt(props);
  }
  onShowVerifyMessageInfo() {
    this.setState({ isShowingVerifyMessageInfo: true });
  }
  onHideVerifyMessageInfo() {
    this.setState({ isShowingVerifyMessageInfo: false });
  }
}

VerifyMessage.propTypes = {
  intl: PropTypes.object.isRequired,
  getMessageVerificationServiceAttempt: PropTypes.func.isRequired,
  verifyMessageCleanStore: PropTypes.func.isRequired,
  verifyMessageError: PropTypes.string,
  verifyMessageSuccess: PropTypes.shape({
    signature: PropTypes.string,
  }),
};

export default verifyMessagePage(injectIntl(VerifyMessage));
