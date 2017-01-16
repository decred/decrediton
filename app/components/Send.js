// @flow
import React, { Component, PropTypes } from 'react';
import ErrorScreen from './ErrorScreen';
import ConstructTxForm from '../containers/ConstructTxForm';
import SignTxForm from '../containers/SignTxForm';
import ShowError from './ShowError';
import { reverseHash } from '../helpers/byteActions';
import SideBar from './SideBar';
import Header from './Header';

const styles = {
  body: {
    height: '100%'
  },
  content: { 
    position: 'absolute',
    top: '70px',
    left: '202px',
    bottom: '0px',
    right: '0px',
  },
}

class Send extends Component{
  static propTypes = {
    walletService: PropTypes.object,

    constructTxResponse: PropTypes.object,
    constructTxRequestAttempt: PropTypes.bool.isRequired,

    publishTransactionResponse: PropTypes.object,
  };

  render() {
    const { walletService } = this.props;
    const { constructTxResponse, constructTxError } = this.props;
    const { publishTransactionResponse, publishTransactionError } = this.props;
    const { signTransactionError } = this.props;

    const constructTxView = (
      <div style={styles.content}>
        <ShowError error={constructTxError}/>
        <h1>Construct Tx</h1>
        <ConstructTxForm />
      </div>);

    const signTxView = (
      <div style={styles.content}>
        <ShowError error={signTransactionError}/>
        <h1>Sign tx</h1>
        <p> raw tx <br/>
          {constructTxResponse !== null ? constructTxResponse.getUnsignedTransaction() : null}}
        </p>
        <p> total previous output amount <br/>
          {constructTxResponse != null ? constructTxResponse.getTotalPreviousOutputAmount() : null}
        </p>
        <p> total output amount <br/>
          {constructTxResponse !== null ? constructTxResponse.getTotalOutputAmount() : null}
        </p>
        <p> estimated signed size <br/>
          {constructTxResponse !== null ? constructTxResponse.getEstimatedSignedSize() : null}
        </p>
        <SignTxForm rawTx={constructTxResponse !== null ? constructTxResponse.getUnsignedTransaction() : null}/>
      </div>);

    var sendView;

    const publishTxView = (
      <div style={styles.content}>
        <ShowError error={publishTransactionError}/>
        <h1>Published Tx!</h1>
        <p>{publishTransactionResponse !== null ? reverseHash(publishTransactionResponse.toString('hex')) : null}</p>
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
      return(
        <div style={styles.body}>
          <Header />
          <SideBar />
          {sendView}
        </div>);
    }
  }
}

export default Send;
