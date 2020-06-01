import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";
import * as ca from "../actions/ControlActions";

const mapStateToProps = selectorMap({
  ticketPrice: sel.ticketPrice,
  spendingAccounts: sel.spendingAccounts,
  rescanRequest: sel.rescanRequest,
  dismissBackupRedeemScript: sel.dismissBackupRedeemScript,
  visibleAccounts: sel.visibleAccounts,
  mixedAccount: sel.getMixedAccount,
  defaultSpendingAccount: sel.defaultSpendingAccount
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onPurchaseTickets: ca.purchaseTicketsAttempt
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps);
