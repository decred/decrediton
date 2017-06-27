// @flow
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Receive from './Receive';
import { getNextAddressAttempt } from '../../actions/ControlActions';

function mapStateToProps(state) {
  return {
    walletService: state.grpc.walletService,

    getNextAddressResponse: state.control.getNextAddressResponse,
    getNextAddressRequestAttempt: state.control.getNextAddressRequestAttempt,
    getNextAddressRequest: state.control.getNextAddressRequest,
    getNextAddressError: state.control.getNextAddressError,
    balances: state.grpc.balances,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({getNextAddressAttempt}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Receive);
