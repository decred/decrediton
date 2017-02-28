// @flow
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import StakePool from './StakePool';
import * as StakePoolActions from '../../actions/ClientActions';

function mapStateToProps(state) {
  return {
    walletService: state.grpc.walletService,
    stakePoolInfoConfig: state.stakepool.stakePoolInfoConfig,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, StakePoolActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(StakePool);
