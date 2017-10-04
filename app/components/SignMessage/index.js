import React from "react";
import PropTypes from "prop-types";
import { autobind } from "core-decorators";
import SignMessagePage from "./Page";
import signMessageConnector from "../../connectors/signMessagePage";
import CopyToClipboardButton from "../CopyToClipboardButton";
import "../../style/SecurityCenterSignMessagePage.less";

@autobind
class SignMessage extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    this.props.signMessageCleanStore();
  }

  render() {
    const { signMessageError, signMessageSuccess } = this.props;

    let result = null;
    if (signMessageSuccess) {
      result = (
        <div className="message-signature-nest">
          <div className="message-signature-content">
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
      <div className="page-content message-sign">
        <div className="message-header-title">Sign Message</div>
        <SignMessagePage onSubmit={this.onSubmit} rpcError={signMessageError} />
        {result}
      </div>
    );
  }

  onSubmit(props) {
    this.props.signMessageAttempt(props);
  }
}

SignMessage.propTypes = {
  signMessageCleanStore: PropTypes.func.isRequired,
  signMessageError: PropTypes.string,
  signMessageSuccess: PropTypes.shape({
    signature: PropTypes.string,
  }),
};

export default signMessageConnector(SignMessage);
