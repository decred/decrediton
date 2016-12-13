// @flow
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Receive from '../components/Receive';
import * as ClientActions from '../actions/ClientActions';
import * as ControlActions from '../actions/ControlActions';

function mapStateToProps(state) {
  return {
    client: state.login.client,
    isLoggedIn: state.login.isLoggedIn,
    getNextAddressResponse: state.control.getNextAddressResponse,
    getNextAddressRequestAttempt: state.control.getNextAddressRequestAttempt,
    getNextAddressRequest: state.control.getNextAddressRequest,
    getNextAddressError: state.control.getNextAddressError,
    constructTxRequestAttempt: state.control.constructTxRequestAttempt,
    constructTxResponse: state.control.constructTxResponse,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ClientActions, ControlActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Receive);
