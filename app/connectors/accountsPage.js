import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap, or, bool } from "fp";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import * as cla from "actions/ClientActions";

const mapStateToProps = selectorMap({
  walletService: sel.walletService,
  isCreateAccountDisabled: sel.isCreateAccountDisabled,
  accounts: sel.sortedAccounts,
  hiddenAccounts: sel.hiddenAccounts,
  isLoading: bool(or(
    sel.getNextAccountRequestAttempt,
    sel.renameAccountRequestAttempt
  )),
  accountExtendedKey: sel.accountExtendedKey,
  walletName: sel.getWalletName,
  hasTickets: sel.hasTickets
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onRenameAccount: ca.renameAccountAttempt,
  onHideAccount: cla.hideAccount,
  onShowAccount: cla.showAccount,
  onGetNextAccountAttempt: ca.getNextAccountAttempt,
  onGetAccountExtendedKey: ca.getAccountExtendedKeyAttempt
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
