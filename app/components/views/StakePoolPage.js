// @flow
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import StakePool from './StakePool';
import * as StakePoolActions from '../../actions/StakePoolActions';
import * as ControlActions from '../../actions/ControlActions';
import * as ClientActions from '../../actions/ClientActions';

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
    purchaseTicketsRequestAttempt: state.control.purchaseTicketsRequestAttempt,
    purchaseTicketsError: state.control.purchaseTicketsError,
    purchaseTicketsSuccess: state.control.purchaseTicketsSuccess,
    startAutoBuyerRequestAttempt: state.control.startAutoBuyerRequestAttempt,
    startAutoBuyerError: state.control.startAutoBuyerError,
    startAutoBuyerSuccess: state.control.startAutoBuyerSuccess,
    startAutoBuyerResponse: state.control.startAutoBuyerResponse,
    stopAutoBuyerRequestAttempt: state.control.stopAutoBuyerRequestAttempt,
    stopAutoBuyerError: state.control.stopAutoBuyerError,
    stopAutoBuyerSuccess: state.control.stopAutoBuyerSuccess,
    getBalanceResponse: state.grpc.getBalanceResponse,
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
  return bindActionCreators(Object.assign({}, StakePoolActions, ControlActions, ClientActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(StakePool);
