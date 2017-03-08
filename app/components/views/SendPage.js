// @flow
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Send from './Send';
import * as ControlActions from '../../actions/ControlActions';

function mapStateToProps(state) {
  return {
    walletService: state.grpc.walletService,

    constructTxRequestAttempt: state.control.constructTxRequestAttempt,
    constructTxRequest: state.control.constructTxRequest,
    constructTxResponse: state.control.constructTxResponse,
    constructTxError: state.control.constructTxError,
    signTransactionError: state.control.signTransactionError,
    signTransactionRequestAttempt: state.control.signTransactionRequestAttempt,
    publishTransactionResponse: state.control.publishTransactionResponse,
    publishTransactionRequestAttempt: state.control.publishTransactionRequestAttempt,
    publishTransactionError: state.control.publishTransactionError,
    getAccountsResponse: state.grpc.getAccountsResponse,
    getNetworkResponse: state.grpc.getNetworkResponse,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ControlActions), dispatch);

}
export default connect(mapStateToProps, mapDispatchToProps)(Send);
