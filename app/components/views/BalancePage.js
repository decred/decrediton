// @flow
import { connect } from 'react-redux';
import BalanceView from './Balance';
import { bindActionCreators } from 'redux';
import * as ClientActions from '../../actions/ClientActions';

function mapStateToProps(state) {
  return {
    walletService: state.grpc.walletService,
    getAccountsResponse: state.grpc.getAccountsResponse,
    balances: state.grpc.balances,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ClientActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(BalanceView);
