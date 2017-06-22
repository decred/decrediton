// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from './Home';
import { getAccountsAttempt } from '../../actions/ClientActions';
import { rescanAttempt } from '../../actions/ControlActions';

function mapStateToProps(state) {
  return {
    walletService: state.grpc.walletService,
    getBalanceRequestAttempt: state.grpc.getBalanceRequestAttempt,
    balances: state.grpc.balances,
    getStakeInfoRequestAttempt: state.grpc.getStakeInfoRequestAttempt,
    getStakeInfoResponse: state.grpc.getStakeInfoResponse,
    rescanRequestAttempt: state.control.rescanRequestAttempt,
    rescanError: state.control.rescanError,
    rescanResponse: state.control.rescanResponse,
    rescanRequest: state.control.rescanRequest,
    getAccountsResponse: state.grpc.getAccountsResponse,
    synced: state.notifications.synced,
    unminedTransactions: state.grpc.unminedTransactions,
    unmined: state.notifications.unmined,
    getTransactionsRequestAttempt: state.grpc.getTransactionsRequestAttempt,
    regularTransactionsInfo: state.grpc.regularTransactionsInfo,
    ticketTransactionsInfo: state.grpc.ticketTransactionsInfo,
    voteTransactionsInfo: state.grpc.voteTransactionsInfo,
    revokeTransactionsInfo: state.grpc.revokeTransactionsInfo,
    txPerPage: state.grpc.txPerPage,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getAccountsAttempt, rescanAttempt}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
