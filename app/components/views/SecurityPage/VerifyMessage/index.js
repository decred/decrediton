import { FormattedMessage as T, injectIntl } from "react-intl";
import VerifyMessageForm from "./Form";
import { verifyMessagePage } from "connectors";
import "style/SecurityCenterMessagePage.less";

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
    const { address, message, signature, addressError, messageError, signatureError } = this.props;
    const { onChangeAddress, onChangeMessage, onChangeSignature, onSubmit } = this;
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
      <div className="tab-card message message-verify">
        <VerifyMessageForm {...{onSubmit, address, message, signature, addressError, messageError, signatureError, onChangeAddress, onChangeMessage, onChangeSignature, formatMessage:this.props.intl.formatMessage}} />
        {result}
      </div>
    );
  }


  onSubmit() {
    const { address, addressError, message, messageError, signature, signatureError } = this.state;
    if (addressError || messageError || signatureError) return;
    this.props.verifyMessageAttempt(address, message, signature);
  }

  onChangeAddress(address) {
    if (address == "") this.setState({address: "", addressError: "Please enter an address"});
    else this.setState({address, addressError: null});
  }

  onChangeMessage(message){
    if (message == "") this.setState({message: "", messageError: "Please enter a message"});
    else this.setState({message, messageError: null});
  }

  onChangeSignature(signature) {
    if (signature == "") this.setState({signature: "", signatureError: "Please enter a signature"});
    else this.setState({signature, signatureError: null});
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
