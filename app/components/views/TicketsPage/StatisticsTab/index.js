import React, { Component } from "react";
import { autobind } from "core-decorators";
import ErrorScreen from "../../../ErrorScreen";
import StatisticsPage from "./Page";
import service from "../../../../connectors/service";

@autobind
class Statistics extends Component{
  render() {
    const { walletService } = this.props;

    return walletService
      ? <StatisticsPage {...{
        ...this.props,
        ...this.state
      }} />
      : <ErrorScreen />;
  }
}

export default service(Statistics);
