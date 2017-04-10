// @flow
import React, { Component, PropTypes } from 'react';
import ErrorScreen from '../ErrorScreen';
import KeyBlueButton from '../KeyBlueButton';
import SideBar from '../SideBar';
import Header from '../Header';
import qr from 'qr-image';
import { ReceiveStyles } from './ViewStyles';
var receiveCopy = 'To maximize privacy, please use addresses one time only.';
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
  constructor(props) {
    super(props);
    var accountName = '';
    if (props.getAccountsResponse !== null && props.getNextAddressResponse !== null) {
      for (var i = 0; i < props.getAccountsResponse.getAccountsList().length; i++) {
        if (props.getNextAddressResponse.accountNumber == props.getAccountsResponse.getAccountsList()[i].getAccountNumber()) {
          accountName = props.getAccountsResponse.getAccountsList()[i].getAccountName();
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
    if (this.props.getAccountsResponse != null) {
      for (var i = 0; i < this.props.getAccountsResponse.getAccountsList().length; i++) {
        if (this.props.getAccountsResponse.getAccountsList()[i].getAccountNumber() == accountNum) {
          this.setState({accountName: this.props.getAccountsResponse.getAccountsList()[i].getAccountName()});
          break;
        }
      }
      this.props.getNextAddressAttempt(accountNum);
    }
  }
  render() {
    const { walletService } = this.props;
    const { getNextAddressResponse, getNextAddressRequestAttempt } = this.props;
    const { getAccountsResponse } = this.props;

    var selectAccounts = (
      <div style={ReceiveStyles.selectAccountsArea}>
        <select
          defaultValue={this.state.account}
          style={ReceiveStyles.selectAccounts}
          onChange={(e) =>{this.updateAccountNumber(e.target.value);}}
          >
          {getAccountsResponse !== null ?
            getAccountsResponse.getAccountsList().map((account) => {
              if (account.getAccountName() !== 'imported') {
                return (
                  <option style={ReceiveStyles.selectAccountsN} key={account.getAccountNumber()} value={account.getAccountNumber()}>
                    {account.getAccountName()}
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
          headerTitleOverview="Current address"
          headerMetaOverview={
            getNextAddressResponse !== null ?
              <div style={{fontSize:'33px'}}>{getNextAddressResponse.getAddress()} <span style={ReceiveStyles.fromAccount}>from <span style={ReceiveStyles.fromAccountBold}>{this.state.accountName}</span> account</span></div> :
              <div></div>
          }
        />
        <div style={ReceiveStyles.content}>
          <div style={ReceiveStyles.center}>
            {getNextAddressResponse !== null ?
              <QRCode addr={getNextAddressResponse.getAddress()}/> :
              <div></div>
            }
            <p>Share this wallet address to receive payments. To protect your privacy, new addresses are generated automatically once you use them.</p>
            {selectAccounts}
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
