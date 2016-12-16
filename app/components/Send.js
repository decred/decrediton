// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import ErrorScreen from './ErrorScreen';

const style = {
  margin: 12,
};

class Send extends Component{
  static propTypes = {
    walletService: PropTypes.object,

    constructTxResponse: PropTypes.object,
    constructTxRequestAttempt: PropTypes.bool.isRequired,
    publishTransactionResponse: PropTypes.object,
  };

  render() {
    const { walletService } = this.props;
    const { constructTxRequestAttempt } = this.props;
    const { publishTransactionResponse } = this.props;

    /* View that will be seen when user has a set Client */
    const sendView = (
      <div>
        <h1>Send Page</h1>
        <RaisedButton
          style={style}
          disabled={constructTxRequestAttempt}
          onClick={!constructTxRequestAttempt? () => this.props.constructTransactionAttempt(0) : null}
          label={constructTxRequestAttempt ? 'Getting tx' : 'get new tx'}/>
        <h3>Current raw tx: {publishTransactionResponse === null ? 'Please refresh' : publishTransactionResponse.transaction_hash.toString('hex') }</h3>
      </div>);

    /* Check to see that client is not undefined */
    if (walletService === null) {
      return (<ErrorScreen />);
    } else {
      return(sendView);
    }
  }
}

export default Send;
