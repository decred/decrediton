import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "fp";
import * as sel from "selectors";
import * as ca from "actions/ControlActions";
import * as spa from "actions/StakePoolActions";

const mapStateToProps = selectorMap({
  spendingAccounts: sel.spendingAccounts,
  configuredStakePools: sel.configuredStakePools,
  unconfiguredStakePools: sel.unconfiguredStakePools,
  defaultSpendingAccount: sel.defaultSpendingAccount,
  defaultStakePool: sel.defaultStakePool,
  stakePool: sel.selectedStakePool,
  ticketPrice: sel.ticketPrice,
  currentStakePoolConfigError: sel.currentStakePoolConfigError,
  currentStakePoolConfigSuccessMessage:
    sel.currentStakePoolConfigSuccessMessage,
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
  isImportingScript: sel.isImportingScript,
  isPurchasingTickets: sel.isPurchasingTickets,
  isSavingStakePoolConfig: sel.isSavingStakePoolConfig,
  isTestNet: sel.isTestNet,
  numTicketsToBuy: sel.numTicketsToBuy,
  sidebarOnBottom: sel.sidebarOnBottom,
  isWatchingOnly: sel.isWatchingOnly,
  splitTx: sel.splitTx,
  unsignedTickets: sel.ticketsList
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onRevokeTickets: ca.revokeTicketsAttempt,
      onImportScript: ca.manualImportScriptAttempt,
      onClearRevokeTicketsError: ca.clearRevokeTicketsError,
      onClearRevokeTicketsSuccess: ca.clearRevokeTicketsSuccess,
      onClearImportScriptError: ca.clearImportScriptError,
      onClearImportScriptSuccess: ca.clearImportScriptSuccess,
      onChangeStakePool: spa.changeSelectedStakePool,
      onDismissBackupRedeemScript: spa.dismissBackupRedeemScript
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps);
