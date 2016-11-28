// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import * as LoginActions from '../actions/LoginActions';

function mapStateToProps(state) {
  return {
    address: state.login.address,
    port: state.login.port,
    passphrase: state.login.passphrase,
    loggedIn: state.login.loggedIn,
    client: state.login.client,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(LoginActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
