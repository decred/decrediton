// @flow
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import StakePool from './StakePool';
import * as StakePoolActions from '../../actions/StakePoolActions';

function mapStateToProps(state) {
  return {
    walletService: state.grpc.walletService,
    currentStakePoolConfig: state.stakepool.currentStakePoolConfig,
    currentStakePoolConfigRequest: state.stakepool.currentStakePoolConfigRequest,
    currentStakePoolConfigError: state.stakepool.currentStakePoolConfigError,
    activeStakePoolConfig: state.stakepool.activeStakePoolConfig,
    getAccountsResponse: state.grpc.getAccountsResponse,
    network: state.grpc.network,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, StakePoolActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(StakePool);
