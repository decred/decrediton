// @flow
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Send from './Send';
import { clearConstructTxError, clearPublishTxError, clearSignTxError, clearPublishTxSuccess, clearTransaction, constructTransactionAttempt, signTransactionAttempt} from '../../actions/ControlActions';

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
    balances: state.grpc.balances,
    getNetworkResponse: state.grpc.getNetworkResponse,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({clearConstructTxError, clearPublishTxError, clearSignTxError, clearPublishTxSuccess, clearTransaction, constructTransactionAttempt, signTransactionAttempt }, dispatch);

}
export default connect(mapStateToProps, mapDispatchToProps)(Send);
