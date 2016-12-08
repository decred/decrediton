// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import * as LoginActions from '../actions/LoginActions';
import * as ClientActions from '../actions/ClientActions';
import * as WalletLoaderActions from '../actions/WalletLoaderActions';

function mapStateToProps(state) {
  return {
    address: state.login.address,
    port: state.login.port,
    passphrase: state.login.passphrase,
    isLoggedIn: state.login.isLoggedIn,
    isLoggingIn: state.login.isLoggingIn,
    client: state.login.client,
    error: state.login.error,

    // WalletServices
    getBalanceRequestAttempt: state.grpc.getBalanceRequestAttempt,
    getBalanceResponse: state.grpc.getBalanceResponse,
    getStakeInfoRequestAttempt: state.grpc.getStakeInfoRequestAttempt,
    getStakeInfoResponse: state.grpc.getStakeInfoResponse,

    // WalletLoaderServices
    walletCreateRequestAttempt: state.walletLoader.walletCreateRequestAttempt,
    walletCreateResponse: state.walletLoader.walletCreateResponse,
    walletExistRequestAttempt: state.walletLoader.walletExistRequestAttempt,
    walletExistResponse: state.walletLoader.walletExistResponse,

    getLoaderRequestAttempt: state.walletLoader.getLoaderRequestAttempt,
    loader: state.walletLoader.loader,

    walletOpenRequestAttempt: state.walletLoader.walletOpenRequestAttempt,
    walletOpenResponse: state.walletLoader.walletOpenResponse,

  
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, WalletLoaderActions, LoginActions, ClientActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
