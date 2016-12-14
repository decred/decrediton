// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
  margin: 12,
};

class Send extends Component{
  static propTypes = {
    client: PropTypes.object,
    isLoggedIn: PropTypes.bool.isRequired,
    constructTxResponse: PropTypes.object,
    constructTxRequestAttempt: PropTypes.bool.isRequired,
    publishTransactionResponse: PropTypes.object,
  };

  render() {
    const { client, isLoggedIn } = this.props;
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
    if (isLoggedIn) {
      if (client === undefined) {
        <p>Error occurred, should have client available</p>;
      } else {
        return(sendView);
      }
    } else {
      return(
        <div>
          <p>Error occurred, should be logged in</p>
        </div>
      );
    }
  }
}

export default Send;
