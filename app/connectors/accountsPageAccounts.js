import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap, or, bool } from "../fp";
import * as sel from "../selectors";
import * as ca from "../actions/ControlActions";
import * as cla from "../actions/ClientActions";

const mapStateToProps = selectorMap({
  accounts: sel.sortedAccounts,
  hiddenAccounts: sel.hiddenAccounts,
  getNextAccountSuccess: sel.getNextAccountSuccess,
  isLoading: bool(or(
    sel.getNextAccountRequestAttempt,
    sel.renameAccountRequestAttempt
  )),
  getNextAccountError: sel.getNextAccountError,
  renameAccountError: sel.renameAccountError,
  renameAccountSuccess: sel.renameAccountSuccess
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onRenameAccount: ca.renameAccountAttempt,
  onClearNewAccountSuccess: ca.clearNewAccountSuccess,
  onClearNewAccountError: ca.clearNewAccountError,
  onClearRenameAccountSuccess: ca.clearRenameAccountSuccess,
  onClearRenameAccountError: ca.clearRenameAccountError,
  onHideAccount: cla.hideAccount,
  onShowAccount: cla.showAccount
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
