import React, { Component } from "react";
import { autobind } from "core-decorators";
import { substruct } from "../../../fp";
import ErrorScreen from "../../ErrorScreen";
import HomePage from "./Page";
import service from "../../../connectors/service";

@autobind
class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      transactionDetails: null
    };
  }

  render() {
    return this.props.walletService
      ? ( <HomePage {...{
        ...this.props,
        ...this.state,
        ...substruct({
          onShowTxDetail: null,
          onClearTxDetail: null
        }, this)
      } } /> )
      : ( <ErrorScreen /> );
  }

  onShowTxDetail(transactionDetails) {
    this.setState({ transactionDetails });
  }

  onClearTxDetail() {
    this.setState({ transactionDetails: null });
  }
}

export default service(Home);
