import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap } from "../fp";
import * as sel from "../selectors";
import * as ca from "../actions/ControlActions";
import * as spa from "actions/VSPActions";

const mapStateToProps = selectorMap({
  ticketPrice: sel.ticketPrice,
  spendingAccounts: sel.spendingAccounts,
  rescanRequest: sel.rescanRequest,
  dismissBackupRedeemScript: sel.dismissBackupRedeemScript,
  visibleAccounts: sel.visibleAccounts,
  mixedAccount: sel.getMixedAccount,
  configuredStakePools: sel.configuredStakePools,
  numTicketsToBuy: sel.numTicketsToBuy,
  defaultSpendingAccount: sel.defaultSpendingAccount,
  stakePool: sel.selectedStakePool,
  unconfiguredStakePools: sel.unconfiguredStakePools,
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
  isTestNet: sel.isTestNet,
  sidebarOnBottom: sel.sidebarOnBottom,
  isWatchingOnly: sel.isWatchingOnly,
  splitTx: sel.splitTx,
  spvMode: sel.isSPV,
  blocksNumberToNextTicket: sel.blocksNumberToNextTicket,
  unsignedTickets: sel.ticketsList,
  defaultStakePool: sel.defaultStakePool,
  stakePoolListingEnabled: sel.stakePoolListingEnabled,
  isAddingCustomStakePool: sel.isAddingCustomStakePool
});

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      onPurchaseTickets: ca.purchaseTicketsAttempt,
      onChangeStakePool: spa.changeSelectedStakePool,
      onRevokeTickets: ca.revokeTicketsAttempt,
      onImportScript: ca.manualImportScriptAttempt,
      onClearRevokeTicketsError: ca.clearRevokeTicketsError,
      onClearRevokeTicketsSuccess: ca.clearRevokeTicketsSuccess,
      onClearImportScriptError: ca.clearImportScriptError,
      onClearImportScriptSuccess: ca.clearImportScriptSuccess,
      onDismissBackupRedeemScript: spa.dismissBackupRedeemScript,
      onSetStakePoolInfo: spa.setStakePoolInformation,
      onRemoveStakePool: spa.removeStakePoolConfig,
      discoverAvailableStakepools: spa.discoverAvailableVSPs,
      addCustomStakePool: spa.addCustomStakePool
    },
    dispatch
  );

export default connect(mapStateToProps, mapDispatchToProps);
