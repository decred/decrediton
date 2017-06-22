// @flow
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import StakePool from './StakePool';
import { clearStakePoolConfigError,
    clearStakePoolConfigSuccess,
    setStakePoolInformation,
  } from '../../actions/StakePoolActions';
import { purchaseTicketsAttempt,
    revokeTicketsAttempt,
    clearStartAutoBuyerSuccess,
    clearStartAutoBuyerError,
    clearStopAutoBuyerSuccess,
    clearStopAutoBuyerError,
    clearPurchaseTicketsSuccess,
    clearPurchaseTicketsError,
    clearRevokeTicketsSuccess,
    clearRevokeTicketsError,
    clearImportScriptSuccess,
    clearImportScriptError,
    importScriptAttempt,
    startAutoBuyerAttempt,
    stopAutoBuyerAttempt, } from '../../actions/ControlActions';
import { setVoteChoicesAttempt } from '../../actions/ClientActions';

function mapStateToProps(state) {
  return {
    walletService: state.grpc.walletService,
    ticketBuyerService: state.grpc.ticketBuyerService,
    currentStakePoolConfig: state.stakepool.currentStakePoolConfig,
    currentStakePoolConfigRequest: state.stakepool.currentStakePoolConfigRequest,
    currentStakePoolConfigError: state.stakepool.currentStakePoolConfigError,
    activeStakePoolConfig: state.stakepool.activeStakePoolConfig,
    getAccountsResponse: state.grpc.getAccountsResponse,
    currentStakePoolConfigSuccessMessage: state.stakepool.currentStakePoolConfigSuccessMessage,
    network: state.grpc.network,
    requiredStakepoolAPIVersion: state.grpc.requiredStakepoolAPIVersion,
    purchaseTicketsRequestAttempt: state.control.purchaseTicketsRequestAttempt,
    purchaseTicketsError: state.control.purchaseTicketsError,
    purchaseTicketsSuccess: state.control.purchaseTicketsSuccess,
    revokeTicketsRequestAttempt: state.control.revokeTicketsRequestAttempt,
    revokeTicketsError: state.control.revokeTicketsError,
    revokeTicketsSuccess: state.control.revokeTicketsSuccess,
    importScriptSuccess: state.control.importScriptSuccess,
    importScriptError: state.control.importScriptError,
    startAutoBuyerRequestAttempt: state.control.startAutoBuyerRequestAttempt,
    startAutoBuyerError: state.control.startAutoBuyerError,
    startAutoBuyerSuccess: state.control.startAutoBuyerSuccess,
    startAutoBuyerResponse: state.control.startAutoBuyerResponse,
    stopAutoBuyerRequestAttempt: state.control.stopAutoBuyerRequestAttempt,
    stopAutoBuyerError: state.control.stopAutoBuyerError,
    stopAutoBuyerSuccess: state.control.stopAutoBuyerSuccess,
    balances: state.grpc.balances,
    getStakeInfoResponse: state.grpc.getStakeInfoResponse,
    getTicketPriceResponse: state.grpc.getTicketPriceResponse,
    getAgendasResponse: state.grpc.getAgendasResponse,
    getVoteChoicesResponse: state.grpc.getVoteChoicesResponse,
    balanceToMaintain: state.control.balanceToMaintain,
    maxFee: state.control.maxFee,
    maxPriceRelative: state.control.maxPriceRelative,
    maxPriceAbsolute: state.control.maxPriceAbsolute,
    maxPerBlock:  state.control.maxPerBlock,
    getTicketBuyerConfigResponse: state.control.getTicketBuyerConfigResponse,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({
    clearStakePoolConfigError,
    clearStakePoolConfigSuccess,
    clearStartAutoBuyerSuccess,
    clearStartAutoBuyerError,
    clearStopAutoBuyerSuccess,
    clearStopAutoBuyerError,
    setStakePoolInformation,
    setVoteChoicesAttempt,
    purchaseTicketsAttempt,
    revokeTicketsAttempt,
    clearPurchaseTicketsSuccess,
    clearPurchaseTicketsError,
    clearRevokeTicketsSuccess,
    clearRevokeTicketsError,
    clearImportScriptSuccess,
    clearImportScriptError,
    importScriptAttempt,
    startAutoBuyerAttempt,
    stopAutoBuyerAttempt  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(StakePool);
