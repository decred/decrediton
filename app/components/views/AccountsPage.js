// @flow
import { connect } from 'react-redux';
import Accounts from './Accounts';
import { bindActionCreators } from 'redux';
import * as ClientActions from '../../actions/ClientActions';
import * as ControlActions from '../../actions/ControlActions';

function mapStateToProps(state) {
  return {
    walletService: state.grpc.walletService,
    getAccountsResponse: state.grpc.getAccountsResponse,
    getNextAccountSuccess: state.control.getNextAccountSuccess,
    getNextAccountError: state.control.getNextAccountError,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ControlActions, ClientActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Accounts);
