// @flow
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import ErrorScreen from '../ErrorScreen';
import KeyBlueButton from '../KeyBlueButton';
import SideBar from '../SideBar';
import Header from '../Header';
import qr from 'qr-image';
import { ReceiveStyles } from './ViewStyles';
//var receiveCopy = 'To maximize privacy, please use addresses one time only.';
class QRCode extends Component {
  static propTypes = {
    addr: PropTypes.string.isRequired
  };
  render() {
    const qr_img = qr.imageSync('decred:'+this.props.addr, {type: 'svg'});
    return (<div style={ReceiveStyles.contentNestQRImage} dangerouslySetInnerHTML={{__html:qr_img}}></div>);
  }
}

class Receive extends Component{
  constructor(props) {
    super(props);
    var accountName = '';
    if (props.balances !== null && props.getNextAddressResponse !== null) {
      for (var i = 0; i < props.balances.length; i++) {
        if (props.getNextAddressResponse.accountNumber == props.balances[i].accountNumber) {
          accountName = props.balances[i].accountName;
          break;
        }
      }
    }
    this.state = {
      account: props.getNextAddressResponse !== null ? props.getNextAddressResponse.accountNumber : 0,
      accountName: props.getNextAddressResponse !== null ? accountName : 'default',
    };
  }
  static propTypes = {
    walletService: PropTypes.object,
    getNextAddressResponse: PropTypes.object,
    getNextAddressRequestAttempt: PropTypes.bool.isRequired,
  };
  updateAccountNumber(accountNum) {
    this.setState({account: accountNum});
    if (this.props.balances != null) {
      for (var i = 0; i < this.props.balances.length; i++) {
        if (this.props.balances[i].accountNumber == accountNum) {
          this.setState({accountName: this.props.balances[i].accountName});
          break;
        }
      }
      this.props.getNextAddressAttempt(accountNum);
    }
  }
  render() {
    const { walletService } = this.props;
    const { getNextAddressResponse, getNextAddressRequestAttempt } = this.props;
    const { balances } = this.props;

    var selectAccounts = (
      <div style={ReceiveStyles.selectAccountsArea}>
        <select
          defaultValue={this.state.account}
          style={ReceiveStyles.selectAccounts}
          onChange={(e) =>{this.updateAccountNumber(e.target.value);}}
          >
          {balances !== null ?
            balances.map((account) => {
              if (account.accountName !== 'imported' && !account.hidden) {
                return (
                  <option style={ReceiveStyles.selectAccountsN} key={account.accountNumber} value={account.accountNumber}>
                    {account.accountName}
                  </option>
                );
              }
            }):
            null
          }
        </select>
      </div>);
    const receive = (
      <div style={ReceiveStyles.view}>
        <Header
          headerTitleOverview={<div style={ReceiveStyles.headerTitleReceive}>Receive Funds</div>}
          headerMetaOverview={<div style={ReceiveStyles.headerMetaReceive}>Each time you request a payment, create a new address to protect your privacy.</div>}/>
        <div style={ReceiveStyles.content}>
          <div style={ReceiveStyles.contentNestReceive}>
            <div style={ReceiveStyles.contentNestReceiveForAddress}>
              <div style={ReceiveStyles.contentNestReceiveForAddressIcon}></div>
              <div style={ReceiveStyles.contentNestPrefixReceive}>This address is for:</div>
              {selectAccounts}
            </div>
            <div style={ReceiveStyles.contentNestQR}>
              <div style={ReceiveStyles.contentNestQRHash}>{getNextAddressResponse !== null ? getNextAddressResponse.getAddress() : ''}</div>
              <QRCode addr={getNextAddressResponse !== null ? getNextAddressResponse.getAddress() : ''}/>
            </div>
          </div>
          <div style={ReceiveStyles.contentReceive}>
            <KeyBlueButton
              size="large"
              block={false}
              onClick={!getNextAddressRequestAttempt? () => this.props.getNextAddressAttempt(this.state.account) : null}
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
          {receive}
        </div>);
    }
  }
}

export default Receive;
