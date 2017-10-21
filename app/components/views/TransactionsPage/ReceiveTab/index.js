import React, { Component } from "react";
import { autobind } from "core-decorators";
import ErrorScreen from "../../../ErrorScreen";
import ReceivePage from "./Page";
import service from "../../../../connectors/service";
import receive from "../../../../connectors/receive";

@autobind
class Receive extends Component{
  render() {
    const { walletService } = this.props;
    const { onRequestAddress } = this;

    return !walletService ? <ErrorScreen /> :
      <ReceivePage {...{
        ...this.props,
        ...this.state,
        onRequestAddress
      }} />;
  }

  onRequestAddress () {
    const { getNextAddressAttempt, account } = this.props;
    getNextAddressAttempt(account.value);
  }
}

export default service(receive(Receive));
