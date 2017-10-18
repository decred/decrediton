import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";
import * as ca from "../actions/ControlActions";

const mapStateToProps = selectorMap({
  defaultSpendingAccount: sel.defaultSpendingAccount,
  estimatedSignedSize: sel.estimatedSignedSize,
  unsignedTransaction: sel.unsignedTransaction,
  estimatedFee: sel.estimatedFee,
  totalSpent: sel.totalSpent,
  publishedTransactionHash: sel.publishedTransactionHash,
  isSendingTransaction: sel.isSendingTransaction,
  isConstructingTransaction: sel.isConstructingTransaction,
  nextAddress: sel.nextAddress,
  nextAddressAccount: sel.nextAddressAccount
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onAttemptConstructTransaction: ca.constructTransactionAttempt,
  onAttemptSignTransaction: ca.signTransactionAttempt,
  getNextAddressAttempt: ca.getNextAddressAttempt
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
