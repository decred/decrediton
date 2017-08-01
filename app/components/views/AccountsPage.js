// @flow
import { connect } from "react-redux";
import Accounts from "./Accounts";
import { bindActionCreators } from "redux";
import {renameAccountAttempt, clearNewAccountSuccess, clearNewAccountError, clearRenameAccountSuccess, clearRenameAccountError, getNextAccountAttempt} from "../../actions/ControlActions";
import { hideAccount, showAccount } from "../../actions/ClientActions";
function mapStateToProps(state) {
  return {
    walletService: state.grpc.walletService,
    getNextAccountSuccess: state.control.getNextAccountSuccess,
    getNextAccountError: state.control.getNextAccountError,
    getNextAccountRequestAttempt: state.control.getNextAccountRequestAttempt,
    renameAccountError: state.control.renameAccountError,
    renameAccountSuccess: state.control.renameAccountSuccess,
    balances: state.grpc.balances,
    hiddenAccounts: state.grpc.hiddenAccounts,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({renameAccountAttempt, clearNewAccountSuccess, clearNewAccountError, clearRenameAccountSuccess, clearRenameAccountError, getNextAccountAttempt, hideAccount, showAccount}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Accounts);
