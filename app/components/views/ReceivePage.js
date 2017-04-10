// @flow
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Receive from './Receive';
import * as ClientActions from '../../actions/ClientActions';
import * as ControlActions from '../../actions/ControlActions';

function mapStateToProps(state) {
  return {
    walletService: state.grpc.walletService,

    getNextAddressResponse: state.control.getNextAddressResponse,
    getNextAddressRequestAttempt: state.control.getNextAddressRequestAttempt,
    getNextAddressRequest: state.control.getNextAddressRequest,
    getNextAddressError: state.control.getNextAddressError,
    getAccountsResponse: state.grpc.getAccountsResponse,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ClientActions, ControlActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Receive);
