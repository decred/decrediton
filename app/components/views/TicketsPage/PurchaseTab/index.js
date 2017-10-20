import React, { Component } from "react";
import { autobind } from "core-decorators";
import ErrorScreen from "../../../ErrorScreen";
import PurchasePage from "./Page";
import service from "../../../../connectors/service";

@autobind
class Purchase extends Component{
  render() {
    const { walletService } = this.props;

    return walletService
      ? <PurchasePage {...{
        ...this.props,
        ...this.state
      }} />
      : <ErrorScreen />;
  }
}

export default service(Purchase);
