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
  constructTxError: sel.constructTxError,
  signTransactionError: sel.signTransactionError,
  publishTransactionError: sel.publishTransactionError
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onClearConstructTxError: ca.clearConstructTxError,
  onClearPublishTxError: ca.clearPublishTxError,
  onClearSignTxError: ca.clearSignTxError,
  onClearPublishTxSuccess: ca.clearPublishTxSuccess,
  onClearTransaction: ca.clearTransaction,
  onAttemptConstructTransaction: ca.constructTransactionAttempt,
  onAttemptSignTransaction: ca.signTransactionAttempt
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
