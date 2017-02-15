// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import * as ClientActions from '../actions/ClientActions';
import * as WalletLoaderActions from '../actions/WalletLoaderActions';
import * as ControlActions from '../actions/ControlActions';

function mapStateToProps(state) {
  return {
    walletService: state.grpc.walletService,
    paginatedTxs: state.grpc.paginatedTxs,
    getBalanceRequestAttempt: state.grpc.getBalanceRequestAttempt,
    getBalanceResponse: state.grpc.getBalanceResponse,
    getStakeInfoRequestAttempt: state.grpc.getStakeInfoRequestAttempt,
    getStakeInfoResponse: state.grpc.getStakeInfoResponse,
    rescanRequestAttempt: state.control.rescanRequestAttempt,
    rescanError: state.control.rescanError,
    rescanResponse: state.control.rescanResponse,
    rescanRequest: state.control.rescanRequest,
    getAccountsResponse: state.grpc.getAccountsResponse,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ControlActions, WalletLoaderActions, ClientActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
