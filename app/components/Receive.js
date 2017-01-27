// @flow
import React, { Component, PropTypes } from 'react';
import ErrorScreen from './ErrorScreen';
import Button from './ButtonTanel';
import SideBar from './SideBar';
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
  header: {
    paddingRight: '80px',
    paddingLeft: '100px',
    backgroundColor: '#fff',
  },
  headerTop: {
    height: '106px',
    paddingBottom: '20px',
  },
  headerTitleOverview: {
    height: '54px',
    paddingTop: '13px',
    color: '#596d81',
    fontSize: '27px',
  },
  headerMetaOverview: {
    height: '54px',
    paddingTop: '5px',
    fontFamily: 'Inconsolata, monospace',
    fontSize: '33px',
  },
  content: {
    overflow: 'auto',
    height: '556px',
    padding: '54px 60px 54px 80px',
  },
  img: {
    width: '200px',
    margin: '25px 0 50px 0',
    marginLeft: '40%',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    color: 'white'
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
        <div style={styles.header}>
          <div style={styles.headerTop}></div>
          <div style={styles.headerTitleOverview}>Current address</div>
          <div style={styles.headerMetaOverview}>
            {getNextAddressResponse !== null ?
              getNextAddressResponse.getAddress() :
              <div></div>
            }
          </div>
        </div>
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
