// @flow
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import StakePool from './StakePool';
import * as ClientActions from '../../actions/ClientActions';
import * as ControlActions from '../../actions/ControlActions';

function mapStateToProps(state) {
  return {
    walletService: state.grpc.walletService,
    stakePoolInfoConfig: state.stakepool.stakePoolInfoConfig,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ClientActions, ControlActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(StakePool);
