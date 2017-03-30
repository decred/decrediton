// @flow
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import StakePool from './StakePool';
import * as StakePoolActions from '../../actions/StakePoolActions';
import * as ControlActions from '../../actions/ControlActions';

function mapStateToProps(state) {
  return {
    walletService: state.grpc.walletService,
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
    getBalanceResponse: state.grpc.getBalanceResponse,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, StakePoolActions, ControlActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(StakePool);
