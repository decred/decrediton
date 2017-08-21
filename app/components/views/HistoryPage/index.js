// @flow
import React, { Component } from "react";
import { autobind } from "core-decorators";
import Page from "./Page";

@autobind
class HistoryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 0,
      selectedType: "Regular",
      transactionDetails: null,
      detailType: null
    };
  }

  render() {
    const {
      onChangeSelectedType,
      onShowTxDetail,
      onClearTxDetail,
      onPageBackward,
      onPageForward
    } = this;
    const {
      walletService,
      spendableTotalBalance,
      txPerPage,
      getAccountsResponse,
      getNetworkResponse
    } = this.props;
    const {
      currentPage,
      selectedType,
      transactionDetails,
      detailType
    } = this.state;
    const txTypes = this.getTxTypes();
    const paginatedTxs = this.getPaginatedTxs();
    const totalPages = this.getTotalPages();

    return (
      <Page
        {...{
          walletService,
          transactionDetails,
          detailType,
          spendableTotalBalance,
          selectedType,
          txTypes,
          txPerPage,
          paginatedTxs,
          currentPage,
          totalPages,
          getAccountsResponse,
          getNetworkResponse,
          onChangeSelectedType,
          onShowTxDetail,
          onClearTxDetail,
          onPageBackward,
          onPageForward
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
    let { currentPage } = this.state;
    if (currentPage >= this.getTotalPages()) return;
    currentPage++;
    this.setState({ currentPage });
  }

  onPageBackward() {
    let { currentPage } = this.state;
    if (currentPage <= 0) return;
    currentPage--;
    this.setState({ currentPage });
  }

  onChangeSelectedType(type) {
    this.setState({
      selectedType: type.value,
      currentPage: 0
    });
  }

  onShowTxDetail(tx, type) {
    this.setState({transactionDetails: tx, detailType: type});
  }

  onClearTxDetail() {
    this.setState({transactionDetails: null});
  }
}

export default HistoryPage;
