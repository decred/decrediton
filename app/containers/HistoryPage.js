// @flow
import { connect } from 'react-redux';
import History from '../components/History';
import { bindActionCreators } from 'redux';
import * as ClientActions from '../actions/ClientActions';

function mapStateToProps(state) {
  return {
    walletService: state.grpc.walletService,
    currentMined: state.grpc.currentMined,
    currentMinedPage: state.grpc.currentMinedPage,
    txPerPage: state.grpc.txPerPage,
    unmined: state.grpc.unmined,
    getBalanceResponse: state.grpc.getBalanceResponse,
    getBalanceRequestAttempt: state.grpc.getBalanceRequestAttempt,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ClientActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(History);
