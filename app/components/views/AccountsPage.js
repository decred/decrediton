// @flow
import { connect } from 'react-redux';
import Accounts from './Accounts';
import { bindActionCreators } from 'redux';
import {renameAccountAttempt, clearNewAccountSuccess, clearNewAccountError, clearRenameAccountSuccess, clearRenameAccountError, getNextAccountAttempt} from '../../actions/ControlActions';

function mapStateToProps(state) {
  return {
    walletService: state.grpc.walletService,
    getAccountsResponse: state.grpc.getAccountsResponse,
    getNextAccountSuccess: state.control.getNextAccountSuccess,
    getNextAccountError: state.control.getNextAccountError,
    getNextAccountRequestAttempt: state.control.getNextAccountRequestAttempt,
    renameAccountError: state.control.renameAccountError,
    renameAccountSuccess: state.control.renameAccountSuccess,
    balances: state.grpc.balances,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({renameAccountAttempt, clearNewAccountSuccess, clearNewAccountError, clearRenameAccountSuccess, clearRenameAccountError, getNextAccountAttempt}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Accounts);
