// @flow
import { connect } from 'react-redux';
import BalanceView from './Balance';
import { bindActionCreators } from 'redux';
import * as ClientActions from '../../actions/ClientActions';

function mapStateToProps(state) {
  return {
    walletService: state.grpc.walletService,
    getAccountsResponse: state.grpc.getAccountsResponse,
    getNextAccountSuccess: state.control.getNextAccountSuccess,
    getNextAccountError: state.control.getNextAccountError,
    getNextAccountRequestAttempt: state.control.getNextAccountRequestAttempt,
    renameAccountError: state.control.renameAccountError,
    renameAccountSuccess: state.control.renameAccountSuccess,
    getBalanceResponse: state.grpc.getBalanceResponse,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ClientActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BalanceView);
