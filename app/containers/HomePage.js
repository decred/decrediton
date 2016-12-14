// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import * as ClientActions from '../actions/ClientActions';
import * as WalletLoaderActions from '../actions/WalletLoaderActions';
import * as ControlActions from '../actions/ControlActions';

function mapStateToProps(state) {
  return {
    isLoggedIn: state.login.isLoggedIn,
    client: state.login.client,

    getBalanceRequestAttempt: state.grpc.getBalanceRequestAttempt,
    getBalanceResponse: state.grpc.getBalanceResponse,
    getStakeInfoRequestAttempt: state.grpc.getStakeInfoRequestAttempt,
    getStakeInfoResponse: state.grpc.getStakeInfoResponse,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ControlActions, WalletLoaderActions, ClientActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
