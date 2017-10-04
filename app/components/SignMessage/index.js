import React from "react";
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
        {error}
        <SignMessagePage onSubmit={this.onSubmit} />
        {result}
      </div>
    );
  }

  onSubmit(props) {
    console.log(props);
    this.props.signMessageAttempt(props);
  }
}

export default signMessageConnector(SignMessage);
