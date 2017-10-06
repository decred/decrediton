import React from "react";
import { FormattedMessage as T, injectIntl } from "react-intl";
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
      <div className="page-content message message-verify">
        <div className="message-header-title"><T id="securitycenter.verify.header" m="Verify Message" /></div>
        <VerifyMessageForm onSubmit={this.onSubmit} rpcError={verifyMessageError} formatMessage={this.props.intl.formatMessage} />
        {result}
      </div>
    );
  }

  onSubmit(props) {
    this.props.verifyMessageAttempt(props);
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

export default verifyMessageConnector(injectIntl(VerifyMessage));
