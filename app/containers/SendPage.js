// @flow
import { connect } from 'react-redux';
import Send from '../components/Send';
import { bindActionCreators } from 'redux';
import * as ControlActions from '../actions/ControlActions';

function mapStateToProps(state) {
  return {
    client: state.login.client,
    isLoggedIn: state.login.isLoggedIn,
    constructTxRequestAttempt: state.control.constructTxRequestAttempt,
    constructTxResponse: state.control.constructTxResponse,
    publishTransactionResponse: state.control.publishTransactionResponse,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(Object.assign({}, ControlActions), dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Send);
