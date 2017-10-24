import React, { Component } from "react";
import { autobind } from "core-decorators";
import ErrorScreen from "ErrorScreen";
import MyTicketsPage from "./Page";
import service from "connectors/service";

@autobind
class MyTickets extends Component{
  render() {
    const { walletService } = this.props;

    return walletService
      ? <MyTicketsPage {...{
        ...this.props,
        ...this.state
      }} />
      : <ErrorScreen />;
  }
}

export default service(MyTickets);
