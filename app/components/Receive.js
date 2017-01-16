// @flow
import React, { Component, PropTypes } from 'react';
import ErrorScreen from './ErrorScreen';
import Button from './ButtonTanel';
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

  pageContentWrapper: {
    //width: '100%',
    marginRight: '8px',
    position: 'absolute',
    paddingBottom: '60px',
  },

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
    width: '20%',
    height: '150px',
    margin: '25px 0 50px 0',
    marginLeft: '40%',
    backgroundColor: 'black',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white'
  },

  colXs12: {
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
    borderBottom: '1px solid #e2e2e2',
    backgroundColor: '#F9FBFC',
  },

  well: {
    width: 'auto',
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
};

class Receive extends Component{
  static propTypes = {
    walletService: PropTypes.object,
    getNextAddressResponse: PropTypes.object,
    getNextAddressRequestAttempt: PropTypes.bool.isRequired,
  };

  render() {
    const { walletService } = this.props;
    const { getNextAddressResponse, getNextAddressRequestAttempt } = this.props;

    const copayReceive = (
      <div style={styles.content}>
        <div style={styles.center}>
          <div style={styles.header}>
						<p>My Decred Address</p>
					</div>
				</div>
        <div style={styles.center}>
          <div style={styles.img}>QR CODE</div>
					<div style={styles.well}>
						<p>{getNextAddressResponse === null ? 'Please refresh' : getNextAddressResponse.getAddress() } </p>
          </div>
          <div style={styles.center}>
						<p>Share this wallet address to receive payments, To protect your privacy, new addresses are generated automatically once you use them.</p>
					</div>
					<div style={styles.center}>
            <Button
              size="large"
              block={false}
              onClick={!getNextAddressRequestAttempt? () => this.props.getNextAddressAttempt(0) : null}
              >
              Generate new address
            </Button>
					</div>
				</div>
			</div>
    );
    if (walletService === null) {
      return (<ErrorScreen />);
    } else {
      return(
        <div style={styles.body}>
          <Header />
          <SideBar />
          {copayReceive}
        </div>);
    }
  }
}

export default Receive;
