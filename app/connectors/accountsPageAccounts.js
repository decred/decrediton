import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap, or, bool } from "../fp";
import * as sel from "../selectors";
import * as ca from "../actions/ControlActions";
import * as cla from "../actions/ClientActions";

const mapStateToProps = selectorMap({
  accounts: sel.sortedAccounts,
  hiddenAccounts: sel.hiddenAccounts,
  isLoading: bool(or(
    sel.getNextAccountRequestAttempt,
    sel.renameAccountRequestAttempt
  )),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onRenameAccount: ca.renameAccountAttempt,
  onHideAccount: cla.hideAccount,
  onShowAccount: cla.showAccount,
  onGetNextAccountAttempt: ca.getNextAccountAttempt
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
