// @flow
import React, { Component, PropTypes } from 'react';
import ErrorScreen from '../ErrorScreen';
import KeyBlueButton from '../KeyBlueButton';
import SideBar from '../SideBar';
import Header from '../Header';
import qr from 'qr-image';
import { ReceiveStyles } from './ViewStyles';

class QRCode extends Component {
  static propTypes = {
    addr: PropTypes.string.isRequired
  };
  render() {
    const qr_img = qr.imageSync('decred:'+this.props.addr, {type: 'svg'});
    return (<div style={ReceiveStyles.img} dangerouslySetInnerHTML={{__html:qr_img}}></div>);
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
      <div style={ReceiveStyles.view}>
        <Header
          headerTitleOverview="Current address"
          headerMetaOverview={
            getNextAddressResponse !== null ?
              <div style={{fontSize:'33px'}}>{getNextAddressResponse.getAddress()}</div> :
              <div></div>
          }
        />
        <div style={ReceiveStyles.content}>
          <div style={ReceiveStyles.center}>
            {getNextAddressResponse !== null ?
              <QRCode addr={getNextAddressResponse.getAddress()}/> :
              <div></div>
            }
            <p>Share this wallet address to receive payments, To protect your privacy, new addresses are generated automatically once you use them.</p>
            <KeyBlueButton
              size="large"
              block={false}
              onClick={!getNextAddressRequestAttempt? () => this.props.getNextAddressAttempt(0) : null}
              >
              Generate new address
            </KeyBlueButton>
          </div>
        </div>
			</div>
    );
    if (walletService === null) {
      return (<ErrorScreen />);
    } else {
      return(
        <div style={ReceiveStyles.body}>
          <SideBar />
          {copayReceive}
        </div>);
    }
  }
}

export default Receive;
