// @flow
import React, { Component, PropTypes } from 'react';
import ErrorScreen from './ErrorScreen';
import Button from './ButtonTanel';
import SideBar from './SideBar';
import Header from './Header';
import qr from 'qr-image';

const styles = {
  body: {
    position: 'fixed',
    left: '0px',
    top: '50%',
    right: '0px',
    display: 'block',
    overflow: 'hidden',
    width: '1178px',
    height: '770px',
    marginTop: '-385px',
    marginRight: 'auto',
    marginLeft: 'auto',
    backgroundColor: '#FFF',
  },
  view: {
    width: '880px',
    height: '100%',
    float: 'right',
    backgroundColor: '#f3f6f6',
  },
  content: {
    overflow: 'auto',
    height: '556px',
    padding: '54px 60px 54px 80px',
  },
  img: {
    width: '250px',
    paddingLeft: '244px',
  },
  center: {
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  }
};

class QRCode extends Component {
  static propTypes = {
    addr: PropTypes.string.isRequired
  };
  render() {
    const qr_img = qr.imageSync('decred:'+this.props.addr, {type: 'svg'});
    return (<div style={styles.img} dangerouslySetInnerHTML={{__html:qr_img}}></div>);
  }
}

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
      <div style={styles.view}>
        <Header 
          headerTitleOverview="Current address"
          headerMetaOverview={
            getNextAddressResponse !== null ?
              <div style={{fontSize:'33px'}}>{getNextAddressResponse.getAddress()}</div> :
              <div></div>
          }
        />
        <div style={styles.content}>
          <div style={styles.center}>
            {getNextAddressResponse !== null ?
              <QRCode addr={getNextAddressResponse.getAddress()}/> :
              <div></div>
            }
            <p>Share this wallet address to receive payments, To protect your privacy, new addresses are generated automatically once you use them.</p>
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
          <SideBar />
          {copayReceive}
        </div>);
    }
  }
}

export default Receive;
