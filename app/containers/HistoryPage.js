// @flow
import { connect } from 'react-redux';
import History from '../components/History';

function mapStateToProps(state) {
  return {
    walletService: state.grpc.walletService,
    transactions: state.grpc.transactions,
    getBalanceResponse: state.grpc.getBalanceResponse,
    getBalanceRequestAttempt: state.grpc.getBalanceRequestAttempt,
  };
}

export default connect(mapStateToProps)(History);
