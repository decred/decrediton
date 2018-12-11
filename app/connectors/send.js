import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";
import * as ca from "../actions/ControlActions";
import * as tza from "../actions/TrezorActions";

const mapStateToProps = selectorMap({
  defaultSpendingAccount: sel.defaultSpendingAccount,
  estimatedSignedSize: sel.estimatedSignedSize,
  unsignedTransaction: sel.unsignedTransaction,
  estimatedFee: sel.estimatedFee,
  totalSpent: sel.totalSpent,
  isSendingTransaction: sel.isSendingTransaction,
  isConstructingTransaction: sel.isConstructingTransaction,
  nextAddress: sel.nextAddress,
  nextAddressAccount: sel.nextAddressAccount,
  unitDivisor: sel.unitDivisor,
  constructTxLowBalance: sel.constructTxLowBalance,
  isTransactionsSendTabDisabled: sel.isTransactionsSendTabDisabled,
  constructTxResponse: sel.constructTxResponse,
  isTrezor: sel.isTrezor,
  unsignedRawTx: sel.unsignedRawTx,
  isWatchingOnly: sel.isWatchingOnly,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onAttemptConstructTransaction: ca.constructTransactionAttempt,
  onAttemptSignTransaction: ca.signTransactionAttempt,
  onClearTransaction: ca.clearTransaction,
  getNextAddressAttempt: ca.getNextAddressAttempt,
  validateAddress: ca.validateAddress,
  onAttemptSignTransactionTrezor: tza.signTransactionAttemptTrezor,
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
