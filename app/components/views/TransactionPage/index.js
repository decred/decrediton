import React, { Component } from "react";
import { autobind } from "core-decorators";
import { find } from "lodash";
import ErrorScreen from "../../ErrorScreen";
import TransactionPage from "./Page";
import transactionPageConnector from "../../../connectors/transactionPage";

@autobind
class Transaction extends Component {
  render() {
    return  !this.props.walletService ? <ErrorScreen /> : (
      <TransactionPage
        {...{
          ...this.props,
          ...this.state,
          transactionDetails: this.getTransaction(),
        }}
      />
    );
  }

  getTransaction() {
    const { transactions, params } = this.props;
    return find(transactions.All, { txHash: params.txHash });
  }
}

export default transactionPageConnector(Transaction);
