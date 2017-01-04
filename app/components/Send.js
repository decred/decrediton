// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import ErrorScreen from './ErrorScreen';
import TextField from 'material-ui/TextField';
import ConstructTxForm from '../containers/ConstructTxForm';
import SignTxForm from '../containers/SignTxForm';
import ShowError from './ShowError';
import { reverseHash } from '../helpers/byteActions';

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
    const { constructTxRequestAttempt, constructTxResponse, constructTxError } = this.props;
    const { publishTransactionResponse, publishTransactionError } = this.props;
    const { signTransactionError } = this.props;

    const constructTxView = (
      <div>
        <ShowError error={constructTxError}/>
        <h1>Construct Tx</h1>
        <ConstructTxForm />
      </div>);

    const signTxView = (
      <div>
        <ShowError error={signTransactionError}/>
        <h1>Sign tx</h1>
        <p> raw tx
          {constructTxResponse !== null ? constructTxResponse.getUnsignedTransaction() : null}}
        </p>
        <p> total previous output amount
          {constructTxResponse != null ? constructTxResponse.getTotalPreviousOutputAmount() : null}
        </p>
        <p> total output amount
          {constructTxResponse !== null ? constructTxResponse.getTotalOutputAmount() : null}
        </p>
        <p> estimated signed size
          {constructTxResponse !== null ? constructTxResponse.getEstimatedSignedSize() : null}
        </p>
        <SignTxForm rawTx={constructTxResponse !== null ? constructTxResponse.getUnsignedTransaction() : null}/>
      </div>);

    var sendView;

    const publishTxView = (
      <div>
        <h1>Published Tx!</h1>
        <p>{publishTransactionResponse !== null ? publishTransactionResponse.getTransactionHash() : null}</p>
      </div>);

    if (constructTxResponse === null) {
      sendView = constructTxView;
    } else {
      if (publishTransactionResponse === null) {
        sendView = signTxView;
      } else {
        sendView = publishTxView;
      }
    }
    /* Check to see that client is not undefined */
    if (walletService === null) {
      return (<ErrorScreen />);
    } else {
      return(sendView);
    }
  }
}

export default Send;
