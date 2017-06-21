// @flow
import { connect } from 'react-redux';
import History from './History';
import { bindActionCreators } from 'redux';
import * as ClientActions from '../../actions/ClientActions';

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
    getTransactionsRequest: state.grpc.getTransactions,
    transactionDetails: state.grpc.transactionDetails,
    getAccountsResponse: state.grpc.getAccountsResponse,
    getNetworkResponse: state.grpc.getNetworkResponse,
    unminedTransactions: state.grpc.unminedTransactions,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(History);
