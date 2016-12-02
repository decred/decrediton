// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import * as LoginActions from '../actions/LoginActions';
import * as ClientActions from '../actions/ClientActions';

function mapStateToProps(state) {
  return {
    address: state.login.address,
    port: state.login.port,
    passphrase: state.login.passphrase,
    isLoggedIn: state.login.isLoggedIn,
    isLoggingIn: state.login.isLoggingIn,
    client: state.login.client,
    error: state.login.error,
    isGettingBalance: state.grpc.isGettingBalance,
    balance: state.grpc.balance,
    isCreatingWallet: state.grpc.isCreatingWallet,
    isCreatedWallet: state.grpc.isCreatedWallet,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, LoginActions, ClientActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
