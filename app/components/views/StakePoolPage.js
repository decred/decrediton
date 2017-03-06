// @flow
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import StakePool from './StakePool';
import * as StakePoolActions from '../../actions/StakePoolActions';

function mapStateToProps(state) {
  return {
    walletService: state.grpc.walletService,
    currentStakePoolConfig: state.stakepool.currentStakePoolConfig,
    getAccountsResponse: state.grpc.getAccountsResponse,
    getNetworkResponse: state.grpc.getNetworkResponse,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, StakePoolActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(StakePool);
