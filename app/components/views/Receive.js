// @flow
import React, { Component } from 'react';
import { PropTypes } from 'prop-types';
import ErrorScreen from '../ErrorScreen';
import KeyBlueButton from '../KeyBlueButton';
import SideBar from '../SideBar';
import Header from '../Header';
import qr from 'qr-image';
import CopyToClipboardButton from '../CopyToClipboardButton';
import { ReceiveStyles } from './ViewStyles';
import Select from 'react-select';

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
    var defaultAccount;
    var accountsList = Array();
    if (props.balances !== null && props.getNextAddressResponse !== null) {
      for (var i = 0; i < props.balances.length; i++) {
        if (props.getNextAddressResponse.accountNumber == props.balances[i].accountNumber) {
          defaultAccount = { value: props.balances[i].accountNumber, label: props.balances[i].accountName};
        }
        if (props.balances[i].accountName !== 'imported' && !props.balances[i].hidden) {
          accountsList.push({ value: props.balances[i].accountNumber, label: props.balances[i].accountName});
        }
      }
    }
    this.state = {
      account: defaultAccount,
      accountsList: accountsList
    };
  }
  static propTypes = {
    walletService: PropTypes.object,
    getNextAddressResponse: PropTypes.object,
    getNextAddressRequestAttempt: PropTypes.bool.isRequired,
  };
  updateAccountNumber(account) {
    this.setState({account: account});
    this.props.getNextAddressAttempt(account.value);
  }
  render() {
    const { walletService } = this.props;
    const { getNextAddressResponse, getNextAddressRequestAttempt } = this.props;

    var selectAccounts = (
      <Select
        clearable={false}
        style={{zIndex:'9'}}
        onChange={(val) => this.updateAccountNumber(val)}
        placeholder={'Select account...'}
        multi={false}
        value={this.state.account}
        valueKey="value" labelKey="label"
        options={this.state.accountsList}/>);

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
              <div style={ReceiveStyles.receiveSelectAccountInput}>
                {selectAccounts}
              </div>
            </div>
            <div style={ReceiveStyles.contentNestQR}>
              <div style={ReceiveStyles.contentNestQRHash}>
                {getNextAddressResponse !== null ? [
                    <span>{getNextAddressResponse.getAddress()}</span>,
                    <CopyToClipboardButton style={ReceiveStyles.contentNestCopyToClipboardIcon} textToCopy={getNextAddressResponse.getAddress()} />
                  ] : ''
                }
              </div>
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
