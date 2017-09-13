import React, { Component } from "react";
import { autobind } from "core-decorators";
import { substruct } from "../../../fp";
import ErrorScreen from "../../ErrorScreen";
import HistoryPage from "./Page";
import historyPageConnector from "../../../connectors/historyPage";

@autobind
class History extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      selectedType: "Regular",
      transactionDetails: null
    };
  }

  render() {
    return  !this.props.walletService ? <ErrorScreen /> : (
      <HistoryPage
        {...{
          ...this.props,
          ...this.state,
          txTypes: this.getTxTypes(),
          paginatedTxs: this.getPaginatedTxs(),
          totalPages: this.getTotalPages(),
          ...substruct({
            onChangeSelectedType: null,
            onShowTxDetail: null,
            onClearTxDetail: null,
            onPageBackward: null,
            onPageForward: null
          }, this)
        }}
      />
    );
  }

  getTxTypes() {
    return Object.keys(this.props.transactions)
      .filter(key => this.props.transactions[key].length > 0)
      .map(name => ({ value: name, label: name }));
  }

  getTxs() {
    const { selectedType } = this.state;
    const { transactions } = this.props;
    return transactions[selectedType] || [];
  }

  getTotalPages() {
    const { txPerPage } = this.props;
    const allTxs = this.getTxs();
    return (allTxs.length > 0) ? Math.ceil(allTxs.length / txPerPage) : 1;
  }

  getPaginatedTxs() {
    const { currentPage } = this.state;
    const { txPerPage } = this.props;
    const start = currentPage * txPerPage;
    return this.getTxs().slice(start, start + txPerPage);
  }

  onPageForward() {
    const { currentPage } = this.state;
    const totalPages = this.getTotalPages();
    this.setState({ currentPage: currentPage >= totalPages ? totalPages : currentPage + 1 });
  }

  onPageBackward() {
    const { currentPage } = this.state;
    this.setState({ currentPage: currentPage <= 0 ? 0 : currentPage - 1 });
  }

  onChangeSelectedType(type) {
    this.setState({
      selectedType: type.value,
      currentPage: 0
    });
  }

  onShowTxDetail(transactionDetails) {
    this.setState({ transactionDetails });
  }

  onClearTxDetail() {
    this.setState({ transactionDetails: null });
  }
}

export default historyPageConnector(History);
