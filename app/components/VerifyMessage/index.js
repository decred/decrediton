import React from "react";
import PropTypes from "prop-types";
import { autobind } from "core-decorators";
import VerifyMessageForm from "./Form";
import verifyMessageConnector from "../../connectors/verifyMessagePage";
import "../../style/SecurityCenterMessagePage.less";

@autobind
class VerifyMessage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.getMessageVerificationServiceAttempt();
  }

  componentWillUnmount() {
    this.props.verifyMessageCleanStore();
  }

  render() {
    const { verifyMessageError, verifyMessageSuccess, messageVerificationService } = this.props;

    if (!messageVerificationService) {
      return <div>Loading...</div>;
    }

    let result = null;
    if (verifyMessageSuccess) {
      const isValid = verifyMessageSuccess.valid;
      result = (
        <div className="message-nest">
          <div className={`message-content ${isValid ? 'valid' : 'invalid'}`}>
            Signature {isValid ? 'valid' : 'invalid'}!
          </div>
        </div>
      );
    }

    return (
      <div className="page-content message message-verify">
        <div className="message-header-title">Verify Message</div>
        <VerifyMessageForm onSubmit={this.onSubmit} rpcError={verifyMessageError} />
        {result}
      </div>
    );
  }

  onSubmit(props) {
    this.props.verifyMessageAttempt(props);
  }
}

VerifyMessage.propTypes = {
  getMessageVerificationServiceAttempt: PropTypes.func.isRequired,
  verifyMessageCleanStore: PropTypes.func.isRequired,
  verifyMessageError: PropTypes.string,
  verifyMessageSuccess: PropTypes.shape({
    signature: PropTypes.string,
  }),
};

export default verifyMessageConnector(VerifyMessage);
