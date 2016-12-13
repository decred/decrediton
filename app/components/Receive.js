// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';

const style = {
  margin: 12,
};

class Receive extends Component{
  static propTypes = {
    client: PropTypes.object,
    isLoggedIn: PropTypes.bool.isRequired,
    getNextAddressResponse: PropTypes.object,
    getNextAddressRequestAttempt: PropTypes.bool.isRequired,
    constructTxResponse: PropTypes.object,
    constructTxRequestAttempt: PropTypes.bool.isRequired,
  };

  render() {
    const { client, isLoggedIn } = this.props;
    const { getNextAddressResponse, getNextAddressAttempt, getNextAddressRequestAttempt } = this.props;
    const { getNextAddressError } = this.props;
    const { constructTxRequestAttempt, constructTransactionAttempt, constructTxResponse } = this.props;

    /* View that will be seen when user has a set Client */
    const receiveView = (
      <div>
        <h1>Receive Page</h1>
        <h3>Current address: {getNextAddressResponse === null ? 'Please refresh' : getNextAddressResponse.address }</h3>
        <RaisedButton
          style={style}
          disabled={getNextAddressRequestAttempt}
          onClick={!getNextAddressRequestAttempt? () => this.props.getNextAddressAttempt(0) : null}
          label={getNextAddressRequestAttempt ? 'Getting new address' : 'Get New Address'}/>
        <RaisedButton
          style={style}
          disabled={constructTxRequestAttempt}
          onClick={!constructTxRequestAttempt? () => this.props.constructTransactionAttempt(0) : null}
          label={constructTxRequestAttempt ? 'Getting tx' : 'get new tx'}/>
        <h3>Current raw tx: {constructTxResponse === null ? 'Please refresh' : constructTxResponse.unsigned_transaction.toString('hex') }</h3>
                    
      </div>);

    /* Check to see that client is not undefined */
    if (isLoggedIn) {
      if (client === undefined) {
        <p>Error occurred, should have client available</p>;
      } else {
        return(receiveView);
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

export default Receive;
