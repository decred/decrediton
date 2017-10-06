import React from "react";
import PropTypes from "prop-types";
import { autobind } from "core-decorators";
import SignMessageForm from "./Form";
import signMessageConnector from "../../connectors/signMessagePage";
import CopyToClipboardButton from "../CopyToClipboardButton";
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
            <CopyToClipboardButton
              key="copyToClipboard"
              className="message-content-nest-copy-to-clipboard-icon"
              textToCopy={signMessageSuccess.signature}
            />
          </div>
        </div>
      );
    }

    return (
      <div className="page-content message message-sign">
        <div className="message-header-title">Sign Message</div>
        <SignMessageForm onSubmit={this.onSubmit} rpcError={signMessageError} />
        {result}
      </div>
    );
  }

  onSubmit(props) {
    this.props.signMessageAttempt(props);
  }
}

SignMessage.propTypes = {
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

export default signMessageConnector(SignMessage);
