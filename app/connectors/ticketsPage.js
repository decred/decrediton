import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";
import * as ca from "../actions/ControlActions";
import * as spa from "../actions/StakePoolActions";

const mapStateToProps = selectorMap({
  spendingAccounts: sel.spendingAccounts,
  configuredStakePools: sel.configuredStakePools,
  unconfiguredStakePools: sel.unconfiguredStakePools,
  defaultSpendingAccount: sel.defaultSpendingAccount,
  defaultStakePool: sel.defaultStakePool,
  ticketPrice: sel.ticketPrice,
  currentStakePoolConfigError: sel.currentStakePoolConfigError,
  currentStakePoolConfigSuccessMessage: sel.currentStakePoolConfigSuccessMessage,
  purchaseTicketsError: sel.purchaseTicketsError,
  purchaseTicketsSuccess: sel.purchaseTicketsSuccess,
  revokeTicketsError: sel.revokeTicketsError,
  revokeTicketsSuccess: sel.revokeTicketsSuccess,
  startAutoBuyerSuccess: sel.startAutoBuyerSuccess,
  stopAutoBuyerSuccess: sel.stopAutoBuyerSuccess,
  startAutoBuyerError: sel.startAutoBuyerError,
  stopAutoBuyerError: sel.stopAutoBuyerError,
  importScriptError: sel.importScriptError,
  importScriptSuccess: sel.importScriptSuccess,
  isPurchasingTickets: sel.isPurchasingTickets,
  isSavingStakePoolConfig: sel.isSavingStakePoolConfig,
  isTestNet: sel.isTestNet,
});

const mapDispatchToProps = dispatch => bindActionCreators({
  onClearStakePoolConfigError: spa.clearStakePoolConfigError,
  onClearStakePoolConfigSuccess: spa.clearStakePoolConfigSuccess,
  onRevokeTickets: ca.revokeTicketsAttempt,
  onImportScript: ca.importScriptAttempt,
  onClearPurchaseTicketsError: ca.clearPurchaseTicketsError,
  onClearPurchaseTicketsSuccess: ca.clearPurchaseTicketsSuccess,
  onClearRevokeTicketsError: ca.clearRevokeTicketsError,
  onClearRevokeTicketsSuccess: ca.clearRevokeTicketsSuccess,
  onClearStartAutoBuyerSuccess: ca.clearStartAutoBuyerSuccess,
  onClearStartAutoBuyerError: ca.clearStartAutoBuyerError,
  onClearStopAutoBuyerSuccess: ca.clearStopAutoBuyerSuccess,
  onClearStopAutoBuyerError: ca.clearStopAutoBuyerError,
  onClearImportScriptError: ca.clearImportScriptError,
  onClearImportScriptSuccess: ca.clearImportScriptSuccess
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
