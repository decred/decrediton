// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Home from '../components/Home';
import * as LoginActions from '../actions/LoginActions';

function mapStateToProps(state) {
  return {
    address: state.address,
    port: state.port,
    passphrase: state.passphrase,
    loggedIn: state.loggedIn,
    client: state.client
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(LoginActions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Home);
