// @flow
import { connect } from 'react-redux';
import History from '../components/History';
import { bindActionCreators } from 'redux';
import * as ClientActions from '../actions/ClientActions';

function mapStateToProps(state) {
  return {
    walletService: state.grpc.walletService,
    txPerPage: state.grpc.txPerPage,
    paginatedTxs: state.grpc.paginatedTxs,
    paginatingTxs: state.grpc.paginatingTxs,
    getBalanceResponse: state.grpc.getBalanceResponse,
    getBalanceRequestAttempt: state.grpc.getBalanceRequestAttempt,
    currentPage: state.grpc.currentPage,
    transactionsInfo: state.grpc.transactionsInfo,
    getTransactionsRequest: state.grpc.getTransactions,
    transactionDetails: state.grpc.transactionDetails,
    getAccountsResponse: state.grpc.getAccountsResponse,
    getNetworkResponse: state.grpc.getNetworkResponse,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ClientActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(History);
