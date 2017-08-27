import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import {
  spendingAccounts,
  defaultSpendingAccount,
  estimatedSignedSize,
  unsignedTransaction,
  estimatedFee,
  totalSpent,
  publishedTransactionHash,
  isSendingTransaction,
  isConstructingTransaction,
  constructTxError,
  signTransactionError,
  publishTransactionError
} from "../selectors";
import {
  clearConstructTxError,
  clearPublishTxError,
  clearSignTxError,
  clearPublishTxSuccess,
  clearTransaction,
  constructTransactionAttempt,
  signTransactionAttempt
} from "../actions/ControlActions";

const mapStateToProps = selectorMap({
  spendingAccounts,
  defaultSpendingAccount,
  estimatedSignedSize,
  unsignedTransaction,
  estimatedFee,
  totalSpent,
  publishedTransactionHash,
  isSendingTransaction,
  isConstructingTransaction,
  constructTxError,
  signTransactionError,
  publishTransactionError
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onClearConstructTxError: clearConstructTxError,
  onClearPublishTxError: clearPublishTxError,
  onClearSignTxError: clearSignTxError,
  onClearPublishTxSuccess: clearPublishTxSuccess,
  onClearTransaction: clearTransaction,
  onAttemptConstructTransaction: constructTransactionAttempt,
  onAttemptSignTransaction: signTransactionAttempt
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
