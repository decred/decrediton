// @flow
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Purchase from './Purchase';
import * as ClientActions from '../../actions/ClientActions';
import * as ControlActions from '../../actions/ControlActions';

function mapStateToProps(state) {
  return {
    walletService: state.grpc.walletService,
    getAccountsResponse: state.grpc.getAccountsResponse,
    getNetworkResponse: state.grpc.getNetworkResponse,
    purchaseTicketsResponse: state.control.purchaseTicketsResponse,
    purchaseTicketsSuccess: state.control.purchaseTicketsSuccess,
    purchaseTicketsError: state.control.purchaseTicketsError,
    purchaseTicketsRequestAttempt: state.control.purchaseTicketsRequestAttempt,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ControlActions, ClientActions), dispatch);
}
export default connect(mapStateToProps, mapDispatchToProps)(Purchase);
