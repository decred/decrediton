// @flow
import { connect } from "react-redux";
import History from "./History";

function mapStateToProps(state) {
  return {
    walletService: state.grpc.walletService,
    txPerPage: state.grpc.txPerPage,
    paginatedTxs: state.grpc.paginatedTxs,
    paginatingTxs: state.grpc.paginatingTxs,
    balances: state.grpc.balances,
    getBalanceRequestAttempt: state.grpc.getBalanceRequestAttempt,
    currentPage: state.grpc.currentPage,
    regularTransactionsInfo: state.grpc.regularTransactionsInfo,
    ticketTransactionsInfo: state.grpc.ticketTransactionsInfo,
    voteTransactionsInfo: state.grpc.voteTransactionsInfo,
    revokeTransactionsInfo: state.grpc.revokeTransactionsInfo,
    transactionDetails: state.grpc.transactionDetails,
    getAccountsResponse: state.grpc.getAccountsResponse,
    getNetworkResponse: state.grpc.getNetworkResponse,
    unminedTransactions: state.grpc.unminedTransactions,
  };
}

export default connect(mapStateToProps)(History);
