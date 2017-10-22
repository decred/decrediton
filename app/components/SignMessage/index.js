import React from "react";
import PropTypes from "prop-types";
import { autobind } from "core-decorators";
import { FormattedMessage as T, injectIntl } from "react-intl";
import SignMessageForm from "./Form";
import signMessageConnector from "../../connectors/signMessagePage";
import { CopyToClipboard } from "shared";
import "../../style/SecurityCenterMessagePage.less";

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
      <div className="page-content message message-sign">
        <div className="message-header-title"><T id="securitycenter.sign.header" m="Sign Message" /></div>
        <SignMessageForm onSubmit={this.onSubmit} rpcError={signMessageError} formatMessage={this.props.intl.formatMessage} />
        {result}
      </div>
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

export default signMessageConnector(injectIntl(SignMessage));
