// @flow
import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';
import ErrorScreen from './ErrorScreen';

const styles = {
  pageContentWrapper: {
    width: '100%',
    position: 'absolute',
    paddingBottom: '60px',
  },
  //MYDECRED
  header: {
    backgroundColor: '#F9FBFC',
    textAlign: 'center',
    borderBottom: '1px solid #e2e2e2',
  },
  center: {
    textAlign: 'center',
    justifyContent: 'center', 
    alignItems: 'center',
  },
  img: {
    width: '150px',
    height: '150px',
    margin: '25px 0 50px 0'
  },

  colXs12: {
    justifyContent: 'center', 
    alignItems: 'center',
    textAlign: 'center',
    borderBottom: '1px solid #e2e2e2',
    backgroundColor: '#F9FBFC',
  },

  well: {
      fontWeight: 'bold',
      //font-family: $inconsolata;
      fontSize: '1.2rem',
      backgroundColor:'#e9f8fe',
      padding: '5px 5px',
      margin: '-20px 0 15px 0',
      border: '2px solid #cacfd6',
      borderRadius: '2px',
      textAlign: 'center',
      color: '#0c1e3e',
      boxShadow: 'none!important',
  },
  btnStyle: () => {
      return {
        justifyContent: 'center', 
        alignItems: 'center',
        fontSize: '1.8rem',
        background: 'linear-gradient(#699bff, #2972ff)',
        border: 'none',
        borderRadius: 8,
        boxShadow: '0px 5px 5px 0px rgba(0, 0, 0, 0.3)',
        padding: '14px 16px',
        marginBottom: '20px',
        color: 'white',
    }
  },
  btnInfoHover: {
    background: '#2970ff',
  },

  btnInfoFocus: {
    background: '#5a6d81 !important',
    boxShadow: '0px 5px 5px 0px rgba(0, 0, 0, 0.3)'
  },
   btnInfoActive: {
    background: '#5a6d81 !important',
    boxShadow: '0px 5px 5px 0px rgba(0, 0, 0, 0.3)',
  },
};

class Receive extends Component{
  static propTypes = {
    walletService: PropTypes.object,
    getNextAddressResponse: PropTypes.object,
    getNextAddressRequestAttempt: PropTypes.bool.isRequired,
  };

  render() {
    const { walletService } = this.props;
    const { getNextAddressResponse, getNextAddressAttempt, getNextAddressRequestAttempt } = this.props;
    const { getNextAddressError } = this.props;
    const { constructTxRequestAttempt, constructTransactionAttempt, constructTxResponse } = this.props;
    const { publishTransactionResponse } = this.props;
    /* View that will be seen when user has a set Client */
    const receiveView = (
      <div>
        <h1>Receive Page</h1>
        <h3>Current address: {getNextAddressResponse === null ? 'Please refresh' : getNextAddressResponse.getAddress() }</h3>
        <RaisedButton
          disabled={getNextAddressRequestAttempt}
          onClick={!getNextAddressRequestAttempt? () => this.props.getNextAddressAttempt(0) : null}
          label={getNextAddressRequestAttempt ? 'Getting new address' : 'Get New Address'}/>
      </div>);
    const copayReceive = (
  <div style={styles.pageContentWrapper}>
          <div style={styles.center}>
            <div style={styles.header}>
							<p>My Decred Address</p>
						</div>
					</div>
          <div style={styles.center}>
						<div style={styles.center}>
              <img style={styles.img} src="img/qr.jpg" alt="" />
						</div>
						<div style={styles.well}>
							<p>{getNextAddressResponse === null ? 'Please refresh' : getNextAddressResponse.getAddress() } </p>
            </div>
            <div style={styles.center}>
							<p>Share this wallet address to receive payments, To protect your privacy, new addresses are generated automatically once you use them.</p>
						</div>
						<div style={styles.center}>
              <button 
              type="button" 
              style={styles.btnStyle()}
              onClick={!getNextAddressRequestAttempt? () => this.props.getNextAddressAttempt(0) : null}
              >Generate new address</button>
						</div>
					</div>
				</div>
    )
    /* Check to see that client is not undefined */
    if (walletService === null) {
      return (<ErrorScreen />);
    } else {
      return(copayReceive);
    }
  }
}

export default Receive;
