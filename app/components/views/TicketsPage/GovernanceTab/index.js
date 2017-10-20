import React, { Component } from "react";
import { autobind } from "core-decorators";
import ErrorScreen from "../../../ErrorScreen";
import GovernancePage from "./Page";
import service from "../../../../connectors/service";

@autobind
class Governance extends Component{
  render() {
    const { walletService } = this.props;

    return walletService
      ? <GovernancePage {...{
        ...this.props,
        ...this.state
      }} />
      : <ErrorScreen />;
  }
}

export default service(Governance);
