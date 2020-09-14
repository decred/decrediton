import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap, or, bool } from "fp";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import * as cla from "actions/ClientActions";

// TODO change this hook to hooks/useAccount instead.
const mapStateToProps = selectorMap({
  walletService: sel.walletService,
  accounts: sel.sortedAccounts,
  hiddenAccounts: sel.hiddenAccounts,
  isLoading: bool(
    or(sel.getNextAccountRequestAttempt, sel.renameAccountRequestAttempt)
  ),
  accountExtendedKey: sel.accountExtendedKey,
  walletName: sel.getWalletName,
  hasTickets: sel.hasTickets
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onRenameAccount: ca.renameAccountAttempt,
      onHideAccount: cla.hideAccount,
      onShowAccount: cla.showAccount,
      onGetAccountExtendedKey: ca.getAccountExtendedKeyAttempt
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps);
