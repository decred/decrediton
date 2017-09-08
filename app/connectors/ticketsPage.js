import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { selectorMap, substruct } from "../fp";
import * as selectors from "../selectors";
import * as controlActions from "../actions/ControlActions";
import * as stakePoolActions from "../actions/StakePoolActions";

const mapStateToProps = selectorMap({
  ...substruct({
    spendingAccounts: null,
    configuredStakePools: null,
    unconfiguredStakePools: null,
    defaultSpendingAccount: null,
    defaultStakePool: null,
    ticketPrice: null,
    currentStakePoolConfigError: null,
    currentStakePoolConfigSuccessMessage: null,
    purchaseTicketsError: null,
    purchaseTicketsSuccess: null,
    revokeTicketsError: null,
    revokeTicketsSuccess: null,
    startAutoBuyerSuccess: null,
    stopAutoBuyerSuccess: null,
    startAutoBuyerError: null,
    stopAutoBuyerError: null,
    importScriptError: null,
    importScriptSuccess: null,
    isPurchasingTickets: null,
    isSavingStakePoolConfig: null
  }, selectors),
});

const mapDispatchToProps = dispatch => bindActionCreators({
  ...substruct({
    clearStakePoolConfigError: "onClearStakePoolConfigError",
    clearStakePoolConfigSuccess: "onClearStakePoolConfigSuccess"
  }, stakePoolActions),
  ...substruct({
    revokeTicketsAttempt: "onRevokeTickets",
    importScriptAttempt: "onImportScript",
    clearPurchaseTicketsError: "onClearPurchaseTicketsError",
    clearPurchaseTicketsSuccess: "onClearPurchaseTicketsSuccess",
    clearRevokeTicketsError: "onClearRevokeTicketsError",
    clearRevokeTicketsSuccess: "onClearRevokeTicketsSuccess",
    clearStartAutoBuyerSuccess: "onClearStartAutoBuyerSuccess",
    clearStopAutoBuyerSuccess: "onClearStopAutoBuyerSuccess",
    clearStartAutoBuyerError: "onClearStartAutoBuyerError",
    clearStopAutoBuyerError: "onClearStopAutoBuyerError",
    clearImportScriptError: "onClearImportScriptError",
    clearImportScriptSuccess: "onClearImportScriptSuccess"
  }, controlActions)
}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps);
