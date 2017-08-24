import React, { Component } from "react";
import { autobind } from "core-decorators";
import ErrorScreen from "../../ErrorScreen";
import ReceivePage from "./Page";
import service from "../../../connectors/service";
import receive from "../../../connectors/receive";

@autobind
class Receive extends Component{
  constructor(props) {
    super(props);
    this.state = {
      account: props.nextAddressAccount
    };
  }

  render() {
    const { walletService } = this.props;
    const { onChangeAccountNumber, onRequestAddress } = this;

    return walletService
      ? <ReceivePage {...{
        onChangeAccountNumber, onRequestAddress, ...this.props, ...this.state
      }} />
      : <ErrorScreen />;
  }

  onChangeAccountNumber(account) {
    this.setState({ account });
    this.props.getNextAddressAttempt(account.value);
  }

  onRequestAddress() {
    const { isRequestingAddress, getNextAddressAttempt } = this.props;
    isRequestingAddress ? null : getNextAddressAttempt(this.state.account.value);
  }
}

export default service(receive(Receive));
